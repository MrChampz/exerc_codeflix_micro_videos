import React, { useEffect, useState } from 'react';
import { Fade, IconButton, ListItemSecondaryAction } from '@material-ui/core';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { useDebounce } from 'use-debounce/lib';
import { Creators } from '../../store/uploads';
import { Upload } from '../../store/uploads/types';
import { hasError, isFinished } from '../../store/uploads/getters';
import { useUploadActionsStyles } from './styles';

interface UploadActionsProps {
  upload: Upload;
  hover: boolean;
}

const UploadActions: React.FC<UploadActionsProps> = ({ upload, hover }) => {
  const classes = useUploadActionsStyles();
  const dispatch = useDispatch();
  const error = hasError(upload);
  
  const [show, setShow] = useState(false);
  const [debouncedShow] = useDebounce(show, 2500);
  
  useEffect(() => {
    setShow(isFinished(upload));
  }, [upload]);
  
  return (
    debouncedShow ? (
      <Fade in={ true } timeout={{ enter: 1000 }}>
        <ListItemSecondaryAction>
          <span hidden={ hover }>
            { upload.progress === 1 && !error && (
              <IconButton className={ classes.successIcon } edge="end">
                <CheckCircleIcon />
              </IconButton>
            )}
            { error && (
              <IconButton className={ classes.errorIcon } edge="end">
                <ErrorIcon />
              </IconButton>
            )}
          </span>
          <span hidden={ !hover }>
            <IconButton
              color="primary"
              edge="end"
              onClick={() => dispatch(Creators.removeUpload({ id: upload.video.id }))}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </ListItemSecondaryAction>
      </Fade>
    ) : null
  );
};

export default UploadActions;