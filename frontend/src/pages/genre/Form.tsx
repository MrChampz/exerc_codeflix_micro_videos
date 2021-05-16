import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, ListItemText, makeStyles, MenuItem, Select, TextField, Theme, Typography } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import GenreResource from '../../util/http/genre-resource';
import CategoryResource from '../../util/http/category-resource';
import * as yup from '../../util/vendor/yup';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1)
    }
  }
});

interface Category {
  id: string;
  name: string;
}

const validationSchema = yup.object().shape({
  name:
    yup.string()
       .label("Nome")
       .max(255)
       .required(),
  categories:
    yup.array()
       .of(yup.string().uuid())
       .label("Categorias")
       .min(1)
       .required()
});

const Form: React.FC = () => {
  const classes = useStyles();
  const router = useHistory();
  const { id } = useParams<{ id?: string }>();
  const { enqueueSnackbar } = useSnackbar();

  const { watch, getValues, setValue, handleSubmit, control, reset, formState: { errors }} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      is_active: true,
      categories: [],
    }
  });
  const selectedCategories = watch("categories") as string[];

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    CategoryResource
      .list()
      .then(res => setCategories(res.data.data))
      .finally(() => !id && setLoading(false));

    if (id) {
      GenreResource
        .get(id)
        .then(({ data }) => {
          reset(data.data);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const onSubmit = (formData, event) => {
    setLoading(true);
    const result = !id
      ?  GenreResource.create(formData)
      :  GenreResource.update(id, formData);

    result
      .then(({ data }) => {
        enqueueSnackbar("Gênero salvo com sucesso", { variant: 'success' });
        setTimeout(() => {
          event ? (
            id ? router.replace(`/genres/${ data.data.id }/edit`)
               : router.push(`/genres/${ data.data.id }/edit`)
            ) : router.push('/genres');
        });
      })
      .catch(error => {
        console.log(error);
        enqueueSnackbar("Não foi possível salvar o gênero", { variant: 'error' });
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
      <FormControl
        variant="outlined"
        fullWidth
        margin="normal"
        error={ errors.categories !== undefined }
        disabled={ loading }
      >
        <InputLabel id="categories-label">Categorias</InputLabel>
        <Select
          id="categories-input"
          label="Categorias"
          labelId="categories-label"
          multiple
          value={ selectedCategories }
          onChange={ event => {
            setValue("categories", event.target.value as never[], { shouldValidate: true });
          }}
          renderValue={ selected =>
            (selected as string[])
              .map(id => categories.find(c => c.id === id)?.name)
              .join(', ')
          }
        >
          <MenuItem value="" disabled>
            Selecione uma ou mais categorias
          </MenuItem>
          { categories.map(category => (
            <MenuItem key={ category.id } value={ category.id }>
              <Checkbox color="primary" checked={ selectedCategories.indexOf(category.id) > -1 } />
              <ListItemText primary={ category.name } />
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{ errors.categories && errors.categories[0] && errors.categories[0].message }</FormHelperText>
      </FormControl>
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