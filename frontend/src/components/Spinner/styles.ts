import { Theme } from "@material-ui/core";

export function makeSpinnerStyles(theme: Theme) {
  return {
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        ...theme.palette.error,
        main: '#FF0201',
      },
    }
  }
}