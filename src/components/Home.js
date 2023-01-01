import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import {
  BASE_API_URL,
  BITCOIN_PRICE_URL
} from "../utils/constants";
import { formatPrice } from "../utils/utils";
import Accounts from "./Accounts";
import Chart from "./Chart";

const queryClient = new QueryClient();

const Home = (props) => {
  console.log("USER: " + props.user);
  const { register, handleSubmit, errors } = useForm();
  const [userDetails, setUserDetails] = useState(props.user);
  const [accounts, setAccounts] = useState([]); // account stuff should be in a custom hook so components can share!
  const [selectedAccount, setSelectedAccount] = useState();
  const [amount, setAmount] = useState({value: 0});
  const [btcPrice, setBtcPrice] = useState(null);
  const [btcBalance, setBtcBalance] = useState(null);
  const [isBuyProcessing, setIsBuyProcessing] = useState(false);

  // Redirect to login if there's no user
  if (!(Object.keys(props.user).length > 0)) {
    props.history.push("/");
  }

  async function getAccountDetails() {
    try {
      const accounts = await axios.post(`${BASE_API_URL}/api/get_accounts`, {
        user_id: userDetails._id
      });

      setAccounts(accounts.data);
    } catch (err) {
      if (err.response) {
        console.log("Error:", err.response.data);
      }
    }
  }

  async function getBTCPrice() {
    const resp = await axios.get(BITCOIN_PRICE_URL);
    setBtcPrice(resp.data.bitcoin);
  }

  async function getBalance() {
    try {
      const resp = await axios.post(`${BASE_API_URL}/api/get_balance`, {
        user_id: userDetails._id
      });
      setBtcBalance({btc_balance: resp.data.btc_balance});
    } catch (err) {
      if (err.response) {
        console.log("Error:", err.response.data);
      }
    }
  }

  async function buyBtc(data) {
    try {
      setIsBuyProcessing(true);
      const resp = await axios.post(`${BASE_API_URL}/api/buy_bitcoin`, {
        user_id: userDetails._id,
        btc_amount: Number(data.btc_amount),
        plaid_account: data.selected_account
      });
      setIsBuyProcessing(false);
      Swal.fire({
        icon: "success",
        title: "Congrats!",
        text: `You've successfully bought ${data.btc_amount} BTC!`
      });
      getBalance();
    } catch (err) {
      if (err.response) {
        setIsBuyProcessing(false);
        console.log("Error:", err.response.data);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.stringify(err.response.data)
        });
      }
    }
  }

  useEffect(() => {
    if (userDetails._id) {
      getAccountDetails();
      getBalance();
    }
    getBTCPrice();
  }, []);

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <Grid container spacing={2}>
        {/* BTC balance */}
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                BTC Balance
              </Typography>
              <br />
              <Typography variant="body2">
                { (btcBalance && btcPrice) ? `${btcBalance.btc_balance} - (${formatPrice(btcBalance.btc_balance * btcPrice.usd)})` : "Loading" }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* BTC price */}
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                BTC Price
              </Typography>
              <br />
              <Typography variant="body2">
                { btcPrice ? formatPrice(btcPrice.usd) : "Loading" }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* user info */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                User Info:
              </Typography>
              <br />
              <Typography variant="body2" className="user-info">
                <span className="">First name: {userDetails.first_name}</span>
                <span className="">Last name: {userDetails.last_name}</span>
                <span className="">Email: {userDetails.email}</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* account info */}
        <Accounts accounts={accounts} userDetails={userDetails} getAccountDetails={getAccountDetails} />
        {/* buy mooar */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Buy:
              </Typography>
              <br />
              <Form className="" onSubmit={handleSubmit(buyBtc)}>

                <Form.Group controlId="btc_amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="btc_amount"
                    step="0.0001"
                    value={ amount.value }
                    onChange={e => setAmount({ value: e.target.value })}
                    placeholder="Enter the amount of BTC"
                    ref={register({
                      required: "An amount is required.",
                      min: 0.0001
                    })}
                    className={`${errors.btc_amount ? "input-error" : ""}`}
                  />
                  { errors.btc_amount && (
                    <p className="errorMsg">{ errors.btc_amount.message }</p>
                  )}
                </Form.Group>

                <Form.Group controlId="selected_account">
                  <Form.Label>Funding</Form.Label>
                  <Form.Control
                    as="select"
                    name="selected_account"
                    ref={register({
                      required: "An account is required"
                    })}
                    onChange={e => {
                      console.log("e.target.value", e.target.value);
                      setSelectedAccount(e.target.value);
                    }}
                  >
                    { accounts.length > 0 ? accounts.map(account => {
                      return <option key={account.account_id} value={account.account_id}>{`${account.name} - ${formatPrice(account.balances.available)}`}</option>
                    }) : <option>Connect an account to make a purchase</option> }
                  </Form.Control>
                </Form.Group>

                <p className="my-2">TOTAL COST: { (amount && btcPrice) ? formatPrice(amount.value * btcPrice.usd) : "Loading..." }</p>

                <Button variant="contained" type="submit" disabled={accounts.length === 0}>
                  Buy Bitcoin
                </Button>
                <p className="my-2">{ isBuyProcessing ? "Processing..." : "" }</p>
                { accounts.length === 0 && (
                  <p className="errorMsg">Connect your bank account above if you would like to purchase BTC.</p>
                )}
              </Form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* <div className="">
        <div className="chart">
          <QueryClientProvider client={queryClient}>
            <Chart />
            <ReactQueryDevtools />
          </QueryClientProvider>
        </div>
      </div> */}
    </div>
  );
};

export default Home;
