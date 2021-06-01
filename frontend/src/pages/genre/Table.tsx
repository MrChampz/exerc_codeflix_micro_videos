import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import { DefaultTable, TableColumn } from '../../components';
import { makeActionStyles } from '../../components/DefaultTable/styles';
import { BadgeActive, BadgeInactive } from '../../components/Badge';
import { Category, Genre, ListResponse } from '../../util/models';
import GenreResource from '../../util/http/genre-resource';
import { MUIDataTableRefComponent } from '../../components/DefaultTable';
import useFilter from '../../hooks/useFilter';
import FilterResetButton from '../../components/DefaultTable/FilterResetButton';
import CategoryResource from '../../util/http/category-resource';

const columns: TableColumn[] = [
  {
    name: "id",
    label: "ID",
    options: {
      sort: false,
      filter: false,
    },
    width: "28%",
  },
  {
    name: "name",
    label: "Nome",
    options: {
      filter: false,
    },
    width: "15%",
  },
  {
    name: "categories",
    label: "Categorias",
    options: {
      filterType: 'multiselect',
      filterOptions: {
        names: []
      },
      customBodyRender: (value, tableMeta, updateValue) => {
        return value.map(category => category.name).join(', ');
      }
    },
    width: "26%",
  },
  {
    name: "is_active",
    label: "Status",
    options: {
      filter: false,
      customFilterListOptions: {
        render: (v) => {
          if (v === true) {
            return ["ativo: SIM"];
          } else if (v === false) {
            return ["ativo: NÃO"];
          }
          return [];
        },
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
            to={ `/genres/${ tableMeta.rowData[0] }/edit` }
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

const Table: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const subscribed = useRef(true);
  const tableRef = useRef() as MutableRefObject<MUIDataTableRefComponent>;

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Genre[]>([]);

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
    tableRef,
    extraFilter: {
      createValidationSchema: () => {
        return yup.object().shape({
          categories: yup
            .mixed()
            .nullable()
            .transform(value => {
              return !value || value === '' ? undefined : value.split(',');
            })
            .default(null),
        });
      },
      formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter ? {
          ...(debouncedState.extraFilter.categories && {
            categories: debouncedState.extraFilter.categories.join(',')
          }),
        } : undefined;
      },
      getStateFromURL: (queryParams) => {
        return {
          categories: queryParams.get('categories'),
        }
      },
    }
  });

  const column = columns.find(column => column.name === 'categories');
  if (debouncedFilterState.extraFilter) {
    if (column && column.options) {
      const categoriesFilter = debouncedFilterState.extraFilter.categories;
      column.options.filterList = categoriesFilter ? categoriesFilter : [];
    }
  }

  useEffect(() => {
    let subscribed = true;
    (async () => {
      try {
        const { data } = await CategoryResource.list<ListResponse<Category>>({
          queryParams: { all: '' }
        });
        if (subscribed && column?.options?.filterOptions) {
          const categories = data.data.map(category => category.name);
          column.options.filterOptions.names = categories;
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Não foi possível carregar as informações", { variant: 'error' });
      }
    })();
    return () => { subscribed = false; }
  }, []);

  useEffect(() => {
    subscribed.current = true;
    filterManager.pushHistory();
    getData();
    return () => { subscribed.current = false; };
  }, [
    filterManager.cleanSearchText(debouncedFilterState.search),
    debouncedFilterState.pagination,
    debouncedFilterState.order,
    debouncedFilterState.extraFilter
  ]);

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await GenreResource.list<ListResponse<Genre>>({
        queryParams: {
          search: filterManager.cleanSearchText(filterState.search),
          page: filterState.pagination.page,
          per_page: filterState.pagination.perPage,
          sort: filterState.order.sort,
          dir: filterState.order.dir,
          ...(debouncedFilterState.extraFilter &&
              debouncedFilterState.extraFilter.categories && {
            categories: debouncedFilterState.extraFilter.categories.join(',')
          })
        }
      });
      if (subscribed.current) {
        setData(data.data);
        setTotalRecords(data.meta.total);
      }
    } catch(error) {
      console.error(error);
      if (GenreResource.isCancelledRequest(error)) return;
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
          },
          onFilterChange: (column, filterList, type, index) => {
            filterManager.changeExtraFilter({
              [column as string]: filterList[index].length ? filterList[index] : null
            });
          },
        }}
      />
    </MuiThemeProvider>
  );
}

export default Table;