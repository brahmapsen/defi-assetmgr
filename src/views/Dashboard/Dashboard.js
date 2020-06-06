import React from "react";
import { makeStyles } from "@material-ui/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Grid } from "@material-ui/core";
import { useStore } from "../../store/store";
import { Redirect } from "react-router-dom";
import { useMakerDeposits } from "../../web3/hooks/MakerDeposits";
import { useMakerDebts } from "../../web3/hooks/MakerDebts";

import { TotalDebt, TotalAssets, TotalNet, WalletTokens } from "./components";

import tokens from "../../web3/config/tokens";

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

const Dashboard = () => {
  const classes = useStyles();
  const store = useStore();
  const { prices, balances } = store.state;
  const { debts } = useMakerDebts();
  const { deposits } = useMakerDeposits();

  if (!store.state.web3) {
    return <Redirect to="/sign-in" />;
  } else {
    if (balances && debts && deposits) {
      const walletTokens = tokens.map(token => {
        const tokenObj = {};
        tokenObj.imgURL = "/images/tokens/" + token.symbol + ".svg";
        tokenObj.symbol = token.symbol;
        tokenObj.balance =
          balances[token.symbol] - debts[token.symbol] + deposits[token.symbol];
        tokenObj.price = prices[token.symbol];
        tokenObj.value = tokenObj.balance * tokenObj.price;
        return tokenObj;
      });

      const totalNet = getTotalNet(walletTokens);

      const totalDebt = getTotalDebt(debts);

      const totalAssets = totalNet + totalDebt;

      return (
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <TotalNet total={totalNet} />
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <TotalAssets total={totalAssets} />
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <TotalDebt total={totalDebt} />
            </Grid>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <WalletTokens tokens={walletTokens} />
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
