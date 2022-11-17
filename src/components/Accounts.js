import React, { useEffect, useState } from "react";
import { formatter } from "../utils/utils";

const Account = (props) => {
  return (
    <div className="my-2">
      <p className="text-black">Name: { props.account.name }</p>
      <p className="text-black">Balance: { formatter.format(props.account.balances.available) }</p>
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
    <div>
      <br />
      <h3>Accounts</h3>
      { props.accounts.length > 0 ? accounts() : "You don't have any accounts linked." }
    </div>
  );
};

export default Accounts;
