import React, { useEffect, useState } from 'react';
import { Card, CardContent, Checkbox, FormControlLabel, FormHelperText, Grid, TextField, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from '../../../util/vendor/yup';
import {  Category, Response, Video, VideoFileFieldsMap } from '../../../util/models';
import { DefaultForm, SubmitActions } from '../../../components';
import VideoResource from '../../../util/http/video-resource';
import RatingField from './RatingField';
import UploadField from './UploadField';
import GenreField from './GenreField';
import CategoryField from './CategoryField';
import CastMemberField from './CastMemberField';
import { useStyles } from './styles';

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .label("Título")
    .max(255)
    .required(),
  description: yup
    .string()
    .label("Sinopse")
    .required(),
  year_launched: yup
    .number()
    .label("Ano de lançamento")
    .min(1)
    .required(),
  duration: yup
    .number()
    .label("Duração")
    .min(1)
    .required(),
  cast_members: yup
    .array()
    .label("Membros do elenco")
    .min(1)
    .required(),
  genres: yup
    .array()
    .label("Gêneros")
    .min(1)
    .required()
    .test({
      message: "Um ou mais gêneros não tem categoria atrelada",
      test: (genres, context) => {
        const categoriesIds = context.parent.categories.map(({ id }) => id);
        const hasUnpairedGenres = genres?.every(genre =>
          genre.categories
               .filter(category => categoriesIds.includes(category.id))
               .length !== 0
        );
        return Boolean(hasUnpairedGenres);
      }
    }),
  categories: yup
    .array()
    .label("Categorias")
    .min(1)
    .required(),
  rating: yup
    .string()
    .label("Classificação")
    .required(),
});

const uploadFields = Object.keys(VideoFileFieldsMap);

const Form: React.FC = () => {
  const {
    register,
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
  });

  const classes = useStyles();
  const router = useHistory();
  const { id } = useParams<{ id?: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isGreaterThanMd = useMediaQuery(theme.breakpoints.up('md'));

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    uploadFields.forEach(field => {
      register(field, { setValueAs: value => value as File });
    });
  }, [register]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const { data } = await VideoResource.get<Response<Video>>(id);
        reset(data.data);
      } catch(error) {
        console.error(error);
        enqueueSnackbar("Não foi possível carregar as informações", { variant: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (formData, event) => {
    formData.cast_members = formData.cast_members.map(castMember => castMember.id);
    formData.genres = formData.genres.map(genre => genre.id);
    formData.categories = formData.categories.map(category => category.id);

    const sendData = new FormData();
    Object.keys(formData).forEach(key => {
      let value = formData[key];

      if (typeof value === "undefined") {
        return;
      }
      if (typeof value === "boolean") {
        value = value ? 1 : 0;
      }
      if (value instanceof Array) {
        value.forEach(item => sendData.append(`${key}[]`, item));
        return;
      }
      sendData.append(key, value);
    });

    if (id) {
      sendData.append('_method','PUT');
    }

    setLoading(true);
    try {
      const promise = !id
        ?  VideoResource.create<Response<Video>>(sendData)
        :  VideoResource.update<Response<Video>>(id, sendData);

      const { data } = await promise;
  
      enqueueSnackbar("Vídeo salvo com sucesso", { variant: 'success' });
      setTimeout(() => {
        event ? (
          id ? router.replace(`/videos/${ data.data.id }/edit`)
             : router.push(`/videos/${ data.data.id }/edit`)
        ) : router.push('/videos');
      });
    } catch(error) {
      console.log(error);
      enqueueSnackbar("Não foi possível salvar o vídeo", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <DefaultForm
      GridItemProps={{ xs: 12 }}
      onSubmit={ handleSubmit(onSubmit) }
    >
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <Controller
            name="title"
            control={ control }
            render={({ field }) =>
              <TextField
                label="Título"
                fullWidth
                variant="outlined"
                error={ errors.title !== undefined }
                helperText={ errors.title && errors.title.message }
                disabled={ loading }
                InputLabelProps={{
                  shrink: Boolean(id)
                }}
                { ...field } 
              />
            }
          />
          <Controller
            name="description"
            control={ control }
            render={({ field }) =>
              <TextField
                label="Sinopse"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                error={ errors.description !== undefined }
                helperText={ errors.description && errors.description.message }
                disabled={ loading }
                InputLabelProps={{
                  shrink: Boolean(id)
                }}
                margin="normal"
                { ...field } 
              />
            }
          />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Controller
                name="year_launched"
                control={ control }
                render={({ field }) =>
                  <TextField
                    label="Ano de lançamento"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={ errors.year_launched !== undefined }
                    helperText={ errors.year_launched && errors.year_launched.message }
                    disabled={ loading }
                    InputLabelProps={{
                      shrink: Boolean(id)
                    }}
                    margin="normal"
                    { ...field } 
                  />
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="duration"
                control={ control }
                render={({ field }) =>
                  <TextField
                    label="Duração"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={ errors.duration !== undefined }
                    helperText={ errors.duration && errors.duration.message }
                    disabled={ loading }
                    InputLabelProps={{
                      shrink: Boolean(id)
                    }}
                    margin="normal"
                    { ...field } 
                  />
                }
              />
            </Grid>
            <Grid item xs>
              <Controller
                name="cast_members"
                defaultValue={[]}
                control={ control }
                render={({ field }) =>
                  <CastMemberField
                    castMembers={ field.value }
                    setCastMembers={ castMembers => {
                      setValue('cast_members', castMembers, { shouldValidate: true });
                    }}
                    error={ errors.cast_members }
                    disabled={ loading }
                  />
                }
              />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="genres"
                    defaultValue={[]}
                    control={ control }
                    render={({ field }) =>
                      <GenreField
                        genres={ field.value }
                        setGenres={ genres => {
                          setValue('genres', genres, { shouldValidate: true });
                        }}
                        categories={ watch('categories') }
                        setCategories={ categories => {
                          setValue('categories', categories, { shouldValidate: true });
                        }}
                        error={ errors.genres }
                        disabled={ loading }
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="categories"
                    defaultValue={[]}
                    control={ control }
                    render={({ field }) => 
                      <CategoryField
                        categories={ field.value }
                        setCategories={ categories => {
                          setValue('categories', categories, { shouldValidate: true });
                        }}
                        genres={ watch('genres') }
                        error={ errors.categories }
                        disabled={ loading }
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormHelperText>
                    Escolha os gêneros do vídeo
                  </FormHelperText>
                  <FormHelperText>
                    Escolha pelo menos uma categoria de cada gênero
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="rating"
            defaultValue={ null }
            control={ control }
            render={({ field }) =>
              <RatingField
                value={ field.value }
                setValue={(value) => setValue('rating', value)}
                error={ errors.rating }
                disabled={ loading }
                FormControlProps={{
                  margin: isGreaterThanMd ? 'none' : 'normal',
                }}
              />
            }
          />
          <br/>
          <Card className={ classes.uploadCard }>
            <CardContent>
              <Typography variant="h6" color="primary">
                Imagens
              </Typography>
              <UploadField
                label="Thumb"
                accept="image/*"
                setValue={ value => setValue('thumb_file', value) }
              />
              <UploadField
                label="Banner"
                accept="image/*"
                setValue={ value => setValue('banner_file', value) }
              />
            </CardContent>
          </Card>
          <Card className={ classes.uploadCard }>
            <CardContent>
              <Typography variant="h6" color="primary">
                Vídeos
              </Typography>
              <UploadField
                label="Trailer"
                accept="video/mp4"
                setValue={ value => setValue('trailer_file', value) }
              />
              <UploadField
                label="Principal"
                accept="video/mp4"
                setValue={ value => setValue('video_file', value) }
              />
            </CardContent>
          </Card>
          <br/>
          <Card className={ classes.openedCard }>
            <CardContent className={ classes.openedCardContent }>
              <Controller
                name="opened"
                defaultValue={ false }
                control={ control }
                render={({ field }) =>
                  <FormControlLabel
                    label={
                      <Typography variant="subtitle2" color="primary">
                        Quero que este conteúdo apareça na seção lançamentos
                      </Typography>
                    }
                    labelPlacement="end"
                    disabled={ loading }
                    control={
                      <Checkbox
                        color="primary"
                        checked={ field.value }
                        { ...field }
                      />
                    }
                  />
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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