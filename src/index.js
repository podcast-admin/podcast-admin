import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Routing from './components/Routing';

import * as serviceWorker from './serviceWorker';

import './helpers/i18n';

const theme = createTheme({
  palette: {
    primary: {
      light: '#fff',
      main: '#1976d2',
      dark: '#000',
    },
    secondary: {
      main: '#f44336',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

ReactDOM.render(
  <BrowserRouter>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routing />
      </ThemeProvider>
    </StyledEngineProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
