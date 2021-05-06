import React from 'react';
import { Box } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { Navbar, Breadcrumbs } from './components';
import Router from './routes/Router';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Navbar />
        <Box paddingTop="70px">
          <Breadcrumbs />
          <Router />
        </Box>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
