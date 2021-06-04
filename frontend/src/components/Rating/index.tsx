import React from 'react';
import { Typography } from '@material-ui/core';
import { useStyles } from './styles';

const backgroundColors = {
  'L':  '#39B549',
  '10': '#20A3D4',
  '12': '#E79738',
  '14': '#E35E00',
  '16': '#D00003',
  '18': '#000000'
};

interface RatingProps {
  rating: 'L' | '10' | '12' | '14' | '16' | '18';
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const classes = useStyles();
  return (
    <Typography
      className={ classes.root }
      style={{
        backgroundColor: backgroundColors[rating]
      }}
    >
      { rating }
    </Typography>
  );
};

export default Rating;