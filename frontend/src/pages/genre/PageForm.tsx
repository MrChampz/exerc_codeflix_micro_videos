import React from 'react';
import { Box } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import Page from '../../components/Page';
import Form from './Form';

const PageForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  return (
    <Page title={ !id ? "Criar gênero" : "Editar gênero" }>
      <Box marginTop={2}>
        <Form />
      </Box>
    </Page>
  );
};

export default PageForm;