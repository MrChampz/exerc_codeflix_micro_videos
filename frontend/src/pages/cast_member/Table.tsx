import React, { useEffect, useState } from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { format, parseISO } from 'date-fns';
import { httpVideo } from '../../util/http';

const TYPE_ACTOR = 1;
const TYPE_DIRECTOR = 2;

const columns: MUIDataTableColumn[] = [
  {
    name: "name",
    label: "Nome"
  },
  {
    name: "type",
    label: "Tipo",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return value === TYPE_DIRECTOR ? "Diretor" :
               value === TYPE_ACTOR ? "Ator" :
               "Desconhecido";
      }
    },
  },
  {
    name: "created_at",
    label: "Criado em",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return <span>{ format(parseISO(value), 'dd/MM/yyyy') }</span>
      }
    },
  },
];

const Table: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    httpVideo.get('cast_members')
      .then(res => setData(res.data.data));
  }, []);

  return (
    <MUIDataTable
      title="Listagem de membros do elenco"
      columns={ columns }
      data={ data }
    />
  );
}

export default Table;