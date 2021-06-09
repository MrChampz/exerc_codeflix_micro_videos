import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

export const useStyles = makeStyles(theme => ({
  progressContainer: {
    position: 'relative'
  },
  progressBackground: {
    color: grey["300"]
  },
  progress: {
    position: 'absolute',
    left: 0
  },
}));