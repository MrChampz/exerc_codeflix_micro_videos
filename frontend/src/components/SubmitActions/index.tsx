import React from 'react';
import { Box, Button } from '@material-ui/core';
import classnames from 'classnames';

import { useStyles } from './styles';

interface SubmitActionsProps {
  disabled?: boolean;
  onSave: () => void;
}

const SubmitActions: React.FC<SubmitActionsProps> = (props) => {
  const classes = useStyles();

  return (
    <Box dir="ltf">
      <Button
        className={ classnames(classes.submit, classes.save) }
        variant="contained"
        color="secondary"
        onClick={ props.onSave }
        disabled={ props.disabled || false }
      >
        Salvar
      </Button>
      <Button
        className={ classes.submit }
        variant="contained"
        color="secondary"
        type="submit"
        disabled={ props.disabled || false }
      >
        Salvar e continuar editando
      </Button>
    </Box>
  );
};

export default SubmitActions;