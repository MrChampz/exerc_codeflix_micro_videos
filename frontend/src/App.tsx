import React from 'react';
import { Box, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';

import { Navbar, Breadcrumbs, SnackbarProvider, LoadingProvider, Spinner } from './components';
import Router from './routes/Router';
import theme from './theme';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <MuiThemeProvider theme={ theme }>
        <LoadingProvider>
          <SnackbarProvider>
            <CssBaseline />
            <BrowserRouter>
              <Spinner />
              <Navbar />
              <Box paddingTop="70px">
                <Breadcrumbs />
                <Router />
              </Box>
            </BrowserRouter>
          </SnackbarProvider>
        </LoadingProvider>
      </MuiThemeProvider>
    </React.Fragment>
  );
}

export default App;
