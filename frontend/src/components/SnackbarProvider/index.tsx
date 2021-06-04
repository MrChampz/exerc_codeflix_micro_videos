import React from 'react';
import { IconButton } from '@material-ui/core';
import { SnackbarProvider as NotistackProvider, SnackbarProviderProps } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';
import { useStyles } from './styles';

const SnackbarProvider: React.FC<SnackbarProviderProps> = (props) => {
  const classes = useStyles();

  let snackbarProviderRef;
  
  const defaultProps: SnackbarProviderProps = {
    classes,
    autoHideDuration: 3000,
    maxSnack: 3,
    anchorOrigin: {
      horizontal: 'right',
      vertical: 'top',
    },
    preventDuplicate: true,
    ref: (ref) => snackbarProviderRef = ref,
    action: (key: string) => (
      <IconButton
        color="inherit"
        style={{ fontSize: 20 }}
        onClick={() => snackbarProviderRef.closeSnackbar(key)}
      >
        <CloseIcon />
      </IconButton>
    ),
    children: null
  };
  const newProps = { ...defaultProps, ...props };

  return (
    <NotistackProvider { ...newProps }>
      { props.children }
    </NotistackProvider>
  );
};

export default SnackbarProvider;