import React, { forwardRef, MutableRefObject, RefAttributes, useImperativeHandle, useRef } from 'react';
import { Box, FormControl, FormControlProps, FormHelperText, Typography } from '@material-ui/core';
import { AsyncAutocomplete, GridSelected, GridSelectedItem } from '../../../components';
import { AsyncAutocompleteComponent } from '../../../components/AsyncAutocomplete';
import { CastMember } from '../../../util/models';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import CastMemberResource from '../../../util/http/cast-member-resource';

interface CastMemberFieldProps extends RefAttributes<CastMemberFieldComponent> {
  castMembers: CastMember[];
  setCastMembers: (castMembers: CastMember[]) => void;
  error?: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

export interface CastMemberFieldComponent {
  clear: () => void;
}

const CastMemberField =
  forwardRef<CastMemberFieldComponent, CastMemberFieldProps>((props, ref) => {
    
  const { castMembers, setCastMembers, error, disabled } = props;

  const autocompleteHttp = useHttpHandled();
  const autocompleteRef = useRef() as MutableRefObject<AsyncAutocompleteComponent>;
  const { addItem, removeItem } = useCollectionManager(castMembers, setCastMembers);

  useImperativeHandle(ref, () => ({
    clear: () => autocompleteRef.current.clear()
  }));

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
        ref={ autocompleteRef }
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
});

export default CastMemberField;