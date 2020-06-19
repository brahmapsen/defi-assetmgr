import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
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
  Avatar,
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

const Properties = props => {
  const { prices, className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Properties" />
      <Divider />
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Token</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Rental Yield</TableCell>
                <TableCell>Detail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.properties.map(property => (
                <TableRow key={property.name}>
                  <TableCell>
                    <div className={classes.tokenContainer}>
                      <img
                        className={classes.avatar}
                        src={"/images/tokens/REALT.png"}
                      />
                      <Typography variant="body1">REALT</Typography>
                    </div>
                  </TableCell>
                  <TableCell>{property.name}</TableCell>
                  <TableCell>{property.amount.toFixed(0)} </TableCell>
                  <TableCell>
                    ${(property.amount * property.price).toFixed(2)}
                  </TableCell>
                  <TableCell>{property.apy.toFixed(2)}%</TableCell>
                  <TableCell>
                    <Link href={property.link} target="_blank">
                      Detail
                    </Link>
                  </TableCell>
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

Properties.propTypes = {
  className: PropTypes.string
};

export default Properties;
