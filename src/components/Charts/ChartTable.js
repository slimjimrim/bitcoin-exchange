import React from "react";

import ChartRow from "./ChartRow";

const ChartTable = (props) => {
  console.log("assets:");
  console.log(props.assets);

  // display methods ===========================================================
  function displayRows() {
    return props.assets.map(asset => {
      return (<ChartRow key={asset.id} asset={asset} />);
    });
  }

  return (
    <table>
      <tr>
        <th>Rank</th>
        <th>name</th>
        <th>symbol</th>
        <th>price</th>
        <th>24hr %</th>
        <th>7d %</th>
        <th>30d %</th>
        <th>200d %</th>
        <th>1yr %</th>
      </tr>
      {props.assets ? displayRows() : ""}
    </table>
  );
}

export default ChartTable
