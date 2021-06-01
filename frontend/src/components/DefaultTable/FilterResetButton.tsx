import React from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { makeFilterResetButtonStyles } from './styles';

interface FilterResetButtonProps {
  onClick: () => void;
}

const FilterResetButton: React.FC<FilterResetButtonProps> = ({ onClick }) => {
  const classes = makeFilterResetButtonStyles();
  return (
    <Tooltip title="Limpar busca">
      <IconButton className={ classes.iconButton } onClick={ onClick }>
        <ClearAllIcon />
      </IconButton>
    </Tooltip>
  );
};

export default FilterResetButton;