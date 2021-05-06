import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    linkRouter: {
      color: "#4db5ab",
      "&:focus, &:active": {
        color: "#4db5ab",
      },
      "&:hover": {
        color: "#055a52",
      }
    }
  }),
);