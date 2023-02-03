module.exports = {
  BITCOIN_NODE_URL: "http://127.0.0.1:18443/",
  BITCOIN_NODE_AUTH: {
    username: "foobar",
    password: "foobar"
  }, // should be env variabl,
  COINGECKO_PRICE_API_URL: "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=",
  COINGECKO_API_URL: "https://api.coingecko.com/api/v3/coins/",
  PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
  PLAID_SECRET: process.env.PLAID_SECRET,
  PLAID_ENV: "sandbox",
  PLAID_REDIRECT_URI: "http://localhost:3006/"
}
