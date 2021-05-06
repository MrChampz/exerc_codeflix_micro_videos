import { makeStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    backgroundColor: "#000000",
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
  logo: {
    width: 100,
    [theme.breakpoints.up('sm')]: {
      width: 170,
    },
  }
}));