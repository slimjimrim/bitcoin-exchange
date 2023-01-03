import React from "react";
import { useQuery } from "react-query";

import {
  COINGECKO_API_URL,
} from "../utils/constants";

// useQuery auto-caches, useState not necessary!
function useGetTimeseries(asset, interval, options) {
  const { data, isLoading } = useQuery([`${asset}-timeseries`, interval], async () => {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${asset}/market_chart?vs_currency=usd&days=${interval}`);
    return await response.json();
  }, options);
  return {
    timeseries: data,
    isTimeseriesLoading: isLoading
  };
}

// useQuery auto-caches, useState not necessary!
function  useGetBasicInfo(assets, options) {
  return useQuery("main-chart-data", async () => {
    const promises = assets.map(async a => {
      const resp = await fetch(`${COINGECKO_API_URL + a}`);
      return resp.json();
    });
    return await Promise.all(promises);
  }, options);
}

export {
  useGetBasicInfo,
  useGetTimeseries
}
