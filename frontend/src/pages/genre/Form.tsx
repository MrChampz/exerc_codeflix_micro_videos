import React, { useEffect, useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, ListItemText, MenuItem, Select, TextField } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from '../../util/vendor/yup';
import GenreResource from '../../util/http/genre-resource';
import CategoryResource from '../../util/http/category-resource';
import { ListResponse, Response, Category, Genre } from '../../util/models';
import { DefaultForm, SubmitActions } from '../../components';

const validationSchema = yup.object().shape({
  name:
    yup.string()
       .label("Nome")
       .max(255)
       .required(),
  categories:
    yup.array()
       .label("Categorias")
       .min(1, "É necessário pelo menos uma categoria")
});

const Form: React.FC = () => {
  const {
    getValues,
    setValue,
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
      is_active: true,
      categories: [] as string[],
    }
  });
  
  const router = useHistory();
  const { id } = useParams<{ id?: string }>();
  const { enqueueSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const selectedCategories = watch("categories");

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await CategoryResource.list<ListResponse<Category>>({
          queryParams: {
            all: ''
          }
        });
        isSubscribed && setCategories(data.data);

        if (id) {
          const { data } = await GenreResource.get<Response<Genre>>(id);
          reset({
            ...data.data,
            categories: data.data.categories.map(category => category.id),
          });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Não foi possível carregar as informações", { variant: 'error' });
      } finally {
        setLoading(false);
      }
    })();

    return () => { isSubscribed = false; }
  }, []);

  const onSubmit = async (formData, event) => {
    setLoading(true);
    try {
      const promise = !id
        ?  GenreResource.create<Response<Genre>>(formData)
        :  GenreResource.update<Response<Genre>>(id, formData);
      
      const { data } = await promise;

      enqueueSnackbar("Gênero salvo com sucesso", { variant: 'success' });
      setTimeout(() => {
        event ? (
          id ? router.replace(`/genres/${ data.data.id }/edit`)
             : router.push(`/genres/${ data.data.id }/edit`)
        ) : router.push('/genres');
      });
    } catch(error) {
      console.log(error);
      enqueueSnackbar("Não foi possível salvar o gênero", { variant: 'error' });
    } finally {
      setLoading(false);
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
        <FormHelperText>{ errors.categories && (errors.categories as any).message }</FormHelperText>
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