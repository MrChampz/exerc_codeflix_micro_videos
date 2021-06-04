import React from 'react';
import { useParams } from 'react-router';
import Page from '../../components/Page';
import Form from './Form';

const PageForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  return (
    <Page title={ !id ? "Criar video" : "Editar video" }>
      <Form />
    </Page>
  );
};

export default PageForm;