import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 1),
    color: theme.palette.secondary.main,
    backgroundColor: '#f1f1f1',
    borderRadius: '4px',
  },
}));