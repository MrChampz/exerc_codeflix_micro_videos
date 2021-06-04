import React from 'react';
import { Box, FormControl, FormControlLabel, FormControlProps, FormHelperText, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import Rating from '../../../components/Rating';

const ratings: any[] = ["L", "10", "12", "14", "16", "18"];

interface RatingFieldProps {
  value: string;
  setValue: (value: string) => void;
  error?: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

const RatingField: React.FC<RatingFieldProps> = (props) => {
  const { value, setValue, error, disabled, FormControlProps } = props;
  return (
    <FormControl
      error={ error !== undefined }
      disabled={ disabled }
      { ...FormControlProps }
    >
      <FormLabel component="legend">Classificação</FormLabel>
      <Box paddingTop={2}>
        <RadioGroup
          name="rating"
          value={ value }
          onChange={ event => {
            setValue(event.target.value);
          }}
          row
          aria-roledescription="radio"
        >
          { ratings.map((rating, key) => (
            <FormControlLabel
              key={ key }
              value={ rating }
              label={
                <Rating rating={ rating } />
              }
              labelPlacement="top"
              control={
                <Radio color="primary" />
              }
            />
          ))}
        </RadioGroup>
      </Box>
      <FormHelperText>{ error && error.message }</FormHelperText>
    </FormControl>
  );
};

export default RatingField;