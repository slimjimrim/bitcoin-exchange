export const BASE_API_URL = "http://localhost:3030";

export const API_OPTIONS_A = {
  refetchInterval: 60000,
  staleTime: 60000
};

export const API_OPTIONS_B = {
  refetchInterval: 60000,
  staleTime: 60000,
  select: (data) => data?.prices?.map((item) => ({
    x: item[0],
    y: item[1],
  })),
};

export const ASSETS = [
  "bitcoin",
  "ethereum",
  // "solana",
  // "tether",
  "binancecoin",
  // "ripple",
  // "cardano",
  // "dogecoin"
];

export const INTERVALS = [
  {
    label: '1D',
    value: 1,
  },
  {
    label: '7D',
    value: 7,
  },
  {
    label: '1M',
    value: 30,
  },
  {
    label: '3M',
    value: 90,
  },
];
