import React from "react";

import {
  formatPrice
} from "../../utils/utils";

const ChartRow = (props) => {
  const asset = props.asset;
  const marketData = asset["market_data"];

  return (
    <tr>
      <td>{asset?.name}</td>
      <td>{asset?.symbol}</td>
      <td>{formatPrice(marketData?.current_price?.usd)}</td>
    </tr>
  );
}

export default ChartRow
