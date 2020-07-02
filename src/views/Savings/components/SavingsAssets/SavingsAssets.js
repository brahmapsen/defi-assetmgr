import React, { useState } from "react";
import { useStore } from "../../../../store/store";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link
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

const SavingsAssets = props => {
  const { prices, className, ...rest } = props;

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button
          color="primary"
          variant="contained"
          href="https://app.defisaver.com/smart-savings/manage"
          target="_blank"
        >
          Manage savings
        </Button>
      </div>
      <Card>
        <CardHeader title="Assets" />
        <Divider />
        <CardContent className={classes.content}>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Token</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Accured Interest</TableCell>
                  <TableCell>APY</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.savings.map(saving => (
                  <TableRow key={saving.token + saving.platform}>
                    <TableCell>
                      <div className={classes.tokenContainer}>
                        <img
                          className={classes.avatar}
                          src={"/images/tokens/" + saving.token + ".png"}
                        />
                        <Typography variant="body1">{saving.token}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={saving.link} target="_blank">
                        {saving.platform}
                      </Link>
                    </TableCell>
                    <TableCell>{saving.balance.toFixed(2)} </TableCell>
                    <TableCell>
                      ${(saving.balance * prices[saving.token]).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      $
                      {(saving.totalInterest * prices[saving.token]).toFixed(2)}
                    </TableCell>
                    <TableCell>{saving.apy.toFixed(2)}%</TableCell>
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

SavingsAssets.propTypes = {
  className: PropTypes.string
};

export default SavingsAssets;
