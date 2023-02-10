import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';

import * as serviceWorker from './serviceWorker';

import './helpers/i18n';

import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </BrowserRouter>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
