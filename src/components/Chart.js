import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query"

import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';
import format from 'date-fns/format';

// constants -------------------------------------------------------------------
const SYMBOL = "bitcoin";
const API_OPTIONS_A = { refetchInterval: 60000, staleTime: 60000};
const API_OPTIONS_B = {
  refetchInterval: 60000,
  staleTime: 60000,
  select: (data) => data?.prices?.map((item) => ({
    x: item[0],
    y: item[1],
  })),
};
const INTERVALS = [
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

// custom hooks ----------------------------------------------------------------
function useGetBasicInfo(coin, options) {
  return useQuery(`${coin}-card`, async () => {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`);
    return await response.json();
  }, options);
}

function useGetTimeseries(coin, interval, options) {
  const { data, isLoading } = useQuery(['chartData', interval], async () => {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${interval}`);
    return await response.json();
  }, options);
  return {
    timeseries: data,
    isTimeseriesLoading: isLoading
  };
}

const Chart = (props) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState(INTERVALS[0].value);

  const {data, isLoading} = useGetBasicInfo(SYMBOL, API_OPTIONS_A);
  const {timeseries, isTimeseriesLoading} = useGetTimeseries(SYMBOL, selectedInterval, API_OPTIONS_B)

  // console.log(timeseries, isTimeseriesLoading);
  // useEffect(() => {}, []);

  function formatPrice(price) {
    const formatConfig = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

    return formatConfig.format(price);
  }

  function formatPlusMinus(priceChange) {
    const isPositive = Math.sign(priceChange) >= 0;

    return (
      <span className={`${isPositive ? 'positive' : 'negative'}`}>
        {`${isPositive ? '+' : ''}${priceChange.toFixed(2)}%`}
      </span>
    );
  }

  function displayInfo() {
    if (isLoading) {
      return (<div>loading</div>);
    } else {
      let { image, name } = data;
      let marketData = data["market_data"];
      return (
        <div>
          <img src={image?.large} alt={`${name} logo`} />
          <h3 className="crypto-name">{name}</h3>
          <h4 className="crypto-price">
            {formatPrice(marketData?.current_price?.usd)}
            {formatPlusMinus(marketData?.price_change_percentage_24h)}
          </h4>
        </div>
      );
    }
  }

  function displayChart() {
    // if (isTimeseriesLoading) {
    //   return (<span>Loading...</span>);
    // }
    return (
      <div className="chart">
        <div className="chart-actions">
          {INTERVALS.map((interval) => (
            <button
              key={interval.value}
              className={`${selectedInterval === interval.value ? 'active' : 'inactive'}`}
              onClick={() => setSelectedInterval(interval.value)}
            >
              {interval.label}
            </button>
          ))}
        </div>

        {isTimeseriesLoading ? (
            <div className="loading-container">
              <span>Loading...</span>
            </div>
          ) : (
            !isExpanded ? (
      	      <VictoryLine
      	        style={{
      	          data: {
      	            stroke: "#fff",
      	            strokeWidth: 2,
      	          },
      	        }}
      	        width={300}
      	        height={150}
      	        data={timeseries}
      	      />
      	    ) : (
      	      <VictoryChart
      	        width={800}
      	        height={400}
      	        domainPadding={5}
                containerComponent={
                  <VictoryVoronoiContainer
                    labels={({ datum }) => formatPrice(datum.y)}
              			title={`${SYMBOL} price data chart`}
                    labelComponent={
                      <VictoryTooltip
                        style={{
                          fill: '#333',
                          fontSize: 16,
                        }}
                        flyoutStyle={{
                          fill: "#fff",
                          stroke: '#fff',
                          strokeWidth: 1,
                          margin: 10,
                        }}
                      />
                    }
                  />
                }
      				>
                <VictoryLine
                  style={{
                    data: {
                      stroke: "#fff",
                      strokeWidth: 2,
                    },
                  }}
                  data={timeseries}
                />
                <VictoryAxis
              	  orientation="bottom"
              	  style={{
              	    axis: {
              	      stroke: '#fff',
              	      strokeWidth: 2,
              	    },
              	    tickLabels: {
              	      fill: '#fff',
              	    },
              	  }}
              	  tickFormat={(x) => {
              	    if (selectedInterval  === 1) {
              	      return format(x, 'p');
              	    }

              	    return format(x, 'MM/dd');
              	  }}
              	/>
      				</VictoryChart>
      			)
    			)
        }
  		</div>
  	);
  }


  return (
    <div className={`card ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {!isExpanded && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="hitzone" />
      )}
      <div className="card-inner">
        {isExpanded && (
          <button className="close" onClick={() => setIsExpanded(false)}>Close</button>
        )}
        <div className="top-data">
          {displayInfo()}
          {displayChart()}
        </div>
      </div>
    </div>
  );
};

export default Chart;
