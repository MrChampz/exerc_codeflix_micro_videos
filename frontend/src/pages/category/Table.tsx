import React, { useEffect, useState } from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { format, parseISO } from 'date-fns';
import CategoryResource from '../../util/http/category-resource';
import { BadgeActive, BadgeInactive } from '../../components/Badge';

const columns: MUIDataTableColumn[] = [
  {
    name: "name",
    label: "Nome"
  },
  {
    name: "is_active",
    label: "Status",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return value ? <BadgeActive /> : <BadgeInactive />;
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
    CategoryResource
      .list()
      .then(res => setData(res.data.data));
  }, []);

  return (
    <MUIDataTable
      title="Listagem de categorias"
      columns={ columns }
      data={ data }
    />
  );
}

export default Table;