import React from "react";

import {
  formatPrice,
  formatPlusMinus
} from "../../utils/utils";

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

const ChartRow = (props) => {
  const asset = props.asset;
  const marketData = asset["market_data"];
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
        <TableCell align="left">{asset?.name}</TableCell>
        <TableCell align="right" className="asset-symbol">{asset?.symbol}</TableCell>
        <TableCell align="right">{formatPrice(marketData?.current_price?.usd)}</TableCell>
        <TableCell align="right">{formatPlusMinus(marketData?.price_change_percentage_24h)}</TableCell>
        <TableCell align="right">{formatPlusMinus(marketData?.price_change_percentage_7d)}</TableCell>
        <TableCell align="right">{formatPlusMinus(marketData?.price_change_percentage_30d)}</TableCell>
        <TableCell align="right">{formatPlusMinus(marketData?.price_change_percentage_200d)}</TableCell>
        <TableCell align="right">{formatPlusMinus(marketData?.price_change_percentage_1y)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <p>extra shit will go here</p>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
    // <tr>
    //   <td>{asset?.market_cap_rank}</td>
    //   <td>{asset?.name}</td>
    //   <td>{asset?.symbol}</td>
    //   <td>{formatPrice(marketData?.current_price?.usd)}</td>
    //   <td>{formatPlusMinus(marketData?.price_change_percentage_24h)}</td>
    //   <td>{formatPlusMinus(marketData?.price_change_percentage_7d)}</td>
    //   <td>{formatPlusMinus(marketData?.price_change_percentage_30d)}</td>
    //   <td>{formatPlusMinus(marketData?.price_change_percentage_200d)}</td>
    //   <td>{formatPlusMinus(marketData?.price_change_percentage_1y)}</td>
    // </tr>
  );
}

export default ChartRow
