import React, { useEffect, useState } from "react";
import axios from "axios";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Link from "./Link";
import { formatPrice } from "../utils/utils";
import { BASE_API_URL } from "../utils/constants";

const Account = (props) => {
  return (
    <span className="account-info">
      <br />
      <span className="">Name: { props.account.name }</span>
      <span className="">Balance: { formatPrice(props.account.balances.available) }</span>
    </span>
  );
}

const Accounts = (props) => {

  const [linkToken, setLinkToken] = useState(null);

  async function generateLinkToken() {
    try {
      const linkToken = await axios.post(`${BASE_API_URL}/api/create_link_token`, {
        user_id: props.userDetails._id
      });
      setLinkToken(linkToken.data.link_token);
    } catch (err) {
      if (err.response) {
        console.log("Error:", err.response.data);
      }
    }
  }

  useEffect(() => {
    generateLinkToken();
  }, []);

  // display methods ===========================================================
  function displayAccounts() {
    return props.accounts.map(account => {
      return (
        <Account key={ account.account_id } account={account} />
      );
    });
  }

  return (
    <Grid item xs={12}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Accounts
          </Typography>
          <br />
          { linkToken != null ? (<Link linkToken={linkToken} user={props.userDetails} getAccountDetails={props.getAccountDetails} />) : (<div></div>) }
          <br />
          <Typography variant="body2">
            { props.accounts.length > 0 ? displayAccounts() : "You don't have any accounts linked." }
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Accounts;
