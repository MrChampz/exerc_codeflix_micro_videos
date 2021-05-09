import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, makeStyles, MenuItem, Select, TextField, Theme, Typography } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import GenreResource from '../../util/http/genre-resource';
import CategoryResource from '../../util/http/category-resource';

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

const Form: React.FC = () => {
  const classes = useStyles();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    CategoryResource
      .list()
      .then(res => setCategories(res.data.data));
  }, []);

  const { getValues, handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      is_active: true,
      categories: [],
    }
  });
  const selectedCategories = watch("categories") as string[];

  const onSubmit = (formData, event) => {
    GenreResource
      .create(formData)
      .then(res => console.log(res));
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
            { ...field } 
          />
        }
      />
      <FormControl
        variant="outlined"
        fullWidth
        margin="normal" 
      >
        <InputLabel id="categories-label">Categorias</InputLabel>
        <Select
          id="categories-input"
          label="Categorias"
          labelId="categories-label"
          multiple
          value={ selectedCategories }
          onChange={ event => {
            setValue("categories", event.target.value as never[]);
          }}
          renderValue={ selected =>
            (selected as string[])
              .map(id => categories.find(c => c.id === id)?.name)
              .join(', ')
          }
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 320,
                width: 250,
              },
            },
          }}
        >
          { categories.map(category => (
            <MenuItem key={ category.id } value={ category.id }>
              <Checkbox checked={ selectedCategories.indexOf(category.id) > -1 } />
              <ListItemText primary={ category.name } />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid container direction="row" alignItems="center">
        <Controller
          name="is_active"
          control={ control }
          render={({ field }) =>
            <Checkbox defaultChecked { ...field } />
          }
        />
        <Typography variant="body1" component="span">
          Ativo?
        </Typography>
      </Grid>
      <Box dir="rtl">
        <Button
          className={ classes.submit }
          variant='outlined'
          onClick={() => onSubmit(getValues(), null)}
        >
          Salvar
        </Button>
        <Button
          className={ classes.submit }
          variant='outlined'
          type="submit"
        >
          Salvar e continuar editando
        </Button>
      </Box>
    </form>
  );
};

export default Form;