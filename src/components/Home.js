import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import ReactHookSelect from 'react-hook-select'
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import {
  BASE_API_URL,
  BITCOIN_PRICE_URL
} from "../utils/constants";
import { formatter } from "../utils/utils";
import Accounts from "./Accounts";
import Link from "./Link";

const Home = (props) => {
  console.log(props.user);
  const { register, handleSubmit, errors } = useForm();
  const [userDetails, setUserDetails] = useState(props.user);
  const [linkToken, setLinkToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();
  const [amount, setAmount] = useState({value: 0});
  const [btcPrice, setBtcPrice] = useState(null);
  const [btcBalance, setBtcBalance] = useState(null);
  const [isBuyProcessing, setIsBuyProcessing] = useState(false);

  // Redirect to login if there's no user
  if (!(Object.keys(props.user).length > 0)) {
    props.history.push("/");
  }

  async function generateLinkToken() {
    try {
      const linkToken = await axios.post(`${BASE_API_URL}/api/create_link_token`, {
        user_id: userDetails._id
      });
      setLinkToken(linkToken.data.link_token);
    } catch (err) {
      if (err.response) {
        console.log("Error:", err.response.data);
      }
    }
  }

  async function getAccountDetails() {
    try {
      const accounts = await axios.post(`${BASE_API_URL}/api/get_accounts`, {
        user_id: userDetails._id
      });
      console.log(accounts.data);
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
      generateLinkToken();
      getAccountDetails();
      getBalance();
    }
    getBTCPrice();
  }, []);

  return (
    <div>
      <h1>BEST BITCOIN EXCHANGE</h1>
      <br />
      <div className="mx-auto container mbott-6">
        <h3>User info:</h3>
        <p className="text-black">First name: {userDetails.first_name}</p>
        <p className="text-black">Last name: {userDetails.last_name}</p>
        <p className="text-black">Email: {userDetails.email}</p>
        <br />
        { linkToken != null ? (<Link linkToken={linkToken} user={userDetails} getAccountDetails={getAccountDetails} />) : (<div></div>) }
        <Accounts accounts={accounts} />
        <br />
        <div>
          <h3>BTC Balance: </h3>
          <p className="text-black">{ (btcBalance && btcPrice) ? `${btcBalance.btc_balance} - (${formatter.format(btcBalance.btc_balance * btcPrice.usd)})` : "Loading" }</p>
          <br />
          <h3>BTC Price: </h3>
          <p className="text-black">{ btcPrice ? formatter.format(btcPrice.usd) : "Loading" }</p>
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
                  return <option key={account.account_id} value={account.account_id}>{`${account.name} - ${formatter.format(account.balances.available)}`}</option>
                }) : <option>Connect an account to make a purchase</option> }
              </Form.Control>
            </Form.Group>

            <p className="my-2">TOTAL COST: { (amount && btcPrice) ? formatter.format(amount.value * btcPrice.usd) : "Loading..." }</p>

            <Button variant="primary" type="submit" disabled={accounts.length === 0}>
              Buy Bitcoin
            </Button>
            <p className="my-2">{ isBuyProcessing ? "Processing..." : "" }</p>
            { accounts.length === 0 && (
              <p className="errorMsg">Connect your bank account above if you would like to purchase BTC.</p>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Home;
