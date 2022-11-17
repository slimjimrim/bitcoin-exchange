import React from "react";
import { PlaidLink, usePlaidLink } from 'react-plaid-link';
import { Button } from "react-bootstrap";
import axios from "axios";

import { BASE_API_URL } from "../utils/constants";

const Home = (props) => {

  async function onSuccess(publicToken, meta) {
    try {
      const resp = await axios.post(`${BASE_API_URL}/api/exchange_public_token`, {
        public_token: publicToken,
        user_id: props.user._id
      });

      await props.getAccountDetails();
    } catch (err) {
      console.log("Error:", err);
    }
  }

  // NOTE: usePlaidLink is not working for some unknown reason so here we are
  // using the pre-built component PlaidLink
  const btnStyle = {
    "color": "#fff",
    "backgroundColor": "#007bff",
    "borderColor": "#007bff",
    "padding": "0.375rem 0.75rem",
    "fontSize": "1rem",
    "lineHeight": "1.5",
    "borderRadius": "0.25rem",
    "textAlign": "center",
    "verticalAlign": "middle",
    "display": "inline-block",
    "fontWeight": "400",
  };

  return (
    <PlaidLink
      style={btnStyle}
      className="btn btn-primary"
      token={props.linkToken}
      onSuccess={onSuccess}
      // onExit={...}
      // onEvent={...}
    >
      Connect a bank account
    </PlaidLink>
  );
};

export default Home;
