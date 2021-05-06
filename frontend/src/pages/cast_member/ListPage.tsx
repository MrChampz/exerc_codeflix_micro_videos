import React from 'react'
import { Box, Fab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import Page from '../../components/Page';
import Table from './Table';

const ListPage: React.FC = () => {
  return (
    <Page title="Listagem de membros do elenco">
      <Box dir="rtl">
        <Fab
          title="Adicionar membro"
          size="small"
          component={ Link }
          to="/cast_members/create"
        >
          <AddIcon />
        </Fab>
      </Box>
      <Box>
        <Table />
      </Box>
    </Page>
  );
}

export default ListPage;