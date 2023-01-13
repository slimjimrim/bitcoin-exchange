import React, { useState, useEffect } from "react";

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
  const [ openedRows, setOpenedRows ] = useState(0);
  const [ showCloseAll, setShowCloseAll ] = useState(false);
  const [ forceClose, setForceClose ] = useState(undefined);

  function openRow() {
    const updated = openedRows + 1;
    setOpenedRows(updated);
    setForceClose(false);
  }

  function closeRow(closeAll) {
    const updated = closeAll ? 0 : openedRows - 1;
    setOpenedRows(updated);
  }

  function closeAll() {
    setForceClose(true);
  }

  useEffect(() => {
    if (openedRows > 0) {
      setShowCloseAll(true);
    } else {
      setShowCloseAll(false);
    }
  }, [openedRows, forceClose]);

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
