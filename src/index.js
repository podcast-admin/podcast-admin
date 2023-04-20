import { StyledEngineProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './helpers/i18n';
import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');
const root = createRoot(container);

// Create a reactQuery client
const queryClient = new QueryClient();

root.render(
  <BrowserRouter>
    <StyledEngineProvider injectFirst>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StyledEngineProvider>
  </BrowserRouter>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
