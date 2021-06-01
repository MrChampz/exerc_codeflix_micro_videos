import React from 'react';
import { Grid, GridProps } from '@material-ui/core';
import { useStyles } from './styles';

type FormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

interface DefaultFormProps extends FormProps {
  GridContainerProps?: GridProps;
  GridItemProps?: GridProps;
}

const DefaultForm: React.FC<DefaultFormProps> = (props) => {
  const { GridContainerProps, GridItemProps, ...formProps } = props;
  const classes = useStyles();

  return (
    <form { ...formProps }>
      <Grid container { ...GridContainerProps }>
        <Grid item className={ classes.gridItem } { ...GridItemProps }>
          { props.children }
        </Grid>
      </Grid>
    </form>
  );
};

export default DefaultForm;