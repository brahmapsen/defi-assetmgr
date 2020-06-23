import React from "react";
import { makeStyles } from "@material-ui/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Grid } from "@material-ui/core";
import { useStore } from "../../store/store";
import { Redirect } from "react-router-dom";
import { useSavings } from "../../savings/hooks/Assets";
import { useRealEstate } from "../../realEstate/hooks/RealEstate";

import {
  TotalDebt,
  AssetAllocation,
  TotalAssets,
  TotalNet,
  TotalIncome,
  WalletTokens
} from "./components";

const tokens = require("../../config/tokens/tokens.json");

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const getTotalNet = tokens => {
  let total = 0;
  for (const token of tokens) {
    total = total + parseFloat(token.value);
  }
  return parseFloat(total);
};

const getTotalDebt = debts => {
  let total = 0;
  for (const token of tokens) {
    total = total + debts[token.symbol];
  }
  return parseFloat(total);
};

const getAssetAllocation = (tokens, total) => {
  let assetAllocations = {};
  for (const token of tokens) {
    assetAllocations[token.class]
      ? (assetAllocations[token.class] =
          assetAllocations[token.class] + token.value)
      : (assetAllocations[token.class] = token.value);
  }
  for (const assetClass of Object.keys(assetAllocations)) {
    assetAllocations[assetClass] > 0
      ? (assetAllocations[assetClass] =
          (assetAllocations[assetClass] / total) * 100)
      : (assetAllocations[assetClass] = 0);
  }
  return assetAllocations;
};

const getTotalIncome = (savings, balances, prices) => {
  let total = 0;
  for (const saving of savings) {
    total = total + saving.totalInterest * prices[saving.token];
  }
  //to do: change to received USDC from rental income
  return total + balances["USDC"];
};

const Dashboard = () => {
  const classes = useStyles();
  const store = useStore();
  useRealEstate();
  useSavings();
  const { prices, balances, savingAssets, realEstate } = store.state;

  console.log(store.state);

  if (!store.state.web3) {
    return <Redirect to="/sign-in" />;
  } else {
    if (balances && savingAssets && realEstate) {
      const { debts, deposits } = savingAssets;
      const walletTokens = tokens.map(token => {
        const tokenObj = {};
        tokenObj.imgURL = "/images/tokens/" + token.symbol + ".png";
        tokenObj.symbol = token.symbol;
        tokenObj.balance =
          balances[token.symbol] -
          debts.totals[token.symbol] +
          deposits.totals[token.symbol];
        tokenObj.price = prices[token.symbol];
        tokenObj.value = tokenObj.balance * tokenObj.price;
        tokenObj.class = token.class;
        return tokenObj;
      });

      //add REALT token
      let realToken = {
        imgURL: "/images/tokens/REALT.png",
        symbol: "REALT",
        balance: realEstate.totalAmount,
        price: realEstate.totalValue / realEstate.totalAmount,
        value: realEstate.totalValue,
        class: "realEstate"
      };

      walletTokens.push(realToken);

      const totalNet = getTotalNet(walletTokens);

      const totalIncome = getTotalIncome(deposits.savings, balances, prices);

      const totalDebt = getTotalDebt(debts.totals);

      const totalAssets = totalNet + totalDebt;

      const assetAllocation = getAssetAllocation(walletTokens, totalNet);

      return (
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalNet total={totalNet} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalIncome total={totalIncome} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalAssets total={totalAssets} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalDebt total={totalDebt} />
            </Grid>
            <Grid item lg={7} md={6} xl={3} xs={12}>
              <WalletTokens tokens={walletTokens} />
            </Grid>
            <Grid item lg={5} md={6} xl={3} xs={12}>
              <AssetAllocation allocation={assetAllocation} />
            </Grid>
          </Grid>
        </div>
      );
    } else {
      return (
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      );
    }
  }
};

export default Dashboard;
