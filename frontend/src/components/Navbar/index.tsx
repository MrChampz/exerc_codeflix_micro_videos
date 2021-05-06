import React from 'react';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { useStyles } from './styles';
import logo from '../../static/img/logo.png';
import Menu from './Menu';

const Navbar: React.FC = () => {
  const classes = useStyles();
  return (
    <AppBar>
      <Toolbar className={ classes.toolbar }>
        <Menu />
        <Typography className={ classes.title }>
          <img src={ logo } alt="Codeflix" className={ classes.logo } />
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;