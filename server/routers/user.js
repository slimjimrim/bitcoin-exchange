const express = require("express");
const bcrypt = require("bcryptjs");
const { Client } = require("bitcoin-simple-rpc");
const { RegtestUtils } = require("regtest-client");

const User = require("../models/user");
const bitcoin = require("./bitcoin");
const { BITCOIN_NODE_URL, BITCOIN_NODE_AUTH } = require("../constants");

const router = express.Router();

const bitcoinClient = new Client({
  baseURL: BITCOIN_NODE_URL,
  auth: BITCOIN_NODE_AUTH
});

// Route handlers ==============================================================
async function registerUser(req, res) {
  console.log("registerUser() ------------------------------------");
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).send("User with the provided email already exist.");
  }

  try {
    user = new User(req.body);
    user.password = await bcrypt.hash(password, 8);
    console.log("REGISTERED USER...\n" + user);
    const btcAddress = await bitcoinClient.getNewAddress(user.email);
    console.log("USERS BTC ADDRESS...\n" + btcAddress);
    user.btc_address = btcAddress;
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(500).send("Something went wrong. Try again later.");
  }
}

async function loginUser(req, res) {
  console.log("loginUser() ------------------------------------");
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("User with provided email does not exist.");
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).send("Invalid credentials.");
    }
    const { password, access_token, ...rest } = user.toObject();
    return res.send(rest);
  } catch (error) {
    return res.status(500).send("Something went wrong. Try again later.");
  }
}

// Routes ======================================================================
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
