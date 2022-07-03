# Simple BTC Exchange

This project utilizes:
- React
- MongoDB
- Node/Express
- Plaid sandbox API
- Bitcoin Core (regtest)

## Project setup

Clone the repo and install
```
cd bitcoin-exchange
npm install
cd server
npm install
```

Start up MongoDB - default port is (`localhost:27017`)
  - follow [this](https://levelup.gitconnected.com/how-to-install-mongodb-database-on-local-environment-19a8a76f1b92) guide for setup help

Start up Bitcoin Core in `-regtest` mode - default port is (`localhost:18443`)
  - follow [this](https://gist.github.com/maxogden/1a172d659491f2b30fd4ffe67e94b964) for setup help
  - NOTE: only perform steps 1, 2, and 3 to start bitcoin core in regtest mode.
  - configure (or remove) username/password for your node in `server/constants.js`

Run tests
```
cd bitcoin-exchange/server
npm run test
```

Configure Plaid API (if Plaid API test fails)
- get client_id and secret [here](https://dashboard.plaid.com/team/keys)
- copy/paste values for `PLAID_CLIENT_ID` and `PLAID_SECRET` in `server/constants.js`
- configure redirect URI [here](https://dashboard.plaid.com/team/api) - add `http://localhost:3006`

Start the server - `localhost:3030`
```
cd bitcoin-exchange/server
npm run start
```

Start the React app - `localhost:3006`
```
cd bitcoin-exchange
npm run start
visit localhost:3006 in the browser
```

## NOTES

### Areas of improvement
- All sensitive info like API keys should be environment variables
- Various front-end features:
  - persist user session to prevent logging in on every browser refresh
  - better styling
- Better implementation of BTC transaction fees
- More extensive unit/integration tests
- Containerize the app

### What I learned
- Better understanding of BTC's wallets and UTXO model
- React hooks are awesome. They greatly simplify react code :)
