import React from "react";
import { useQuery } from "react-query";

import { useGetData, useGetBasicInfo } from "../../hooks/Hooks";
import ChartTable from "./ChartTable";
import "./charts.scss";
import {
  ASSETS,
  API_OPTIONS_A
} from "../../utils/constants";

const Charts = (props) => {

  if (!(Object.keys(props.user).length > 0)) {
    props.history.push("/");
  }

  const {data, isLoading} = useGetData(ASSETS, API_OPTIONS_A);

  return (
    <div className="container">
      <h2>Cryptocurrency Prices</h2>
      <div>
        { isLoading ? <span>loading...</span> : <ChartTable assets={data} />}
      </div>
    </div>
  );
}

export default Charts
