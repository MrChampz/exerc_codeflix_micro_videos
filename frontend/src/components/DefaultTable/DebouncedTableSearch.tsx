import React, { useEffect, useState, useCallback, memo } from 'react';
import Grow from '@material-ui/core/Grow';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { debounce } from 'lodash';

import { makeDebouncedTableSearchStyles } from './styles';

const DebouncedTableSearch = ({ options, searchText, onSearch, onHide, debounceTime }) => {
  const classes = makeDebouncedTableSearchStyles();

  const [text, setText] = useState(initialValue());

  useEffect(() => {
    if(searchText && searchText.value !== undefined) {
      const value = searchText.value;
      if (value) {
        setText(value);
        onSearch(value);
      } else {
        try {
          onHide();
        } catch (error) {}
      }
    }
  }, [searchText]);

  useEffect(() => {
    dispatchOnSearch(text);
  }, [text]);

  function initialValue(): string {
    let value = searchText;
    if(searchText && searchText.value !== undefined) {
      value = searchText.value;
    }
    return value;
  }

  const dispatchOnSearch = useCallback(debounce(value => {
    onSearch(value);
  }, debounceTime), []);

  const handleTextChange = event => {
    setText(event.target.value);
  };

  const onKeyDown = event => {
    if (event.key === 'Escape') {
      onHide();
    }
  };

  return (
    <Grow appear in={true} timeout={300}>
      <div className={classes.main}>
        <SearchIcon className={classes.searchIcon} />
        <TextField
          className={classes.searchText}
          autoFocus={true}
          InputProps={{
            'data-test-id': options.textLabels.toolbar.search,
          }}
          inputProps={{
            'aria-label': options.textLabels.toolbar.search,
          }}
          value={ text || '' }
          onKeyDown={onKeyDown}
          onChange={handleTextChange}
          fullWidth={true}
          placeholder={options.searchPlaceholder}
          {...(options.searchProps ? options.searchProps : {})}
        />
        <IconButton className={classes.clearIcon} onClick={onHide}>
          <ClearIcon />
        </IconButton>
      </div>
    </Grow>
  );
};

export default memo(DebouncedTableSearch);