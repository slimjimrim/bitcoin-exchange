const mongoose = require("mongoose");

const balanceSchema = mongoose.Schema(
  {
    available: {
      type: Number,
      required: true,
    },
    current: {
      type: Number,
      required: true,
    },
    iso_currency_code: {
      type: String,
      required: true,
      trim: true,
    },
    unofficial_currency_code: {
      type: String,
      required: false,
      trim: true,
    },
    limit: {
      type: Number,
      required: false,
    }
  },
  {
    timestamps: true
  }
);

module.exports = balanceSchema;

// {
//   available: 100,
//   current: 110,
//   iso_currency_code: 'USD',
//   limit: null,
//   unofficial_currency_code: null
// }
