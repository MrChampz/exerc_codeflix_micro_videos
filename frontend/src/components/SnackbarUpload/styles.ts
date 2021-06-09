import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  card: {
    width: 450,
  },
  cardActionsRoot: {
    padding: '8px 8px 8px 16px',
    backgroundColor: theme.palette.primary.main,
  },
  title: {
    fontWeight: 'bold',
    color: theme.palette.primary.contrastText,
  },
  icons: {
    marginLeft: 'auto !important',
    color: theme.palette.primary.contrastText,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  }
}));

export const useUploadItemStyles = makeStyles(theme => ({
  listItem: {
    paddingTop: '7px',
    paddingBottom: '7px',
    height: '53px',
  },
  listItemText: {
    marginLeft: '6px',
    marginRight: '24px',
    color: theme.palette.text.secondary,
  },
  movieIcon: {
    minWidth: '40px',
    color: theme.palette.error.main,
  }
}));

export const useUploadActionsStyles = makeStyles(theme => ({
  successIcon: {
    color: theme.palette.success.main,
  },
  errorIcon: {
    color: theme.palette.error.main,
  },
}));