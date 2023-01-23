import React, { useState, useEffect } from "react";

import {
  formatPrice,
  formatPlusMinus
} from "../../utils/utils";
import {
  useGetTimeseries
} from "../../hooks/Hooks";

import format from 'date-fns/format';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';

import {
  API_OPTIONS_B,
  INTERVALS
} from "../../utils/constants";

const ChartRow = (props) => {
  const { asset, openRow, closeRow, forceClose } = props;
  const { image, name } = asset;
  const marketData = asset["market_data"];
  const [open, setOpen] = useState(undefined);
  const [selectedInterval, setSelectedInterval] = useState(INTERVALS[0].value);
  const {timeseries, isTimeseriesLoading} = useGetTimeseries(asset.id, selectedInterval, API_OPTIONS_B);

  useEffect(() => {
    if (forceClose === true) {
      setOpen(false);
    }
  }, [forceClose]);

  useEffect(() => {
    if (open === true) {
      openRow();
    } else if (open === false) {
      closeRow(forceClose);
    }
  }, [open]);

  // display methods ===========================================================
  function displayIntervals() {
    return (
      <div className="intervals">
        {INTERVALS.map(i => {
          return (
            <div key={i.value} className={selectedInterval == i.value ? "selected-interval interval" : "interval"} onClick={() => setSelectedInterval(i.value)} >{i.label}</div>
          );
        })}
      </div>
    );
  }

  function displayDropdownChart() {
    return (
      <VictoryChart
        width={800}
        height={400}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) => formatPrice(datum.y)}
            title={`${asset.name} price data chart`}
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
    );
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} className="main-row" onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="justify">
          {asset?.market_cap_rank}
        </TableCell>
        <TableCell align="left">
          <img src={image?.small} alt={`${name} logo`} />
          {asset?.name}
        </TableCell>
        <TableCell align="right" className="asset-symbol">{asset?.symbol}</TableCell>
        <TableCell align="right">{formatPrice(marketData?.current_price?.usd)}</TableCell>
        <TableCell align="right">{formatPlusMinus(marketData?.price_change_percentage_24h)}</TableCell>
        <TableCell align="right">{formatPlusMinus(marketData?.price_change_percentage_7d)}</TableCell>
        <TableCell align="right">{formatPlusMinus(marketData?.price_change_percentage_30d)}</TableCell>
        <TableCell align="right">{formatPlusMinus(marketData?.price_change_percentage_200d)}</TableCell>
        <TableCell align="center">{formatPlusMinus(marketData?.price_change_percentage_1y)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              {displayIntervals()}
              {/* <VictoryLine
      	        style={{
      	          data: {
      	            stroke: "#fff",
      	            strokeWidth: 2,
      	          },
      	        }}
      	        data={timeseries}
      	      /> */}
              {displayDropdownChart()}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default ChartRow
