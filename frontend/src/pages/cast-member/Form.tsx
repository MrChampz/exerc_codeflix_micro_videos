import React, { useContext, useEffect, useState } from 'react';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from '../../util/vendor/yup';
import { Response, CastMember } from '../../util/models';
import CastMemberResource from '../../util/http/cast-member-resource';
import { DefaultForm, SubmitActions } from '../../components';
import LoadingContext from '../../components/LoadingProvider/LoadingContext';

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
      type: 1,
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
        const { data } = await CastMemberResource.get<Response<CastMember>>(id);
        reset(data.data);
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Não foi possível carregar as informações", { variant: 'error' });
      }
    })();
  }, []);

  const onSubmit = async (formData, event) => {
    try {
      const promise = !id
        ?  CastMemberResource.create<Response<CastMember>>(formData)
        :  CastMemberResource.update<Response<CastMember>>(id, formData);

      const { data } = await promise;
        
      enqueueSnackbar("Membro de elenco salvo com sucesso", { variant: 'success' });
      setTimeout(() => {
        event ? (
          id ? router.replace(`/cast_members/${ data.data.id }/edit`)
             : router.push(`/cast_members/${ data.data.id }/edit`)
        ) : router.push('/cast_members');
      });
    } catch(error) {
      console.log(error);
      enqueueSnackbar("Não foi possível salvar o membro de elenco", { variant: 'error' });
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
        component="fieldset"
        fullWidth
        margin="normal"
        error={ errors.type !== undefined }
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
        <FormHelperText>{ errors.type && errors.type.message }</FormHelperText>
      </FormControl>
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