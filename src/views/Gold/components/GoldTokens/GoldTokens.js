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
  }
}));

const GoldTokens = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Assets" />
      <Divider />
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Token</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.tokens.map(token => (
                <TableRow key={token.symbol}>
                  <TableCell>
                    <div className={classes.tokenContainer}>
                      <img className={classes.avatar} src={token.imgURL} />
                      <Typography variant="body1">{token.symbol}</Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={token.url} target="_blank">
                      {token.name}
                    </Link>
                  </TableCell>
                  <TableCell>{token.balance.toFixed(4)}</TableCell>
                  <TableCell>${token.price.toFixed(2)} </TableCell>
                  <TableCell>${token.value.toFixed(2)}</TableCell>
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

GoldTokens.propTypes = {
  className: PropTypes.string
};

export default GoldTokens;
