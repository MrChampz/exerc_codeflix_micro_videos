import React from 'react';
import { Box, Button, FormControl, FormControlLabel, FormLabel, makeStyles, Radio, RadioGroup, TextField, Theme } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import CastMemberResource from '../../util/http/cast-member-resource';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1)
    }
  }
});

const Form: React.FC = () => {
  const classes = useStyles();

  const { getValues, handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      type: '1',
    }
  });

  const onSubmit = (formData, event) => {
    CastMemberResource
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
        component="fieldset"
        fullWidth
        margin="normal" 
      >
        <FormLabel component="legend">Tipo</FormLabel>
        <RadioGroup
          name="type"
          value={ watch("type") }
          onChange={ event => {
            setValue("type", (event.target as HTMLInputElement).value);
          }}
          aria-label="tipo"
          row
        >
          <FormControlLabel
            label="Ator"
            value="1"
            control={ <Radio /> }
          />
          <FormControlLabel
            label="Diretor"
            value="2"
            control={ <Radio /> }
          />
        </RadioGroup>
      </FormControl>
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