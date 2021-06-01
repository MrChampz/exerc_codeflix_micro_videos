import { Dispatch, MutableRefObject, Reducer, useEffect, useReducer, useState } from "react";
import { MUIDataTableColumn } from "mui-datatables";
import { History } from 'history';
import { useDebounce } from "use-debounce";
import { useHistory } from "react-router";
import { isEqual } from "lodash";
import * as yup from 'yup';

import reducer, { Creators } from "../store/filter";
import { State as FilterState, Actions as FilterActions } from "../store/filter/types";
import { MUIDataTableRefComponent } from "../components/DefaultTable";

interface UseFilterProps {
  columns: MUIDataTableColumn[];
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
  tableRef: MutableRefObject<MUIDataTableRefComponent>;
  extraFilter?: ExtraFilter;
}

interface FilterManagerOptions extends Omit<UseFilterProps, 'debounceTime'> {
  history: History;
}

interface ExtraFilter {
  getStateFromURL: (queryParams: URLSearchParams) => any;
  formatSearchParams: (debouncedState: FilterState) => any;
  createValidationSchema: () => any;
}

type FilterReducer = Reducer<FilterState, FilterActions>;

const useFilter = (options: UseFilterProps) => {
  const history = useHistory();
  const filterManager = new FilterManager({ ...options, history });

  const initialState = filterManager.getStateFromURL();
  const [filterState, dispatch] = useReducer<FilterReducer>(reducer, initialState);
  const [debouncedFilterState] = useDebounce(filterState, options.debounceTime);
  const [totalRecords, setTotalRecords] = useState(0);

  filterManager.state = filterState;
  filterManager.debouncedState = debouncedFilterState;
  filterManager.dispatch = dispatch;

  useEffect(() => {
    filterManager.replaceHistory();
  }, []);

  return {
    filterManager,
    filterState,
    debouncedFilterState,
    dispatch,
    totalRecords,
    setTotalRecords
  };
}

export class FilterManager {
  
  schema: any;
  state: FilterState;
  debouncedState: FilterState;
  dispatch: Dispatch<FilterActions>;
  columns: MUIDataTableColumn[];
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  history: History;
  tableRef: MutableRefObject<MUIDataTableRefComponent>;
  extraFilter?: ExtraFilter;
  
  constructor(options: FilterManagerOptions) {
    const {
      columns, rowsPerPage, rowsPerPageOptions, history, tableRef, extraFilter
    } = options;

    this.state = null as any;
    this.debouncedState = null as any;
    this.dispatch = null as any;
    this.columns = columns;
    this.rowsPerPage = rowsPerPage;
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.history = history;
    this.tableRef = tableRef;
    this.extraFilter = extraFilter ? extraFilter : undefined;
    this.createValidationSchema();
  }

  changeSearch(search) {
    this.dispatch(Creators.setSearch({ search }));
  }

  changePage(page: number) {
    this.dispatch(Creators.setPage({ page: page + 1 }));
  }

  changeRowsPerPage(perPage: number) {
    this.dispatch(Creators.setPerPage({ perPage }));
  }

  changeColumnSort(changedColumn: string, dir: string) {
    this.dispatch(Creators.setOrder({ sort: changedColumn, dir }));
    this.resetTablePagination();
  }

  changeExtraFilter(data) {
    this.dispatch(Creators.updateExtraFilter(data));
  }

  resetFilter() {
    const initialState = {
      ...this.schema.cast({}),
      search: { value: null, update: true }
    };
    this.dispatch(Creators.setReset({ state: initialState }));
    this.resetTablePagination();
  }

  cleanSearchText(text) {
    let newText = text;
    if (text && text.value !== undefined) {
      newText = text.value;
    }
    return newText;
  }

  getStateFromURL() {
    const params = this.history.location.search.substr(1);
    const queryParams = new URLSearchParams(params);
    return this.schema.cast({
      search: queryParams.get('search'),
      pagination: {
        page: queryParams.get('page'),
        perPage: queryParams.get('per_page'),
      },
      order: {
        sort: queryParams.get('sort'),
        dir: queryParams.get('dir'),
      },
      ...(this.extraFilter && {
        extraFilter: this.extraFilter.getStateFromURL(queryParams)
      })
    });
  }

  pushHistory() {
    const newLocation = {
      pathname: this.history.location.pathname,
      search: "?" + new URLSearchParams(this.formatSearchParams() as any),
      state: {
        ...this.debouncedState,
        search: this.cleanSearchText(this.debouncedState.search)
      }
    };

    const currentState = this.history.location.state;
    const newState = this.debouncedState;
    if (isEqual(currentState, newState)) return;

    this.history.push(newLocation);
  }

  replaceHistory() {
    this.history.replace({
      pathname: this.history.location.pathname,
      search: "?" + new URLSearchParams(this.formatSearchParams() as any),
      state: this.debouncedState
    });
  }

  private formatSearchParams() {
    const search = this.cleanSearchText(this.debouncedState.search);
    return {
      ...(search && search !== '' && { search }),
      ...(this.debouncedState.pagination.page !== 1 && {
        page: this.debouncedState.pagination.page
      }),
      ...(this.debouncedState.pagination.perPage !== 15 && {
        per_page: this.debouncedState.pagination.perPage
      }),
      ...(this.debouncedState.order.sort && this.debouncedState.order),
      ...(this.extraFilter && this.extraFilter.formatSearchParams(this.debouncedState))
    };
  }

  private resetTablePagination() {
    this.tableRef.current.changeRowsPerPage(this.rowsPerPage);
    this.tableRef.current.changePage(0);
  }

  private createValidationSchema() {
    this.schema = yup.object().shape({
      search: yup
        .string()
        .transform(value => !value ? undefined : value)
        .default(''),
      pagination: yup.object().shape({
        page: yup
          .number()
          .transform(value => isNaN(value) || parseInt(value) < 1 ? undefined : value)
          .default(1),
        perPage: yup
          .number()
          .transform(value => {
            return isNaN(value) || !this.rowsPerPageOptions.includes(parseInt(value))
              ? undefined
              : value
          })
          .default(this.rowsPerPage),
      }),
      order: yup.object().shape({
        sort: yup
          .string()
          .nullable()
          .transform(value => {
            const columnsName = this.columns
              .filter(column => !column.options || column.options.sort !== false)
              .map(column => column.name);
            return columnsName.includes(value) ? value : undefined;
          })
          .default(null),
        dir: yup
          .string()
          .nullable()
          .transform(value => {
            return !value || !['asc', 'desc'].includes(value.toLowerCase())
              ? undefined
              : value
          })
          .default(null),
      }),
      ...(this.extraFilter && {
        extraFilter: this.extraFilter.createValidationSchema()
      })
    });
  }
}

export default useFilter;