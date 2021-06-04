import React from 'react';
import { Grid, GridProps, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

interface GridSelectedItemProps extends GridProps {
  onDelete: () => void;
}

const GridSelectedItem: React.FC<GridSelectedItemProps> = (props) => {
  const { onDelete, children, ...gridProps } = props;
  return (
    <Grid item { ...gridProps }>
      <Grid container alignItems="center" spacing={5}>
        <Grid item xs={1}>
          <IconButton
            size="small"
            color="inherit"
            onClick={ onDelete }
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
        <Grid item xs={8}>
          { children }
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GridSelectedItem;