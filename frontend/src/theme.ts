import { createMuiTheme } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import createPalette from '@material-ui/core/styles/createPalette';

const palette = createPalette({
  primary: {
    main: '#79aec8',
    contrastText: '#fff',
  },
  secondary: {
    main: '#4db5ab',
    dark: '#055a52',
    contrastText: '#fff',
  },
  background: {
    default: '#fafafa'
  },
  success: {
    main: green["500"],
    contrastText: "#fff",
  },
  error: {
    main: red["500"],
  }
});

const theme = createMuiTheme({
  palette,
  overrides: {
    MUIDataTable: {
      paper: {
        boxShadow: 'none',
      }
    },
    MUIDataTableToolbar: {
      root: {
        minHeight: '58px',
        backgroundColor: palette.background.default,
      },
      icon: {
        color: palette.primary.main,
        '&:hover, &:active, &.focus': {
          color: palette.secondary.dark,
        }
      },
      iconActive: {
        color: palette.secondary.dark,
        '&:hover, &:active, &.focus': {
          color: palette.secondary.dark,
        }
      }
    },
    MUIDataTableHeadCell: {
      fixedHeader: {
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: palette.primary.main,
        color: '#ffffff',
        '&[aria-sort]': {
          backgroundColor: '#459ac4',
        },
      },
      sortActive: {
        color: '#fff',
      },
      sortAction: {
        color: '#fff',
        alignItems: 'center',
      },
      sortLabelRoot: {
        '& svg': {
          color: '#fff !important',
        },
      },
    },
    MUIDataTableSelectCell: {
      headerCell: {
        backgroundColor: palette.primary.main,
        '& span': {
          color: '#fff !important',
        },
      },
    },
    MUIDataTableBodyCell: {
      root: {
        color: palette.secondary.main,
        '&:hover, &active, &.focus': {
          color: palette.secondary.main,
        },
      },
    },
    MUIDataTableToolbarSelect: {
      root: {
        borderRadius: 0,
      },
      title: {
        color: palette.primary.main,
      },
      iconButton: {
        color: palette.primary.main,
      },
    },
    MUIDataTableBodyRow: {
      root: {
        color: palette.secondary.main,
        '&:nth-child(odd)': {
          backgroundColor: palette.background.default,
        },
      }
    },
    MUIDataTablePagination: {
      root: {
        color: palette.primary.main,
      },
    },
  }
});

export default theme;