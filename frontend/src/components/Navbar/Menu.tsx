import React, { useState } from 'react';
import { IconButton, Menu as MuiMenu, MenuItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import routes, { RouteProps } from '../../routes';

const listRoutes = [
  'dashboard',
  'categories.list',
  'genres.list',
  'cast_members.list',
];
const menuRoutes = routes.filter(route => listRoutes.includes(route.name));

const Menu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: any) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  return (
    <React.Fragment>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="abrir menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={ handleOpen }
      >
        <MenuIcon />
      </IconButton>
      <MuiMenu
        id="menu-appbar"
        open={ open }
        anchorEl={ anchorEl }
        onClose={ handleClose }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        getContentAnchorEl={ null }
      >
        { listRoutes.map((name, key) => {
          const route = menuRoutes.find(route => route.name === name) as RouteProps;
          return (
            <MenuItem
              key={ key }
              component={ Link }
              to={ route.path as string }
              onClick={ handleClose }
            >
              { route.label }
            </MenuItem>
          );
        })}
      </MuiMenu>
    </React.Fragment>
  );
}
 
export default Menu;