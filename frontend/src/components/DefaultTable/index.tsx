import React, { forwardRef } from 'react';
import { MuiThemeProvider, Theme, useMediaQuery, useTheme } from '@material-ui/core';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableProps } from 'mui-datatables';
import { cloneDeep, merge, omit } from 'lodash';
import { TableColumn } from './TableColumn';
import makeDefaultOptions from './options';

export interface MUIDataTableRefComponent {
  changePage: (page: number) => void;
  changeRowsPerPage: (rowsPerPage: number) => void;
}

interface TableProps extends MUIDataTableProps {
  columns: TableColumn[];
  loading?: boolean;
  debouncedSearchTime?: number;
}

const DefaultTable = forwardRef<MUIDataTableRefComponent, TableProps>((props, ref) => {
  const theme = cloneDeep<Theme>(useTheme());
  const isLessThanSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const defaultOptions = makeDefaultOptions(props.debouncedSearchTime);

  const mergedProps = merge(
    { options: cloneDeep(defaultOptions) },
    props,
    { columns: extractMuiDataTableColumns(props.columns) }
  );
  
  const tableProps = getOriginalMuiDataTableProps();
  
  (() => {
    mergedProps.options!.textLabels!.body!.noMatch = props.loading
      ? "Carregando..."
      : mergedProps.options?.textLabels?.body?.noMatch;

    mergedProps.options!.responsive = isLessThanSmall
      ? 'standard'
      : 'vertical';
  })();
  
  function extractMuiDataTableColumns(columns: TableColumn[]): MUIDataTableColumn[] {
    setColumnWidth(columns);
    return columns.map(column => omit(column, 'width'));
  }

  function setColumnWidth(columns: TableColumn[]) {
    columns.forEach((column, key) => {
      if (column.width) {
        theme.overrides!.MUIDataTableHeadCell!.fixedHeader![`&:nth-child(${ key + 2 })`] = {
          width: column.width
        }
      }
    });
  }

  function getOriginalMuiDataTableProps() {
    return {
      ...omit(mergedProps, 'loading'),
      ref
    };
  }

  return (
    <MuiThemeProvider theme={ theme }>
      <MUIDataTable { ...tableProps } />
    </MuiThemeProvider>
  );
});

export default DefaultTable;