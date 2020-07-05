import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
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
  avatar1: {
    height: 32,
    width: 32
  },
  avatar2: {
    marginRight: theme.spacing(2),
    height: 32,
    width: 32
  },
  row: {
    height: "42px",
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  }
}));

const Pools = props => {
  const { prices, className, ...rest } = props;

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button
          color="primary"
          variant="contained"
          href="https://uniswap.exchange/pool"
          target="_blank"
        >
          Manage pools
        </Button>
      </div>
      <Card>
        <CardHeader title="Uniswap Pools" />
        <Divider />
        <CardContent className={classes.content}>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Token Pair</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Profit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.pools.map(pool => (
                  <TableRow key={pool.token1 + pool.token2}>
                    <TableCell>
                      <div className={classes.tokenContainer}>
                        <img
                          className={classes.avatar1}
                          src={"/images/tokens/" + pool.token1 + ".png"}
                        />
                        <img
                          className={classes.avatar2}
                          src={"/images/tokens/" + pool.token2 + ".png"}
                        />
                        <Typography variant="body1">
                          {pool.token1}/{pool.token2}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      {pool.balance1.toFixed(2)}
                      {pool.token1} + {pool.balance2.toFixed(2)}
                      {pool.token2}{" "}
                    </TableCell>
                    <TableCell>
                      $
                      {(
                        pool.balance1 * prices[pool.token1] +
                        pool.balance2 * prices[pool.token2]
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      $
                      {(
                        pool.delta1 * prices[pool.token1] +
                        pool.delta2 * prices[pool.token2]
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <Divider />
      </Card>
    </div>
  );
};

Pools.propTypes = {
  className: PropTypes.string
};

export default Pools;
