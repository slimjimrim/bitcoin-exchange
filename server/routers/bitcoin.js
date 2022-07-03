const express = require("express");
const bitcoin = require("bitcoinjs-lib");
const axios = require("axios");
const { RegtestUtils } = require("regtest-client");

const {
  Configuration,
  PlaidApi,
  PlaidEnvironments
} = require('plaid');
const { ECPairFactory } = require("ecpair");
const ecc = require("tiny-secp256k1");
const { Client } = require("bitcoin-simple-rpc");

const User = require("../models/user");
const Account = require("../models/account");
const {
  BITCOIN_PRICE_URL,
  BITCOIN_NODE_URL,
  BITCOIN_NODE_AUTH,
  PLAID_ENV,
  PLAID_CLIENT_ID,
  PLAID_SECRET,
} = require("../constants");

const router = express.Router();
const regtestUtils = new RegtestUtils({APIURL: BITCOIN_NODE_URL});
const network = regtestUtils.network; // regtest network params
const ECPair = ECPairFactory(ecc);

const exchangeWalletName = "master";
const exchangeAddressName = "master";
const satsPerBtc = 100000000;
const bitcoinClient = new Client({
  baseURL: BITCOIN_NODE_URL,
  auth: BITCOIN_NODE_AUTH
});

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});
const plaidClient = new PlaidApi(configuration);

let walletInfo;

// Init the wallet (move to separate module) ===================================
async function createWallet() {
  try {
    console.log("CREATING WALLET...");
    bitcoinClient.createWallet(exchangeWalletName)
      .then(resp => {
        console.log("WALLET CREATED...");
        console.log(resp);
        return resp;
      })
      .then(resp => bitcoinClient.getWalletInfo())
      .then(resp => {
        walletInfo = resp;
        console.log("WALLET INFO...");
        console.log(walletInfo);
      })
      .then(resp => bitcoinClient.getNewAddress(exchangeAddressName))
      .then(resp => bitcoinClient.generateToAddress(101, resp)) // mine some blocks to fund wallet
      .catch(err => {
        console.error(err.message);
      });
  } catch (err) {
  }
}

async function loadWallet() {
  try {
    console.log("LOADING WALLET...");
    bitcoinClient.loadWallet(exchangeWalletName)
      .then(resp => {
        console.log("WALLET LOADED...");
        console.log(resp);
        return resp;
      })
      .then(resp => bitcoinClient.getWalletInfo())
      .then(resp => {
        walletInfo = resp;
        console.log("WALLET INFO...");
        console.log(walletInfo);
      })
      .catch(err => {
        const noWallet = err.message.match("Path does not exist"); // yikes
        if (noWallet.length > 0) {
          console.log("FRESH BLOCKCHAIN, NO WALLETS...");
          createWallet();
          return;
        }
        console.error(err.message);
      });
  } catch (err) {
  }
}

async function getWalletInfo() {
  try {
    bitcoinClient.getWalletInfo()
      .then(resp => {
        walletInfo = resp;
        console.log("WALLET ALREADY LOADED...");
        console.log(walletInfo);
      })
      .catch(err => {
        const noWallet = err.message.match("No wallet is loaded"); // yikes
        if (noWallet.length > 0) {
          console.log("NO WALLET LOADED...");
          loadWallet();
          return;
        }
        console.error(err.message);
      });
  } catch (err) {
    return err;
  }
}

getWalletInfo();

// Route handlers ==============================================================
async function checkUserFunds(user_id, btc_amount, plaid_account) {
  const user = await User.findOne({ _id: user_id });
  const resp = await plaidClient.accountsBalanceGet({access_token: user.access_token});
  const accounts = resp.data.accounts;
  const account = accounts.filter(account => account.account_id === plaid_account);
  const balance = account[0].balances.available;

  const priceResp = await axios.get(BITCOIN_PRICE_URL);
  const exchangeRate = priceResp.data.bitcoin.usd;
  const amountToPay = exchangeRate * btc_amount;

  return (balance > amountToPay) ? true : false;
}

async function buyBitcoin(req, res) {
  console.log("buyBitcoin() ------------------------------------");
  const { user_id, btc_amount, plaid_account } = req.body;

  try {
    const userHasEnoughFunds = await checkUserFunds(user_id, btc_amount, plaid_account);
    if (!userHasEnoughFunds) {
      throw "You don't have enough in your bank account.";
    }

    // Charge the users bank account here...
    // chargeUser()

    const user = await User.findOne({ _id: user_id });
    const groupings = await bitcoinClient.listAddressGroupings();
    const master = groupings.filter(grouping => grouping[0][2] === exchangeAddressName);
    const masterAddress = master[0][0][0];
    const fee = 0.0001;

    const psbt = new bitcoin.Psbt({network});
    const unspent = await bitcoinClient.listUnspent();
    const exchangeUtxos = unspent.filter(utxo => utxo.address === masterAddress);
    const utxo = exchangeUtxos[0]; // just use the lastest utxo for now
    const pubKey = utxo.address;
    const privKey = await bitcoinClient.dumpPrivKey(pubKey);
    const keyPair = ECPair.fromWIF(privKey, network);

    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        script: Buffer.from(utxo.scriptPubKey, "hex"),
        value: Math.round(utxo.amount * satsPerBtc)
      }
    });
    psbt.addOutput({ // destination
      address: user.btc_address,
      value: Math.round(btc_amount * satsPerBtc)
    });
    psbt.addOutput({ // send change back
      address: masterAddress,
      value: Math.round((utxo.amount - btc_amount - fee) * satsPerBtc)
    });
    psbt.signInput(0, keyPair);
    psbt.finalizeAllInputs();
    const tx = psbt.extractTransaction(true).toHex();
    bitcoinClient.sendRawTransaction(tx).then(resp => {
      console.log("TRANSACTION SUCCESSFULLY BROADCASTED!...");
      console.log(resp);
      // Save transaction to db here
      return resp;
    }).then(resp => bitcoinClient.generateToAddress(1, masterAddress)) // mine the tx
    .then(resp => {
      console.log("TRANSACTION SUCCESSFULLY MINED!...");
      res.send("tx successful");
    })
  } catch (error) {
    console.log("Error:", error);
    res.status(403).send(error);
  }
};

async function getBalance(req, resp) {
  console.log("getBalance() ----------------------------------");
  const { user_id } = req.body;

  try {
    const user = await User.findOne({ _id: user_id });
    const utxos = await bitcoinClient.listUnspent(undefined, undefined, [user.btc_address]);
    const balance = utxos.reduce((total, utxo) => {
      total += utxo.amount;
      return total;
    }, 0);
    resp.status(200).send({
      btc_balance: balance
    });
  } catch (err) {
    console.error(err.message);
  }
}

// Routes ======================================================================
router.post("/api/buy_bitcoin", buyBitcoin);
router.post("/api/get_balance", getBalance);

module.exports = router;
