import React, { useEffect, useState } from "react";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { formatPrice } from "../utils/utils";

const Account = (props) => {
  return (
    <div className="">
      <p className="">Name: { props.account.name }</p>
      <p className="">Balance: { formatPrice(props.account.balances.available) }</p>
    </div>
  );
}

const Accounts = (props) => {

  console.log("ACCOUNTS: " + props.accounts);
  function accounts() {
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
          <Typography variant="body2">
            { props.accounts.length > 0 ? accounts() : "You don't have any accounts linked." }
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Accounts;
