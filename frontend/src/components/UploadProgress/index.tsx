import React from 'react';
import { CircularProgress, Fade } from '@material-ui/core';
import { FileUpload, Upload } from '../../store/uploads/types';
import { hasError } from '../../store/uploads/getters';
import { useStyles } from './styles';

interface UploadProgressProps {
  uploadOrFile: Upload | FileUpload;
  size: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ uploadOrFile, size }) => {
  const classes = useStyles();
  const error = hasError(uploadOrFile);
  return (
    <Fade
      in={ uploadOrFile.progress < 1 }
      timeout={{ enter: 100, exit: 2000 }}
    >
      <div className={ classes.progressContainer }>
        <CircularProgress
          value={100}
          variant="determinate"
          size={ size }
          className={ classes.progressBackground }
        />
        <CircularProgress
          value={ error ? 0 : uploadOrFile.progress * 100 }
          variant="determinate"
          size={ size }
          className={ classes.progress }
        />
      </div>
    </Fade>
  );
};

export default UploadProgress;