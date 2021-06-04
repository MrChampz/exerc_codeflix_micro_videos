import React from 'react';
import { Box, FormControl, FormControlProps, FormHelperText, Typography } from '@material-ui/core';
import { AsyncAutocomplete, GridSelected, GridSelectedItem } from '../../../components';
import { Category, Genre } from '../../../util/models';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import CategoryResource from '../../../util/http/category-resource';
import { getGenresFromCategory } from '../../../util/model-filters';
import { useCategoryFieldStyles } from './styles';

interface CategoryFieldProps {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  genres: Genre[];
  error?: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

const CategoryField: React.FC<CategoryFieldProps> = (props) => {
  const{ categories, setCategories, genres, error, disabled } = props;
  
  const classes = useCategoryFieldStyles();
  const autocompleteHttp = useHttpHandled();
  const { addItem, removeItem } = useCollectionManager(categories, setCategories);

  const fetchCategories = () => autocompleteHttp(
    CategoryResource.list({
      queryParams: {
        genres: genres.map(genre => genre.id).join(','),
        all: ''
      }
    })
  ).then(data => data.data)
  .catch(error => console.log(error));

  return (
    <>
      <AsyncAutocomplete
        fetchOptions={ fetchCategories }
        TextFieldProps={{
          label: "Categorias",
          error: error !== undefined,
        }}
        AutocompleteProps={{
          autoSelect: true,
          clearOnEscape: true,
          disabled: disabled || (genres && !genres.length),
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
        { categories && categories.length > 0 && (
          <Box paddingTop="10px">
            <GridSelected>
              { categories.map((category, key) => {
                const categoryGenres = getGenresFromCategory(genres, category)
                  .map(genre => genre.name).join(', ');
                return (
                  <GridSelectedItem
                    key={ key }
                    onDelete={() => removeItem(category)}
                  >
                    <Typography noWrap>
                      { category.name }
                    </Typography>
                    <Typography noWrap className={ classes.genresSubtitle }>
                      Gêneros: { categoryGenres }
                    </Typography>
                  </GridSelectedItem>
                );
              })}
            </GridSelected>
          </Box>
        )}
        <FormHelperText>{ error && error.message }</FormHelperText>
      </FormControl>
    </>
  );
};

export default CategoryField;