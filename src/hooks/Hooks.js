import React from "react";
import { useQuery } from "react-query";

import {
  API_URL,
} from "../utils/constants";

// useQuery auto-caches, useState not necessary!
function useGetBasicInfo(asset, options) {
  return useQuery(`${asset}-basic-info`, async () => {
    const response = await fetch(`${API_URL + asset}`);
    return await response.json();
  }, options);
}

// useQuery auto-caches, useState not necessary!
function  useGetData(assets, options) {
  return useQuery("main-chart-data", async () => {
    const promises = assets.map(async a => {
      const resp = await fetch(`${API_URL + a}`);
      return resp.json();
    });
    return await Promise.all(promises);
  }, options);
}

export {
  useGetBasicInfo,
  useGetData
}
