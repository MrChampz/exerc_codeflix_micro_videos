import React from 'react';
import { Route, Switch } from 'react-router-dom';

import routes from './';

const Router: React.FC = () => {
  return (
    <Switch>
      { routes.map((route, key) => (
        <Route
          key={ key }
          { ...route }
        />
      ))}
    </Switch>
  );
}

export default Router;
