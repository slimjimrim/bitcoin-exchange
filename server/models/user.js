const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true
    },
    last_name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!value.match(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/)) {
          throw new Error("Email is not valid.");
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6
    },
    // should probably be its own model
    access_token: {
      type: String,
      required: false,
      trim: true,
    },
    btc_address: {
      type: String,
      required: false,
      trim: true,
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
