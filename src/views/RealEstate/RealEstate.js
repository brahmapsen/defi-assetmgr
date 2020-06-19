import React from "react";
import { makeStyles } from "@material-ui/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Grid } from "@material-ui/core";
import { useStore } from "../../store/store";
import { Redirect } from "react-router-dom";

import { TotalNet, TotalIncome, Properties } from "./components";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const RealEstate = () => {
  const classes = useStyles();
  const store = useStore();
  const { realEstate, balances } = store.state;

  if (!store.state.web3) {
    return <Redirect to="/sign-in" />;
  } else {
    if (realEstate) {
      const { totalValue, properties } = realEstate;

      return (
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <TotalNet total={totalValue} />
            </Grid>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <TotalIncome total={balances["USDC"]} />
            </Grid>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <Properties properties={properties} />
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

export default RealEstate;
