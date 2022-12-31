import React from "react";

import {
  formatPrice,
  formatPlusMinus
} from "../../utils/utils";

const ChartRow = (props) => {
  const asset = props.asset;
  const marketData = asset["market_data"];

  return (
    <tr>
      <td>{asset?.market_cap_rank}</td>
      <td>{asset?.name}</td>
      <td>{asset?.symbol}</td>
      <td>{formatPrice(marketData?.current_price?.usd)}</td>
      <td>{formatPlusMinus(marketData?.price_change_percentage_24h)}</td>
      <td>{formatPlusMinus(marketData?.price_change_percentage_7d)}</td>
      <td>{formatPlusMinus(marketData?.price_change_percentage_30d)}</td>
      <td>{formatPlusMinus(marketData?.price_change_percentage_200d)}</td>
      <td>{formatPlusMinus(marketData?.price_change_percentage_1y)}</td>
    </tr>
  );
}

export default ChartRow
