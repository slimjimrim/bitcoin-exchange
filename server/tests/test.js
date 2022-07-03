// Requiring module
const assert = require('assert');
const expect = require('chai').expect;
const { Client } = require("bitcoin-simple-rpc");
const mongoose = require("mongoose");
const { RegtestUtils } = require("regtest-client");
const {
  Configuration,
  PlaidApi,
  PlaidEnvironments
} = require('plaid');

const {
  BITCOIN_PRICE_URL,
  BITCOIN_NODE_URL,
  BITCOIN_NODE_AUTH,
  PLAID_ENV,
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_REDIRECT_URI
} = require("../constants");

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
const bitcoinClient = new Client({
  baseURL: BITCOIN_NODE_URL,
  auth: BITCOIN_NODE_AUTH
});

// We can group similar tests inside a describe block
describe("Running some tests", () => {

  describe("Tests connection with services...", () => {
    it("Has a connection to BTC node", async () => {
      await bitcoinClient.getWalletInfo()
        .then(resp => {
        })
        .catch(err => {
          const noWallet = err.message.match("No wallet is loaded"); // yikes
          if (noWallet.length > 0) {}
        });
    });

    it("Has a connection to Plaid API", async () => {
      const request = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: "1234",
        },
        client_name: 'Plaid Test App',
        products: ['auth'],
        language: 'en',
        webhook: 'https://webhook.example.com',
        redirect_uri: PLAID_REDIRECT_URI,
        country_codes: ['US'],
      };
      try {
        const createTokenResp = await plaidClient.linkTokenCreate(request);
      } catch (error) {
        console.log("Error connecting to Plaid API:", error);
        throw console.error();
      }
    });
  });

  describe("Testing models...", () => {
    beforeEach(function(done) {
      mongoose.connect('mongodb://127.0.0.1:27017/form-user');
      mongoose.connection.once('connected', () => {
        done();
      });
    });

    afterEach(function(done) {
      mongoose.disconnect();
      done();
    });

    it("Shouldn't save a User without all required fields", async (done) => {
      const User = require("../models/user");
      const user = new User({
        first_name: "foo",
        last_name: "bar",
        email: "foobar@baz.com"
        // missing password
      });
      user.save((err) => {
        expect(err).to.exist.and.be.instanceof(Error);
        // console.error(err);
      });
      done();
    });

    it("Shouldn't save an Account without all required fields", async (done) => {
      const Account = require("../models/account");
      const account = new Account({
        account_id: "foo",
        user_id: "123",
        // missing balances
        mask: "123",
        name: "Big Bank",
        official_name: "Big Bank of America",
        subtype: "foobarbaz",
        type: "foobarbaz",
      });
      account.save((err) => {
        expect(err).to.exist.and.be.instanceof(Error);
        // console.error(err);
      });
      done();
    });
  });
});
