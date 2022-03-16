//Your theme for the new stuff using material UI has been copied here so it doesn't conflict
import { createMuiTheme } from '@material-ui/core/styles';

const newTheme = createMuiTheme({
  palette: {
    type: 'dark',
    text: {
      primary: '#000',
    },
    background: {
      default: '#121212',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    primary: {
      light: '#FFD170',
      main: '#21ad8f',
      dark: '#21c38f',
      contrastText: '#000',
    },
    discord :{
      light: '#6043f7',
      main: '#6043f7',
    },
    secondary: {
      light: '#6043f7',
      main: '#6043f7',
      dark: '#757ce8',
      contrastText: '#000',
    },
    action: {
      disabledBackground: '#CDCDCD',
      active: '#000',
      hover: '#000',
    },
  },
  typography: {
    color: '#E6E9EE',
    fontFamily: ['"Gilroy"', 'sans-serif'].join(','),
  },
});

export default newTheme;
