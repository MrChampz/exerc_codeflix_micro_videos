import { makeStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => ({
  variantSuccess: {
    backgroundColor: theme.palette.success.main,
  },
  variantError: {
    backgroundColor: theme.palette.error.main,
  },
  variantInfo: {
    backgroundColor: theme.palette.info.main,
  },
}));