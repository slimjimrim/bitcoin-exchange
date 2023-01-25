import React, { useState, useEffect } from "react";

import ChartRow from "./ChartRow";
import Toast from "../Toast/Toast";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {
  TABLE_HEADERS
} from "../../utils/constants";

const ChartTable = (props) => {
  const [ openedRows, setOpenedRows ] = useState(0);
  const [ showCloseAll, setShowCloseAll ] = useState(false);
  const [ forceClose, setForceClose ] = useState(undefined);
  const [ sortBy, setSortBy ] = useState(TABLE_HEADERS[0]);
  const [ ascending, setAscending ] = useState(false);

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

  function selectSortBy(col) {
    // if selecting the same col:
    if (col == sortBy) {
      setAscending(!ascending);
    } else {
      setSortBy(col);
    }
  }

  useEffect(() => {
    if (openedRows > 0) {
      setShowCloseAll(true);
    } else {
      setShowCloseAll(false);
    }
  }, [openedRows, forceClose]);

  useEffect(() => {
    setAscending(false);
  }, [sortBy]);

  // display methods ===========================================================
  function displayRows() {
    const fn = sortBy.valueFn;
    const sorted = props.assets.sort((a, b) => {
      return (fn(a) > fn(b)) ?
        (ascending ? -1: 1) :
        (ascending ? 1: -1);
    });

    return sorted.map(asset => {
      return (<ChartRow key={asset.id} asset={asset} openRow={openRow} closeRow={closeRow} forceClose={forceClose} />);
    });
  }

  function displayHeaderCells() {
    return TABLE_HEADERS.map(col => {
      return (
        <TableCell onClick={() => { selectSortBy(col); }}
                   key={col.displayName}
                   align={col.align}>
          {col.displayName}
          {ascending ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </TableCell>
      );
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
              {displayHeaderCells()}
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
