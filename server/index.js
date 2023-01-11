const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");

const plaidRouter = require("./routers/plaid");
const userRouter = require("./routers/user");
const bitcoinRouter = require("./routers/bitcoin");
const coingeckoRouter = require("./routers/coingecko");

require("./db");

const app = express();
const PORT = process.env.PORT || 3030;

// use react app build folder for server starting point
// app.use(express.static(path.join(__dirname, '..', 'build')));

// client sends data in JSON format
app.use(express.json());

app.use(cors());
app.use(plaidRouter);
app.use(userRouter);
app.use(bitcoinRouter);
app.use(coingeckoRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
