import { colors } from '@material-ui/core';

const white = '#FFFFFF';
const black = '#0e0e0e';

// Dark mode.
export default {
  black,
  white,
  primary: {
    contrastText: white,
    dark: colors.grey[900],
    // main: colors.grey[900],
    main: '#020202',
    light: colors.grey[600]
  },
  secondary: {
    contrastText: white,
    dark: colors.blue[900],
    // main: colors.blue['A400'],
    main: '#4550b7',
    light: colors.blue['A400']
  },
  success: {
    contrastText: white,
    dark: colors.green[900],
    main: colors.green[600],
    light: colors.green[400]
  },
  info: {
    contrastText: white,
    dark: colors.blue[900],
    main: colors.blue[600],
    light: colors.blue[400]
  },
  warning: {
    contrastText: white,
    dark: colors.orange[900],
    main: colors.orange[600],
    light: colors.orange[400]
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  text: {
    // primary: colors.blueGrey[900],
    primary: white,
    secondary: colors.blueGrey[600],
    link: colors.blue[600]
  },
  background: {
    default: '#0e0e0e',
    paper: '#0e0e0e'
  },
  icon: colors.blueGrey[600],
  divider: colors.grey[200]
};
