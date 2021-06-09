import { forwardRef, MutableRefObject, RefAttributes, useImperativeHandle, useRef } from 'react';
import { Box, FormControl, FormControlProps, FormHelperText, Typography, useTheme } from '@material-ui/core';
import { AsyncAutocomplete, GridSelected, GridSelectedItem } from '../../../components';
import { Category, Genre } from '../../../util/models';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import CategoryResource from '../../../util/http/category-resource';
import { getGenresFromCategory } from '../../../util/model-filters';
import { useCategoryFieldStyles } from './styles';
import { AsyncAutocompleteComponent } from '../../../components/AsyncAutocomplete';

interface CategoryFieldProps extends RefAttributes<CategoryFieldComponent> {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  genres: Genre[];
  error?: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

export interface CategoryFieldComponent {
  clear: () => void;
}

const CategoryField =
  forwardRef<CategoryFieldComponent, CategoryFieldProps>((props, ref) => {

  const{ categories, setCategories, genres, error, disabled } = props;
  
  const classes = useCategoryFieldStyles();
  const theme = useTheme();
  const autocompleteHttp = useHttpHandled();
  const autocompleteRef = useRef() as MutableRefObject<AsyncAutocompleteComponent>;
  const { addItem, removeItem } = useCollectionManager(categories, setCategories);

  useImperativeHandle(ref, () => ({
    clear: () => autocompleteRef.current.clear()
  }));

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
        ref={ autocompleteRef }
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
      <FormHelperText style={{ height: theme.spacing(3) }}>
        Escolha pelo menos uma categoria de cada gênero
      </FormHelperText>
      <FormControl
        error={ error }
        disabled={ disabled }
        fullWidth
        { ...props.FormControlProps }
      >
        { categories && categories.length > 0 && (
          <Box paddingTop="25px" paddingBottom="10px">
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
});

export default CategoryField;