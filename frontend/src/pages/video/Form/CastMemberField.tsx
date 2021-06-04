import React from 'react';
import { Box, FormControl, FormControlProps, FormHelperText, Typography } from '@material-ui/core';
import { AsyncAutocomplete, GridSelected, GridSelectedItem } from '../../../components';
import { CastMember } from '../../../util/models';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import CastMemberResource from '../../../util/http/cast-member-resource';

interface CastMemberFieldProps {
  castMembers: CastMember[];
  setCastMembers: (castMembers: CastMember[]) => void;
  error?: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

const CastMemberField: React.FC<CastMemberFieldProps> = (props) => {
  const { castMembers, setCastMembers, error, disabled } = props;

  const autocompleteHttp = useHttpHandled();
  const { addItem, removeItem } = useCollectionManager(castMembers, setCastMembers);

  const fetchCastMembers = (searchText: string) => autocompleteHttp(
    CastMemberResource.list({
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
        fetchOptions={ fetchCastMembers }
        TextFieldProps={{
          label: "Elenco",
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
        { castMembers && castMembers.length > 0 && (
          <Box paddingTop="10px">
            <GridSelected>
              { castMembers.map((castMember, key) => (
                <GridSelectedItem
                  key={ key }
                  onDelete={() => removeItem(castMember)}
                >
                  <Typography noWrap>
                    { castMember.name }
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

export default CastMemberField;