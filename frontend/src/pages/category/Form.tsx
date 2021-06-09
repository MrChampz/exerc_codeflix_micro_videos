import React, { useContext, useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from '../../util/vendor/yup';
import CategoryResource from '../../util/http/category-resource';
import { Response, Category } from '../../util/models';
import { DefaultForm, SubmitActions } from '../../components';
import LoadingContext from '../../components/LoadingProvider/LoadingContext';

const validationSchema = yup.object().shape({
  name: yup.string()
           .label("Nome")
           .max(255)
           .required()
});

const Form: React.FC = () => {
  const {
    getValues, 
    handleSubmit, 
    watch, 
    control, 
    reset,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true
    }
  });

  const router = useHistory();
  const { id } = useParams<{ id?: string }>();
  const { enqueueSnackbar } = useSnackbar();

  const loading = useContext(LoadingContext);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const { data } = await CategoryResource.get<Response<Category>>(id);
        reset(data.data);
      } catch(error) {
        console.error(error);
        enqueueSnackbar("Não foi possível carregar as informações", { variant: 'error' });
      }
    })();
  }, []);

  const onSubmit = async (formData, event) => {
    try {
      const promise = !id
        ?  CategoryResource.create<Response<Category>>(formData)
        :  CategoryResource.update<Response<Category>>(id, formData);

      const { data } = await promise;
  
      enqueueSnackbar("Categoria salva com sucesso", { variant: 'success' });
      setTimeout(() => {
        event ? (
          id ? router.replace(`/categories/${ data.data.id }/edit`)
          : router.push(`/categories/${ data.data.id }/edit`)
          ) : router.push('/categories');
      });
    } catch(error) {
      console.log(error);
      enqueueSnackbar("Não foi possível salvar a categoria", { variant: 'error' });
    }
  }
  
  return (
    <DefaultForm
      GridItemProps={{ xs: 12, md: 6 }}
      onSubmit={ handleSubmit(onSubmit) }
    >
      <Controller
        name="name"
        control={ control }
        render={({ field }) =>
          <TextField
            label="Nome"
            fullWidth
            variant="outlined"
            error={ errors.name !== undefined }
            helperText={ errors.name && errors.name.message }
            disabled={ loading }
            { ...field } 
          />
        }
      />
      <Controller
        name="description"
        control={ control }
        render={({ field }) =>
          <TextField
            label="Descrição"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            disabled={ loading }
            margin="normal"
            { ...field } 
          />
        }
      />
      <Controller
        name="is_active"
        control={ control }
        render={({ field }) =>
          <FormControlLabel
            label="Ativo?"
            labelPlacement="end"
            disabled={ loading }
            control={
              <Checkbox
                color="primary"
                checked={ watch("is_active") }
                { ...field }
              />
            }
          />
        }
      />
      <SubmitActions
        disabled={ loading }
        onSave={() => {
          trigger().then(valid => {
            valid && onSubmit(getValues(), null);
          });
        }}
      />
    </DefaultForm>
  );
};

export default Form;