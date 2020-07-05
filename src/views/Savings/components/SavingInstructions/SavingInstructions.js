import React from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

function Vault() {
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Before earning interest on your savings you need get some DAI. DAI is
        like the US $ on the Ethereum blockchain. You can borrow DAI against
        your ETH by opening a vault.
      </Typography>
      <Typography variant="subtitle1">
        Currently DeFI Dashboard doesn't support that step. We recommend{" "}
        <Link href="https://oasis.app/borrow" target="_blank">
          Oasis
        </Link>{" "}
        for opening a vault. Please select ETH-A as collateral type and make
        sure that you connect the same wallet that you are using in the
        dashboard.
      </Typography>
    </React.Fragment>
  );
}

function DAI() {
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Deposit ETH into vault and generate DAI
      </Typography>
      <Typography variant="subtitle1">
        We recommend to generate not too much DAI. Your collateralization ratio
        shouldn't be below 200%.
      </Typography>
    </React.Fragment>
  );
}

function Savings() {
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Earn interest on your saved DAIs
      </Typography>
      <Typography variant="subtitle1">
        Put your DAI into a dezentralized savings account. Currently DeFI
        Dashboard doesn't support that step. We recommend{" "}
        <Link
          href="https://app.defisaver.com/smart-savings/manage"
          target="_blank"
        >
          DefiSaver's Smart Savings
        </Link>{" "}
        for this. Please make sure that you connect the same wallet that you are
        using in the dashboard.
      </Typography>
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  }
}));

const steps = ["Setup Vault", "Get some DAI", "Put DAI into saving accounts"];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Vault />;
    case 1:
      return <DAI />;
    case 2:
      return <Savings />;
    default:
      throw new Error("Unknown step");
  }
}

const SavingInstructions = props => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(props.step);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Start Saving
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <Redirect to="/sign-in" />
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    I have done that
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
};

export default SavingInstructions;
