import React from 'react';
import { Box, Button, Checkbox, FormControlLabel, Grid, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import CategoryResource from '../../util/http/category-resource';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1)
    }
  }
});

const Form: React.FC = () => {
  const classes = useStyles();

  const { register, getValues, handleSubmit, control } = useForm({
    defaultValues: {
      name: '',
      description: '',
      is_active: true
    }
  });

  const onSubmit = (formData, event) => {
    CategoryResource
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
            margin="normal"
            { ...field } 
          />
        }
      />
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