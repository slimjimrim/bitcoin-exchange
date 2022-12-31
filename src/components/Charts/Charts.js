import React, {
  useEffect,
  useState
} from "react";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import ChartTable from "./ChartTable";
import "./charts.scss";

const API_OPTIONS_A = { refetchInterval: 60000, staleTime: 60000};
const API_URL = "https://api.coingecko.com/api/v3/coins/";
const ASSETS = [
  "bitcoin",
  "ethereum"
];

const queryClient = new QueryClient();

// TODO: move these to their own file
// custom hooks ================================================================
function useGetBasicInfo(asset, options) {
  return useQuery(`${asset}-basic-info`, async () => {
    const response = await fetch(`${API_URL + asset}`);
    return await response.json();
  }, options);
}

function  useGetData(assets, options) {
  return useQuery("main-chart-data", async () => {
    const promises = assets.map(async a => {
      const resp = await fetch(`${API_URL + a}`);
      return resp.json();
    });
    return await Promise.all(promises);
  }, options);
}

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
