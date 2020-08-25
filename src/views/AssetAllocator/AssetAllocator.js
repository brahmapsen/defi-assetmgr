import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Button } from "@material-ui/core";
import { useStore } from "../../store/store";
import { TargetAllocation, TotalToInvest, TargetAssets } from "./components";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const AssetAllocator = props => {
  const classes = useStyles();
  const { className, ...rest } = props;
  const store = useStore();
  const { prices, balances } = store.state;

  const assetAllocation = props.location.state.allocation.map(x => x / 100);
  console.log(balances);
  const [allocation, setAllocation] = useState({
    DAI: assetAllocation[0],
    PAXG: assetAllocation[1],
    WBTC: assetAllocation[2] / 2,
    ETH: assetAllocation[2] / 2
  });

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalToInvest total={10000} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TargetAllocation allocation={allocation} />
        </Grid>
        <Grid item lg={6} sm={6} xl={3} xs={12}>
          <Button color="primary" variant="contained" size="large">
            Yes, get me the that portfolio
          </Button>
        </Grid>
        <Grid item lg={12} md={12} xl={12} xs={12}>
          <TargetAssets
            total={10000}
            setAllocation={setAllocation}
            allocation={allocation}
            prices={prices}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default AssetAllocator;
