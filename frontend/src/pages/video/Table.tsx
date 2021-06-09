import { MutableRefObject, useContext, useEffect, useRef, useState } from 'react';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';
import { DefaultTable, DeleteDialog, TableColumn } from '../../components';
import { makeActionStyles } from '../../components/DefaultTable/styles';
import FilterResetButton from '../../components/DefaultTable/FilterResetButton';
import { MUIDataTableRefComponent } from '../../components/DefaultTable';
import { ListResponse, Video } from '../../util/models';
import CategoryResource from '../../util/http/category-resource';
import VideoResource from '../../util/http/video-resource';
import useFilter from '../../hooks/useFilter';
import useDeleteCollection from '../../hooks/useDeleteCollection';
import LoadingContext from '../../components/LoadingProvider/LoadingContext';

const columns: TableColumn[] = [
  {
    name: "id",
    label: "ID",
    options: {
      sort: false,
      filter: false,
    },
    width: "26%",
  },
  {
    name: "title",
    label: "Título",
    width: "26%",
    options: {
      filter: false,
    },
  },
  {
    name: "genres",
    label: "Gêneros",
    options: {
      filter: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return value.map(genre => genre.name).join(', ');
      }
    },
    width: "15%",
  },
  {
    name: "categories",
    label: "Categorias",
    options: {
      filter: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return value.map(category => category.name).join(', ');
      }
    },
    width: "15%",
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
            to={ `/videos/${ tableMeta.rowData[0] }/edit` }
          >
            <EditIcon />
          </IconButton>
        )
      }
    },
    width: "8%",
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

  const loading = useContext(LoadingContext);
  const [data, setData] = useState<Video[]>([]);

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
  });

  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    rowsToDelete,
    setRowsToDelete
  } = useDeleteCollection();

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
    try {
      const { data } = await VideoResource.list<ListResponse<Video>>({
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
    }
  }

  const deleteRows = (confirmed: boolean) => {
    if (!confirmed) {
      setOpenDeleteDialog(false);
      return;
    }
    
    const ids = rowsToDelete.data.map(row => data[row.index].id).join(',');

    VideoResource.deleteCollection({ ids })
      .then(res => {
        enqueueSnackbar("Registros excluídos com sucesso", { variant: 'success' });
        if (rowsToDelete.data.length === filterState.pagination.perPage &&
            filterState.pagination.page > 1) {
          const page = filterState.pagination.page - 2;
          filterManager.changePage(page);
        } else {
          getData();
        }
      })
      .catch(error => {
        console.error(error);
        enqueueSnackbar("Não foi possível excluir os registros", { variant: 'error' });
      })
      .finally(() => setOpenDeleteDialog(false));
  }

  return (
    <MuiThemeProvider theme={ makeActionStyles(columns.length - 1) }>
      <DeleteDialog
        open={ openDeleteDialog }
        onClose={ deleteRows }
      />
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
          onRowsDelete: (rowsDeleted) => {
            setRowsToDelete(rowsDeleted);
            return false;
          },
        }}
      />
    </MuiThemeProvider>
  );
}

export default Table;