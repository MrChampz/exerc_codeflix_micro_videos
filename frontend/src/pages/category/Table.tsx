import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';
import { DefaultTable, TableColumn } from '../../components';
import { makeActionStyles } from '../../components/DefaultTable/styles';
import { BadgeActive, BadgeInactive } from '../../components/Badge';
import { Category, ListResponse } from '../../util/models';
import CategoryResource from '../../util/http/category-resource';
import FilterResetButton from '../../components/DefaultTable/FilterResetButton';
import useFilter from '../../hooks/useFilter';
import { MUIDataTableRefComponent } from '../../components/DefaultTable';

const columns: TableColumn[] = [
  {
    name: "id",
    label: "ID",
    options: {
      sort: false,
      filter: false,
    },
    width: "30%",
  },
  {
    name: "name",
    label: "Nome",
    width: "39%",
    options: {
      filter: false,
    },
  },
  {
    name: "is_active",
    label: "Status",
    options: {
      filterList: [],
      filterOptions: {
        names: ["Ativo", "Inativo"]
      },
      customBodyRender: (value, tableMeta, updateValue) => {
        return value ? <BadgeActive /> : <BadgeInactive />;
      }
    },
    width: "8%",
  },
  {
    name: "created_at",
    label: "Criado em",
    options: {
      filter: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return <span>{ format(parseISO(value), 'dd/MM/yyyy') }</span>
      }
    },
    width: "10%",
  },
  {
    name: "actions",
    label: "Ações",
    options: {
      sort: false,
      filter: false,
      customBodyRender: (value, tableMeta) => {
        return (
          <IconButton
            color="secondary"
            component={ Link }
            to={ `/categories/${ tableMeta.rowData[0] }/edit` }
          >
            <EditIcon />
          </IconButton>
        )
      }
    },
    width: "13%",
  },
];

const debounceTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];

const Table = () => {
  const { enqueueSnackbar } = useSnackbar();

  const subscribed = useRef(true);
  const tableRef = useRef() as MutableRefObject<MUIDataTableRefComponent>;

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Category[]>([]);

  const {
    filterManager,
    filterState,
    debouncedFilterState,
    totalRecords,
    setTotalRecords
  } = useFilter({
    columns,
    debounceTime,
    rowsPerPage,
    rowsPerPageOptions,
    tableRef
  });

  useEffect(() => {
    subscribed.current = true;
    filterManager.pushHistory();
    getData();
    return () => { subscribed.current = false; };
  }, [
    filterManager.cleanSearchText(debouncedFilterState.search),
    debouncedFilterState.pagination,
    debouncedFilterState.order,
  ]);

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await CategoryResource.list<ListResponse<Category>>({
        queryParams: {
          search: filterManager.cleanSearchText(filterState.search),
          page: filterState.pagination.page,
          per_page: filterState.pagination.perPage,
          sort: filterState.order.sort,
          dir: filterState.order.dir,
        }
      });
      if (subscribed.current) {
        setData(data.data);
        setTotalRecords(data.meta.total);
      }
    } catch(error) {
      console.error(error);
      if (CategoryResource.isCancelledRequest(error)) return;
      enqueueSnackbar("Não foi possível carregar as informações", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <MuiThemeProvider theme={ makeActionStyles(columns.length - 1) }>
      <DefaultTable
        title=""
        ref={ tableRef }
        columns={ columns }
        data={ data }
        loading={ loading }
        debouncedSearchTime={ debouncedSearchTime }
        options={{
          serverSide: true,
          searchText: filterState.search as any,
          page: filterState.pagination.page - 1,
          rowsPerPage: filterState.pagination.perPage,
          rowsPerPageOptions,
          count: totalRecords,
          sortOrder: {
            name: filterState.order.sort || "none",
            direction: (filterState.order.dir as any) || "asc",
          },
          customToolbar: () => (
            <FilterResetButton onClick={() => filterManager.resetFilter()} />
          ),
          onSearchChange: search => filterManager.changeSearch(search),
          onChangePage: page => filterManager.changePage(page),
          onChangeRowsPerPage: perPage => filterManager.changeRowsPerPage(perPage),
          onColumnSortChange: (changedColumn, dir) => {
            filterManager.changeColumnSort(changedColumn, dir);
          }
        }}
      />
    </MuiThemeProvider>
  );
}

export default Table;