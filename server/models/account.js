const mongoose = require("mongoose");
const balanceSchema = require("./balance");

const accountSchema = mongoose.Schema(
  {
    account_id: {
      type: String,
      required: true,
      trim: true
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    balances: {
      type: balanceSchema,
      required: true,
    },
    mask: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    official_name: {
      type: String,
      required: true,
      trim: true,
    },
    subtype: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true
  }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;

// {
//   account_id: 'vEQRELzPmxIj4XvRNLpAh56rXXAqzMInZe4Lr',
//   balances: [Object],
//   mask: '0000',
//   name: 'Plaid Checking',
//   official_name: 'Plaid Gold Standard 0% Interest Checking',
//   subtype: 'checking',
//   type: 'depository'
// },
