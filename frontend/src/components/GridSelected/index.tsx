import React from 'react';
import { Grid, GridProps } from '@material-ui/core';
import { useStyles } from './styles';

type GridSelectedProps = GridProps;

const GridSelected: React.FC<GridSelectedProps> = (props) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      wrap="wrap"
      className={ classes.root }
      { ...props }
    >
      { props.children }
    </Grid>
  );
};

export default GridSelected;