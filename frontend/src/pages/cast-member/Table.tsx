import React, { useEffect, useState } from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { format, parseISO } from 'date-fns';
import CastMemberResource from '../../util/http/cast-member-resource';

const CastMemberTypeMap = {
  1: 'Ator',
  2: 'Diretor',
}

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
        return CastMemberTypeMap[value];
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
    CastMemberResource
      .list()
      .then(res => setData(res.data.data));
  }, []);

  return (
    <MUIDataTable
      title="Listagem de membros de elencos"
      columns={ columns }
      data={ data }
    />
  );
}

export default Table;