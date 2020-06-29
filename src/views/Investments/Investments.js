import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Button } from "@material-ui/core";
import { useStore } from "../../store/store";
import { Redirect } from "react-router-dom";

import { TotalNet, TotalIncome, Pools } from "./components";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const getTotalBalance = (investments, prices) => {
  let total = 0;
  for (const pool of investments.pools) {
    total +=
      pool.balance1 * prices[pool.token1] + pool.balance2 * prices[pool.token2];
  }
  return total;
};

const getTotalIncome = (investments, prices) => {
  let total = 0;
  for (const pool of investments.pools) {
    total +=
      pool.delta1 * prices[pool.token1] + pool.delta2 * prices[pool.token2];
  }
  return total;
};

const Investments = () => {
  const classes = useStyles();
  const store = useStore();
  const { prices, investments } = store.state;

  if (!store.state.web3) {
    return <Redirect to="/sign-in" />;
  } else {
    const totalIncome = getTotalIncome(investments, prices);

    const totalBalance = getTotalBalance(investments, prices);

    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <TotalNet total={totalBalance} />
          </Grid>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <TotalIncome total={totalIncome} />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <Pools pools={investments.pools} prices={prices} />
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default Investments;
