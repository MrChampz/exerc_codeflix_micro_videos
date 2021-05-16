import React from 'react';
import Typography from '@material-ui/core/Typography';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import { Route } from 'react-router';
import { Location } from 'history';
import RouteParser from 'route-parser';
import routes from '../../routes';
import LinkRouter from './LinkRouter';
import { useStyles } from './styles';
import { Box, Container } from '@material-ui/core';

const routeMap: { [key: string]: string } = {};
routes.forEach(route => routeMap[route.path as string] = route.label);

const Breadcrumbs: React.FC = () => {
  const classes = useStyles();

  const makeBreadcrumb = (location: Location) => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    pathnames.unshift('/');
    return (
      <MuiBreadcrumbs aria-label="breadcrumb">
        { pathnames.map((_, index) => {
          const last = index === pathnames.length - 1;
          const to = `${ pathnames.slice(0, index + 1).join('/').replace('//', '/') }`;
          const route = Object.keys(routeMap).find(path => new RouteParser(path).match(to));

          if (route === undefined) return false;

          return last ? (
            <Typography
              key={ to }
              color="textPrimary"
            >
              { routeMap[route] }
            </Typography>
          ) : (
            <LinkRouter
              key={ to }
              to={ to }
              color="inherit"
              className={ classes.linkRouter }
            >
              { routeMap[route] }
            </LinkRouter>
          );
        })}
      </MuiBreadcrumbs>
    );
  }
  
  return (
    <Container>
      <Box paddingTop={2} paddingBottom={1}>
        <Route>
          {({ location }) => makeBreadcrumb(location)}
        </Route>
      </Box>
    </Container>
  );
}

export default Breadcrumbs;