import { useContext } from 'react';
import { LinearProgress, MuiThemeProvider, Fade } from '@material-ui/core';
import LoadingContext from '../LoadingProvider/LoadingContext';
import { makeSpinnerStyles } from './styles';

const Spinner = () => {
  const loading = useContext(LoadingContext);
  return (
    <MuiThemeProvider theme={ makeSpinnerStyles }>
      <Fade in={ loading }>
        <LinearProgress
          color="primary"
          style={{
            position: 'fixed',
            width: '100%',
            zIndex: 9999
          }}
        />
      </Fade>
    </MuiThemeProvider>
  );
};

export default Spinner;