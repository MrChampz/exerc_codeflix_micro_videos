import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormControlLabel, FormLabel, makeStyles, Radio, RadioGroup, TextField, Theme } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import CastMemberResource from '../../util/http/cast-member-resource';
import * as yup from '../../util/vendor/yup';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1)
    }
  }
});

const validationSchema = yup.object().shape({
  name:
    yup.string()
       .label("Nome")
       .max(255)
       .required(),
  type:
    yup.number()
       .label("Tipo")
       .oneOf([1, 2])
       .required()
});

const Form: React.FC = () => {
  const classes = useStyles();
  const router = useHistory();
  const { id } = useParams<{ id?: string }>();
  const { enqueueSnackbar } = useSnackbar();

  const { getValues, setValue, handleSubmit, watch, control, reset, formState: { errors }} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      type: 1,
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    CastMemberResource
      .get(id)
      .then(({ data }) => {
        reset(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = (formData, event) => {
    setLoading(true);
    const result = !id
      ?  CastMemberResource.create(formData)
      :  CastMemberResource.update(id, formData);

    result
      .then(({ data }) => {
        enqueueSnackbar("Membro de elenco salvo com sucesso", { variant: 'success' });
        setTimeout(() => {
          event ? (
            id ? router.replace(`/cast_members/${ data.data.id }/edit`)
               : router.push(`/cast_members/${ data.data.id }/edit`)
          ) : router.push('/cast_members');
        });
      })
      .catch(error => {
        console.log(error);
        enqueueSnackbar("Não foi possível salvar o membro de elenco", { variant: 'error' });
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
        component="fieldset"
        fullWidth
        margin="normal"
        disabled={ loading }
      >
        <FormLabel component="legend">Tipo</FormLabel>
        <RadioGroup
          name="type"
          value={ watch("type") }
          onChange={ event => {
            setValue("type", parseInt(event.target.value));
          }}
          aria-label="tipo"
          row
        >
          <FormControlLabel
            label="Ator"
            value={1}
            control={ <Radio color="primary" /> }
          />
          <FormControlLabel
            label="Diretor"
            value={2}
            control={ <Radio color="primary" /> }
          />
        </RadioGroup>
      </FormControl>
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