import React, { forwardRef, RefAttributes, useEffect, useImperativeHandle, useState } from 'react';
import { CircularProgress, TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { useDebounce } from 'use-debounce/lib';

type PartialAutocompleteProps =
  Omit<AutocompleteProps<any, any, any, any>, "options" | "renderInput">;

interface AsyncAutocompleteProps extends RefAttributes<AsyncAutocompleteComponent> {
  fetchOptions: (searchText: string) => Promise<any>;
  debounceTime?: number;
  TextFieldProps?: TextFieldProps;
  AutocompleteProps?: PartialAutocompleteProps;
}

export interface AsyncAutocompleteComponent {
  clear: () => void;
}

const AsyncAutocomplete =
  forwardRef<AsyncAutocompleteComponent, AsyncAutocompleteProps>((props, ref) => {

  const { debounceTime = 300 } = props;
  const { freeSolo, onOpen, onClose, onInputChange } = props.AutocompleteProps!;

  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, debounceTime);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const textFieldProps: TextFieldProps = {
    margin: 'normal',
    variant: 'outlined',
    fullWidth: true,
    InputLabelProps: { shrink: true },
    ...(props.TextFieldProps && { ...props.TextFieldProps })
  };

  const autocompleteProps: AutocompleteProps<any, any, any, any> = {
    loadingText: "Carregando...",
    noOptionsText: "Nenhum item encontrado",
    ...(props.AutocompleteProps && { ...props.AutocompleteProps }),
    open,
    loading,
    options,
    inputValue: searchText,
    onOpen: (event) => {
      setOpen(true);
      onOpen && onOpen(event);
    },
    onClose: (event, reason) => {
      setOpen(false);
      onClose && onClose(event, reason);
    },
    onInputChange: (event, value, reason) => {
      setSearchText(value);
      onInputChange && onInputChange(event, value, reason);
    },
    renderInput: params => (
      <TextField
        { ...params }
        { ...textFieldProps }
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              { loading &&  <CircularProgress color="inherit" size={20} /> }
              { params.InputProps.endAdornment }
            </>
          )
        }}
      />
    )
  };

  useEffect(() => {
    if (!open && !freeSolo) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open || debouncedSearchText === '' && freeSolo) return;

    let subscribed = true;
    (async () => {
      setLoading(true);
      try {
        const data = await props.fetchOptions(debouncedSearchText);
        subscribed && setOptions(data);
      } finally {
        setLoading(false);
      }
    })();
    return () => { subscribed = false; }
  }, [freeSolo ? debouncedSearchText : open]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setSearchText('');
      setOptions([]);
    }
  }));

  return (
    <Autocomplete { ...autocompleteProps } />
  );
});

export default AsyncAutocomplete;