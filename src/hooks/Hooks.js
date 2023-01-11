import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

import { BASE_API_URL } from "../utils/constants";

// useQuery auto-caches, useState not necessary!
function useGetTimeseries(asset, interval, options) {
  const { data, isLoading } = useQuery([`${asset}-timeseries`, interval], async () => {
      // we are using our express server as a proxy for the coingecko API due to CORS
    const response = await axios.get(`${BASE_API_URL}/timeseries`, {
      params: {
        asset: asset,
        interval: interval
      }
    });
    return response.data;
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
      const response = await axios.get(`${BASE_API_URL}/coin`, {
        params: {
          asset: a,
        }
      });
      return response.data;
    });
    return await Promise.all(promises);
  }, options);
}

export {
  useGetBasicInfo,
  useGetTimeseries
}
