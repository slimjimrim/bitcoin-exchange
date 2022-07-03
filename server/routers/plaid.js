const express = require("express");
const {
  Configuration,
  PlaidApi,
  PlaidEnvironments
} = require('plaid');

const {
  PLAID_ENV,
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_REDIRECT_URI
} = require("../constants");
const User = require("../models/user");
const Account = require("../models/account");

const router = express.Router();

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

// Route handlers ==============================================================
async function createLink(req, res) {
  console.log("createLink() ------------------------------------");
  // Verify the user's id
  const userId = req.body.user_id;
  const user = await User.findOne({ _id: userId });

  let clientUserId
  if (!user) {
    return res.status(400).send("No user found for provided _id.");
  } else {
    clientUserId = user._id;
  }

  const request = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: clientUserId,
    },
    client_name: 'Plaid Test App',
    products: ['auth'],
    language: 'en',
    webhook: 'https://webhook.example.com',
    redirect_uri: PLAID_REDIRECT_URI,
    country_codes: ['US'],
  };
  try {
    const createTokenResp = await client.linkTokenCreate(request);
    res.send(createTokenResp.data);
  } catch (error) {
    console.log("Error:", error);
  }
};

async function exchangePublicToken(req, resp, next) {
  console.log("exchangePublicToken() ------------------------------------");
  const publicToken = req.body.public_token;
  const userId = req.body.user_id;

  try {
    const accessTokenResp = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = accessTokenResp.data.access_token;
    const itemID = accessTokenResp.data.item_id;
    const filter = {_id: userId};
    const update = {access_token: accessToken};
    const updatedUser = await User.findOneAndUpdate(filter, update);
    await getPlaidAccounts(updatedUser, accessToken, resp);
  } catch (error) {
    console.error(error);
    resp.status(500).send("Something went wrong. Try again later");
  }
}

async function getPlaidAccounts(user, accessToken, resp) {
  console.log("getPlaidAccounts() ------------------------------------");
  const accountsResp = await client.accountsGet({ access_token: accessToken });
  const accounts = accountsResp.data.accounts.map(acct => {
    acct.user_id = user._id;
    return acct;
  });
  // Will produce dublicates as of now, so dont authenticate twice
  await Account.insertMany(accountsResp.data.accounts, function (err, docs) {
    if (err){
      console.error(err);
      resp.status(500).send("Error getting accounts from Plaid.");
    } else {
      console.log("ACCOUNTS UPDATED...");
      resp.status(202).send("Plaid account successfully linked!");
    }
  });
}

// move this to accounts.js
async function getAccounts(req, resp) {
  console.log("getAccounts() ------------------------------------");
  const userId = req.body.user_id;

  try {
    const user = await User.findOne({ _id: userId });
    const accounts = await Account.find( { user_id: user._id });
    resp.status(200).send(accounts);
  } catch (err) {
    console.error(err);
    resp.status(500).send("Something went wrong. Try again later");
  }
}

// Routes ======================================================================
router.post("/api/create_link_token", createLink);
router.post("/api/exchange_public_token", exchangePublicToken);
router.post("/api/get_accounts", getAccounts);

module.exports = router;
