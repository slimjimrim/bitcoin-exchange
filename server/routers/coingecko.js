const axios = require("axios");
const express = require("express");

const {
  COINGECKO_PRICE_API_URL,
  COINGECKO_API_URL,
} = require("../constants");

const router = express.Router();

// Route handlers ==============================================================
async function getTimeseries(req, res) {
  const { asset, interval } = req.query;
  console.log("getTimeseries() ------------------------------------");
  console.log("asset, interval: " + asset + ", " + interval);

  try {
    const response = await axios.get(`${COINGECKO_API_URL + '/' + asset}/market_chart?vs_currency=usd&days=${interval}`);
    res.status(201).send(response.data);
  } catch (e) {
    console.error(e);
    res.status(500).send("Something went wrong. Try again later.");
  }
}

async function getCoinInfo(req, res) {
  const { asset } = req.query;
  console.log("getCoinInfo() ------------------------------------");
  console.log("asset: " + asset);

  try {
    const response = await axios.get(`${COINGECKO_API_URL + asset}`);
    res.status(201).send(response.data);
  } catch (e) {
    console.error(e);
    res.status(500).send("Something went wrong. Try again later.");
  }
}

async function getPrice(req, res) {
  const { asset } = req.query;
  console.log("getPrice() ------------------------------------");
  console.log("asset: " + asset);

  try {
    const response = await axios.get(`${COINGECKO_PRICE_API_URL + asset}`);
    res.status(201).send(response.data);
  } catch (e) {
    console.error(e);
    res.status(500).send("Something went wrong. Try again later.");
  }
}

// Routes ======================================================================
router.get("/timeseries", getTimeseries);
router.get("/coin", getCoinInfo);
router.get("/price", getPrice);

module.exports = router;
