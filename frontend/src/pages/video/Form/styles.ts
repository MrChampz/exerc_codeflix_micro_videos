import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

export const useStyles = makeStyles(theme => ({
  uploadCard: {
    margin: theme.spacing(2, 0),
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  openedCard: {
    marginBottom: theme.spacing(3),
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  openedCardContent: {
    paddingBottom: theme.spacing(2) + 'px !important',
  }
}));

export const useCategoryFieldStyles = makeStyles(theme => ({
  genresSubtitle: {
    color: grey['800'],
    fontSize: '0.8rem',
  }
}));