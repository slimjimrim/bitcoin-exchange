import React from "react";

import "./charts.scss";

const ASSETS = [
  "Bitcoin",
  "Ethereum"
];

const Charts = () => {

  function displayRow() {
    return ASSETS.map(asset => {
      return (
        <tr>
          <td>asset</td>
          <td>$10,000</td>
        </tr>
      );
    })
  }

  return (
    <div className="container">
      <h2>Cryptocurrency Prices</h2>
      <div>
        <table>
          <tr>
            <th>name</th>
            <th>price</th>
          </tr>
          {displayRow()}
        </table>
      </div>
    </div>
  );
}

export default Charts
