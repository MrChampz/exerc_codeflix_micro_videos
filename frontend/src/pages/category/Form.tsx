import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, useParams } from 'react-router';
import CategoryResource from '../../util/http/category-resource';
import * as yup from '../../util/vendor/yup';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1)
    }
  }
});

const validationSchema = yup.object().shape({
  name: yup.string()
           .label("Nome")
           .max(255)
           .required()
});

const Form: React.FC = () => {
  const classes = useStyles();
  const router = useHistory();
  const { id } = useParams<{ id?: string }>();
  const { enqueueSnackbar } = useSnackbar();

  const { getValues, handleSubmit, watch, control, reset, formState: { errors }} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    CategoryResource
      .get(id)
      .then(({ data }) => {
        reset(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = (formData, event) => {
    setLoading(true);
    const result = !id
      ?  CategoryResource.create(formData)
      :  CategoryResource.update(id, formData);

    result
      .then(({ data }) => {
        enqueueSnackbar("Categoria salva com sucesso", { variant: 'success' });
        setTimeout(() => {
          event ? (
            id ? router.replace(`/categories/${ data.data.id }/edit`)
            : router.push(`/categories/${ data.data.id }/edit`)
            ) : router.push('/categories');
        });
      })
      .catch(error => {
        console.log(error);
        enqueueSnackbar("Não foi possível salvar a categoria", { variant: 'error' });
      })
      .finally(() => setLoading(false));
  }
  
  return (
    <form onSubmit={ handleSubmit(onSubmit) }>
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
      <Box dir="rtl">
        <Button
          className={ classes.submit }
          variant="contained"
          color="secondary"
          onClick={() => onSubmit(getValues(), null)}
          disabled={ loading }
        >
          Salvar
        </Button>
        <Button
          className={ classes.submit }
          variant="contained"
          color="secondary"
          type="submit"
          disabled={ loading }
        >
          Salvar e continuar editando
        </Button>
      </Box>
    </form>
  );
};

export default Form;