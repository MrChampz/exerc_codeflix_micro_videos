import { MUIDataTableOptions } from "mui-datatables";
import DebouncedTableSearch from "./DebouncedTableSearch";

const makeDefaultOptions = (debouncedSearchTime?: number): MUIDataTableOptions => ({
  print: false,
  download: false,
  textLabels: {
    body: {
      noMatch: "Nenhum registro encontrado",
      toolTip: "Classificar",
    },
    pagination: {
      next: "Próxima página",
      previous: "Página anterior",
      rowsPerPage: "Por página:",
      displayRows: "de",
    },
    toolbar: {
      search: "Pesquisar",
      downloadCsv: "Download CSV",
      print: "Imprimir",
      viewColumns: "Colunas visíveis",
      filterTable: "Filtrar tabela",
    },
    filter: {
      all: "Todos",
      title: "FILTROS",
      reset: "LIMPAR",
    },
    viewColumns: {
      title: "Colunas visíveis",
      titleAria: "Ver/esconder colunas da tabela"
    },
    selectedRows: {
      text: "registro(s) selecionados",
      delete: "Excluir",
      deleteAria: "Excluir registros selecionados",
    },
  },
  customSearchRender: (searchText, handleSearch, hideSearch, options) => (
    <DebouncedTableSearch
      searchText={ searchText }
      onSearch={ handleSearch }
      onHide={ hideSearch }
      options={ options }
      debounceTime={ debouncedSearchTime }
    />
  ),
});

export default makeDefaultOptions;