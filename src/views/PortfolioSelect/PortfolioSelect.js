import React from "react";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Pie } from "react-chartjs-2";
import { useBalances } from "../../wallet/hooks/Balances";
import { useSavings } from "../../savings/hooks/Assets";
import { useStore } from "../../store/store";

import {
  CssBaseline,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1
  },
  performanceTitle: {
    margin: theme.spacing(2)
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6)
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[700]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2)
  }
}));

const tiers = [
  {
    title: "Conservative",
    risk: "Low Risk - Low Reward",
    allocation: [60, 30, 10],
    performance: [22.38, 22.55, 52.66, -27.74]
  },
  {
    title: "Moderate",
    subheader: "Recommended",
    risk: "Medium Risk - Medium Reward",
    allocation: [40, 30, 30],
    performance: [36.29, 36.31, 122.41, -52.26]
  },
  {
    title: "Aggresive",
    risk: "High Risk - High Reward",
    allocation: [10, 20, 70],
    performance: [43.47, 42.17, 166.53, -61.99]
  }
];

export default function PortfolioSelect() {
  const classes = useStyles();
  const theme = useTheme();
  useBalances();
  useSavings();
  const store = useStore();
  console.log(store);

  const options = {
    legend: {
      display: true,
      labels: {
        fontColor: "#fff"
      }
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Investment Portfolios
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          component="p"
        >
          Choose an investment portfolio appropriate for your risk tolerance.
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={2} alignItems="flex-end">
          {tiers.map(tier => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.risk}
                  titleTypographyProps={{ align: "center" }}
                  subheaderTypographyProps={{ align: "center" }}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    align="center"
                    className={classes.performanceTitle}
                  >
                    Portfolio Composition
                  </Typography>
                  <Pie
                    data={{
                      labels: ["Cash", "Gold", "Crypto"],
                      datasets: [
                        {
                          data: tier.allocation,
                          backgroundColor: [
                            theme.palette.success.main,
                            "#FFD700",
                            theme.palette.primary.main
                          ],
                          hoverBackgroundColor: [
                            theme.palette.success.main,
                            "#FFD700",
                            theme.palette.primary.main
                          ]
                        }
                      ]
                    }}
                    options={options}
                  />
                  <Typography
                    variant="h5"
                    align="center"
                    className={classes.performanceTitle}
                  >
                    Performance (APY)
                  </Typography>
                  <Table size="small">
                    <TableRow>
                      <TableCell>Average 1-year</TableCell>
                      <TableCell>{tier.performance[0]}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average 3-year</TableCell>
                      <TableCell>{tier.performance[1]}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Best 12-month</TableCell>
                      <TableCell>{tier.performance[2]}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Worst 12-month</TableCell>
                      <TableCell>{tier.performance[3]}%</TableCell>
                    </TableRow>
                  </Table>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={{
                      pathname: "/allocate-assets",
                      state: { allocation: tier.allocation }
                    }}
                  >
                    Select
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
}
