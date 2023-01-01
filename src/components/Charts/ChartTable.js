import React from "react";

import ChartRow from "./ChartRow";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ChartTable = (props) => {
  console.log("assets:");
  console.log(props.assets);

  // display methods ===========================================================
  function displayRows() {
    return props.assets.map(asset => {
      return (<ChartRow key={asset.id} asset={asset} />);
    });
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Rank</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Symbol</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">24hr %</TableCell>
            <TableCell align="right">7d %</TableCell>
            <TableCell align="right">30d %</TableCell>
            <TableCell align="right">200d %</TableCell>
            <TableCell align="center">1yr %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.assets ? displayRows() : ""}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ChartTable
