module.exports = {
  BITCOIN_NODE_URL: "http://127.0.0.1:18443/",
  BITCOIN_NODE_AUTH: {
    username: "foobar",
    password: "foobar"
  }, // should be env variabl,
  BITCOIN_PRICE_URL: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
  PLAID_CLIENT_ID: "6292dad702a1cd0013d08133",
  PLAID_SECRET: "9643d22a00229c870be16656d399f9",
  PLAID_ENV: "sandbox",
  PLAID_REDIRECT_URI: "http://localhost:3006/"
}
