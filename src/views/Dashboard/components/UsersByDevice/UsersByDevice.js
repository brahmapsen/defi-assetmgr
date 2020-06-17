import React from "react";
import { Doughnut } from "react-chartjs-2";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Divider,
  Typography
} from "@material-ui/core";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Gold as GoldIcon, Crypto as CryptoIcon } from "icons";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%"
  },
  chartContainer: {
    position: "relative",
    height: "300px"
  },
  stats: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  },
  device: {
    textAlign: "center",
    padding: theme.spacing(1)
  },
  deviceIcon: {
    color: theme.palette.icon
  }
}));

const UsersByDevice = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [50, 30, 10, 10],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.primary.main,
          "#FFD700",
          "#933A16"
        ],
        borderWidth: 8,
        borderColor: theme.palette.white,
        hoverBorderColor: theme.palette.white
      }
    ],
    labels: ["Cash", "Crypto", "Gold", "Real Estate"]
  };

  const options = {
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    tooltips: {
      enabled: true,
      mode: "index",
      intersect: false,
      borderWidth: 1,
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.white,
      titleFontColor: theme.palette.text.primary,
      bodyFontColor: theme.palette.text.secondary,
      footerFontColor: theme.palette.text.secondary
    }
  };

  const devices = [
    {
      title: "Cash",
      value: "50",
      icon: <AttachMoneyIcon />,
      color: theme.palette.success.main
    },
    {
      title: "Crypto",
      value: "30",
      icon: <CryptoIcon />,
      color: theme.palette.primary.main
    },
    {
      title: "Gold",
      value: "10",
      icon: <GoldIcon />,
      color: "#FFD700"
    },
    {
      title: "Real Estate",
      value: "10",
      icon: <HomeWorkIcon />,
      color: "#933A16"
    }
  ];

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        action={
          <IconButton size="small">
            <RefreshIcon />
          </IconButton>
        }
        title="Asset Allocation"
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Doughnut data={data} options={options} />
        </div>
        <div className={classes.stats}>
          {devices.map(device => (
            <div className={classes.device} key={device.title}>
              <span className={classes.deviceIcon}>{device.icon}</span>
              <Typography variant="body1">{device.title}</Typography>
              <Typography style={{ color: device.color }} variant="h2">
                {device.value}%
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

UsersByDevice.propTypes = {
  className: PropTypes.string
};

export default UsersByDevice;
