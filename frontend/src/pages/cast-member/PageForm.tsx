import React from 'react';
import { Box } from '@material-ui/core';
import Page from '../../components/Page';
import Form from './Form';

const PageForm: React.FC = () => {
  return (
    <Page title="Criar membro de elenco">
      <Box>
        <Form />
      </Box>
    </Page>
  );
};

export default PageForm;