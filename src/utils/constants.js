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
  // "binancecoin",
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

export const TABLE_HEADERS = [
  {
    displayName: "Rank",
    align: "left",
    valueFn: (data) => {
      return data?.market_cap_rank;
    }
  },
  {
    displayName: "Name",
    align: "left",
    valueFn: (data) => {
      return data?.name;
    }
  },
  {
    displayName: "Symbol",
    align: "right",
    valueFn: (data) => {
      return data?.symbol;
    }
  },
  {
    displayName: "Price",
    align: "right",
    valueFn: (data) => {
      return data?.current_price?.usd;
    }
  },
  {
    displayName: "24hr",
    align: "right",
    valueFn: (data) => {
      return data?.price_change_percentage_24h;
    }
  },
  {
    displayName: "7d",
    align: "right",
    valueFn: (data) => {
      return data?.price_change_percentage_7d;
    }
  },
  {
    displayName: "30d",
    align: "right",
    valueFn: (data) => {
      return data?.price_change_percentage_30d;
    }
  },
  {
    displayName: "200d",
    align: "right",
    valueFn: (data) => {
      return data?.price_change_percentage_200d;
    }
  },
  {
    displayName: "1yr",
    align: "center",
    valueFn: (data) => {
      return data?.price_change_percentage_1y;
    }
  },
]
