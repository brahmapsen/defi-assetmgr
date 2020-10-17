import React, { useState } from "react";
import { useStore } from "../../../../store/store";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  OutlinedInput,
  InputAdornment,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 600
  },
  tokenContainer: {
    display: "flex",
    alignItems: "center"
  },
  avatar: {
    marginRight: theme.spacing(2),
    height: 25,
    width: 25
  },
  amountInput: {
    backgroundColor: theme.palette.background.default
  }
}));

const TargetAssets = props => {
  const {
    className,
    setAllocation,
    allocation,
    total,
    prices,
    ...rest
  } = props;
  const [amounts, setAmounts] = useState({
    aDAI: total * allocation["aDAI"],
    PAXG: total * allocation["PAXG"],
    WBTC: total * allocation["WBTC"],
    ETH: total * allocation["ETH"]
  });

  console.log("amounts", amounts);

  const classes = useStyles();

  const assets = [
    { symbol: "aDAI", category: "Cash" },
    { symbol: "PAXG", category: "Gold" },
    { symbol: "WBTC", category: "Crypto" },
    { symbol: "ETH", category: "  Crypto" }
  ];

  const handleChange = prop => event => {
    let daiAmount = amounts["aDAI"];
    let paxgAmount = amounts["PAXG"];
    let wbtcAmount = amounts["WBTC"];
    let ethAmount = amounts["ETH"];
    let input;
    if (event.target.value) {
      input = parseInt(event.target.value);
      switch (prop) {
        case "aDAI":
          //amount exeeds total amount
          if (input > total) {
            daiAmount = total;
            paxgAmount = 0;
            wbtcAmount = 0;
            ethAmount = 0;
          } else if (
            //enough left for gold
            total >
            input + paxgAmount + wbtcAmount + ethAmount
          ) {
            daiAmount = input;
            paxgAmount = total - input - wbtcAmount - ethAmount;
            //we need to fill up from eth
          } else if (total > input + paxgAmount + wbtcAmount) {
            daiAmount = input;
            ethAmount = total - paxgAmount - wbtcAmount - input;
            //fill up from btc and eth
          } else if (total > input + paxgAmount) {
            daiAmount = input;
            ethAmount = 0;
            wbtcAmount = total - input - paxgAmount;
          } else {
            daiAmount = input;
            ethAmount = 0;
            wbtcAmount = 0;
            paxgAmount = total - input;
          }
          break;
        case "PAXG":
          //amount exeeds total amount
          if (input > total) {
            daiAmount = 0;
            paxgAmount = total;
            wbtcAmount = 0;
            ethAmount = 0;
          } else if (
            //enough left for wbtc
            total >
            input + daiAmount + wbtcAmount + ethAmount
          ) {
            paxgAmount = input;
            wbtcAmount = total - input - daiAmount - ethAmount;
            //we need to fill up from eth
          } else if (total > input + daiAmount + wbtcAmount) {
            paxgAmount = input;
            ethAmount = total - daiAmount - wbtcAmount - input;
            //fill up from btc and eth
          } else if (total > input + daiAmount) {
            paxgAmount = input;
            ethAmount = 0;
            wbtcAmount = total - paxgAmount - daiAmount;
          } else {
            ethAmount = 0;
            wbtcAmount = 0;
            paxgAmount = total - daiAmount;
          }
          break;
        case "WBTC":
          //amount exeeds total amount
          if (input > total) {
            daiAmount = 0;
            paxgAmount = 0;
            wbtcAmount = total;
            ethAmount = 0;
          } else if (
            //enough left for wbtc, we need to fill up from eth
            total <
            input + daiAmount + paxgAmount
          ) {
            ethAmount = 0;
            wbtcAmount = total - daiAmount - paxgAmount;
          } else {
            wbtcAmount = input;
            ethAmount = total - input - daiAmount - paxgAmount;
          }
          break;
      }
    }

    setAmounts({
      aDAI: daiAmount,
      PAXG: paxgAmount,
      WBTC: wbtcAmount,
      ETH: ethAmount
    });

    setAllocation({
      aDAI: daiAmount / total,
      PAXG: paxgAmount / total,
      WBTC: wbtcAmount / total,
      ETH: ethAmount / total
    });
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Target Asset Allocation" />
      <Divider />
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell>Target Balance</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Target Value</TableCell>
                <TableCell>Share</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map(asset => (
                <TableRow key={asset.symbol}>
                  <TableCell>
                    <div className={classes.tokenContainer}>
                      <img
                        className={classes.avatar}
                        src={"/images/tokens/" + asset.symbol + ".png"}
                      />
                      <Typography variant="body1">{asset.symbol}</Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    {(amounts[asset.symbol] / prices[asset.symbol]).toFixed(4)}
                  </TableCell>
                  <TableCell>${prices[asset.symbol]} </TableCell>
                  <TableCell>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      type="number"
                      value={amounts[asset.symbol].toFixed()}
                      onChange={handleChange(asset.symbol)}
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                      labelWidth={0}
                      className={classes.amountInput}
                    />
                  </TableCell>
                  <TableCell>
                    {((amounts[asset.symbol] * 100) / total).toFixed(2)}%
                  </TableCell>
                  <TableCell>{asset.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <Divider />
    </Card>
  );
};

TargetAssets.propTypes = {
  className: PropTypes.string
};

export default TargetAssets;
