import { makeStyles, Theme } from "@material-ui/core";
import { cloneDeep } from "lodash";

export const makeActionStyles = (column: number) => {
  return (theme: Theme) => {
    const themeCopy = cloneDeep(theme);
    const selector = `&[data-testid^="MuiDataTableBodyCell-${ column }"]`;
    themeCopy.overrides!.MUIDataTableBodyCell!.root![selector] = {
      paddingTop: 0,
      paddingBottom: 0,
    };
    return themeCopy;
  };
};

export const makeFilterResetButtonStyles = makeStyles(theme => ({
  iconButton: theme.overrides!.MUIDataTableToolbar!.icon!
}));

export const makeDebouncedTableSearchStyles = makeStyles(
  theme => ({
    main: {
      display: 'flex',
      flex: '1 0 auto',
    },
    searchIcon: {
      color: theme.palette.text.secondary,
      marginTop: '10px',
      marginRight: '8px',
    },
    searchText: {
      flex: '0.8 0',
    },
    clearIcon: {
      '&:hover': {
        color: theme.palette.error.main,
      },
    },
  }),
  { name: 'MUIDataTableSearch' },
);