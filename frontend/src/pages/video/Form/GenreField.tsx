import { forwardRef, MutableRefObject, RefAttributes, useImperativeHandle, useRef } from 'react';
import { Box, FormControl, FormControlProps, FormHelperText, Typography, useTheme } from '@material-ui/core';
import { AsyncAutocomplete, GridSelected, GridSelectedItem } from '../../../components';
import { Category, Genre } from '../../../util/models';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import GenreResource from '../../../util/http/genre-resource';
import { getGenresFromCategory } from '../../../util/model-filters';
import { AsyncAutocompleteComponent } from '../../../components/AsyncAutocomplete';

interface GenreFieldProps extends RefAttributes<GenreFieldComponent> {
  genres: Genre[];
  setGenres: (genres: Genre[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  error?: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

export interface GenreFieldComponent {
  clear: () => void;
}

const GenreField = forwardRef<GenreFieldComponent, GenreFieldProps>((props, ref) => {
  const { genres, setGenres, categories, setCategories, error, disabled } = props;

  const theme = useTheme();
  const autocompleteHttp = useHttpHandled();
  const autocompleteRef = useRef() as MutableRefObject<AsyncAutocompleteComponent>;
  const { addItem, removeItem } = useCollectionManager(genres, setGenres);
  const { removeItem: removeCategory } = useCollectionManager(categories, setCategories);

  useImperativeHandle(ref, () => ({
    clear: () => autocompleteRef.current.clear()
  }));

  const fetchGenres = (searchText: string) => autocompleteHttp(
    GenreResource.list({
      queryParams: {
        search: searchText,
        all: ''
      }
    })
  ).then(data => data.data)
  .catch(error => console.log(error));

  return (
    <>
      <AsyncAutocomplete
        ref={ autocompleteRef }
        fetchOptions={ fetchGenres }
        TextFieldProps={{
          label: "Gêneros",
          error: error !== undefined,
        }}
        AutocompleteProps={{
          freeSolo: true,
          autoSelect: true,
          clearOnEscape: true,
          disabled: disabled,
          getOptionLabel: option => option.name || '',
          onChange: (event, value) => addItem(value),
        }}
      />
      <FormHelperText style={{ height: theme.spacing(3) }}>
        Escolha os gêneros do vídeo
      </FormHelperText>
      <FormControl
        error={ error }
        disabled={ disabled }
        fullWidth
        { ...props.FormControlProps }
      >
        { genres && genres.length > 0 && (
          <Box paddingTop="25px" paddingBottom="10px">
            <GridSelected>
              { genres.map((genre, key) => (
                <GridSelectedItem
                  key={ key }
                  onDelete={() => {
                    const categoriesWithOneGenre = categories.filter(category => {
                      const categoryGenres = getGenresFromCategory(genres, category);
                      return categoryGenres.length === 1 && genres[0].id === genre.id;
                    });
                    categoriesWithOneGenre.forEach(category => removeCategory(category));
                    removeItem(genre);
                  }}
                >
                  <Typography noWrap>
                    { genre.name }
                  </Typography>
                </GridSelectedItem>
              ))}
            </GridSelected>
          </Box>
        )}
        <FormHelperText>{ error && error.message }</FormHelperText>
      </FormControl>
    </>
  );
});

export default GenreField;