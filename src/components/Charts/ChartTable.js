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
        <th>name</th>
        <th>symbol</th>
        <th>price</th>
      </tr>
      {props.assets ? displayRows() : ""}
    </table>
  );
}

export default ChartTable
