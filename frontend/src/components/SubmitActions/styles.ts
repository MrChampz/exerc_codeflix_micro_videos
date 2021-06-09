import { makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1)
    },
    save: {
      marginLeft: 0,
    }
  }
});