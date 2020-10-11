import React from "react";
import { makeStyles } from "@material-ui/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Grid } from "@material-ui/core";
import { useStore } from "../../store/store";
import { Redirect } from "react-router-dom";

import { TotalNet, GoldTokens } from "./components";

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

const Gold = () => {
  const classes = useStyles();
  const store = useStore();

  const { prices, balances } = store.state;

  if (!store.state.web3) {
    return <Redirect to="/sign-in" />;
  } else {
    if (balances) {
      const goldTokens = tokens
        .filter(token => token.class === "gold")
        .map(token => {
          const tokenObj = {};
          tokenObj.imgURL = "/images/tokens/" + token.symbol + ".png";
          tokenObj.symbol = token.symbol;
          tokenObj.url = token.url;
          tokenObj.name = token.name;
          tokenObj.balance = balances[token.symbol];
          tokenObj.price = prices[token.symbol];
          tokenObj.value = tokenObj.balance * tokenObj.price;
          return tokenObj;
        });

      const totalNet = getTotalNet(goldTokens);

      return (
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalNet total={totalNet} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              {/* <TotalIncome total={totalIncome} /> */}
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              {/* <TotalAssets total={totalAssets} /> */}
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              {/* <TotalDebt total={totalDebt} /> */}
            </Grid>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <GoldTokens tokens={goldTokens} />
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

export default Gold;
