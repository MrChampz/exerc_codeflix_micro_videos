import React from 'react';
import { Box, FormControl, FormControlProps, FormHelperText, Typography } from '@material-ui/core';
import { AsyncAutocomplete, GridSelected, GridSelectedItem } from '../../../components';
import { Category, Genre } from '../../../util/models';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import GenreResource from '../../../util/http/genre-resource';
import { getGenresFromCategory } from '../../../util/model-filters';

interface GenreFieldProps {
  genres: Genre[];
  setGenres: (genres: Genre[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  error?: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

const GenreField: React.FC<GenreFieldProps> = (props) => {
  const { genres, setGenres, categories, setCategories, error, disabled } = props;

  const autocompleteHttp = useHttpHandled();
  const { addItem, removeItem } = useCollectionManager(genres, setGenres);
  const { removeItem: removeCategory } = useCollectionManager(categories, setCategories);

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
      <FormControl
        error={ error }
        disabled={ disabled }
        fullWidth
        { ...props.FormControlProps }
      >
        { genres && genres.length > 0 && (
          <Box paddingTop="10px">
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
};

export default GenreField;