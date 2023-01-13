import React, { useState } from "react";

import ChartRow from "./ChartRow";
import Toast from "../Toast/Toast";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ChartTable = (props) => {
  let [ openedRows, setOpenedRows ] = useState(0);
  const [ showCloseAll, setShowCloseAll ] = useState(false);
  const [ forceClose, setForceClose ] = useState(false);


  function openRow() {
    const updated = openedRows + 1;
    setOpenedRows(updated);
    setForceClose(false);
    toggleCloseAll(updated);
  }

  function closeRow() {
    const updated = openedRows - 1;
    setOpenedRows(updated);
    toggleCloseAll(updated);
  }

  function toggleCloseAll(openedRows) {
    if (openedRows > 0) {
      setShowCloseAll(true);
    } else {
      setShowCloseAll(false);
    }
  }

  function closeAll() {
    setForceClose(true);
  }

  // display methods ===========================================================
  function displayRows() {
    return props.assets.map(asset => {
      return (<ChartRow key={asset.id} asset={asset} openRow={openRow} closeRow={closeRow} forceClose={forceClose} />);
    });
  }

  return (
    <div>
      <Toast position={"bottom-left"} showCloseAll={showCloseAll} closeAll={closeAll} />

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
    </div>
  );
}

export default ChartTable
