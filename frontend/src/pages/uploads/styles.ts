import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  panelSummary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  expandedPanel: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  expandedIcon: {
    color: theme.palette.primary.contrastText
  }
}));

export const useUploadItemStyles = makeStyles(theme => ({
  gridTitle: {
    display: 'flex',
    color: '#999999'
  },
  icon: {
    minWidth: '40px',
    color: theme.palette.error.main
  },
}));

export const useUploadActionsStyles = makeStyles(theme => ({
  successIcon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.success.main,
  },
  errorIcon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.error.main,
  },
  divider: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    height: '20px'
  },
}));