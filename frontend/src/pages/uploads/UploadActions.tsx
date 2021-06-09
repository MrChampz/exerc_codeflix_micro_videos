import React, { useEffect, useState } from 'react';
import { Divider, Fade, IconButton } from '@material-ui/core';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon, Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useDebounce } from 'use-debounce/lib';
import { Creators } from '../../store/uploads';
import { FileUpload, Upload } from '../../store/uploads/types';
import { hasError, isFinished, isUploadType } from '../../store/uploads/getters';
import { useUploadActionsStyles } from './styles';

interface UploadActionsProps {
  uploadOrFile: Upload | FileUpload;
}

const UploadActions: React.FC<UploadActionsProps> = ({ uploadOrFile }) => {
  const classes = useUploadActionsStyles();
  const dispatch = useDispatch();
  const error = hasError(uploadOrFile);
  const upload = uploadOrFile as any;
  const showActions = isUploadType(uploadOrFile);

  const [show, setShow] = useState(false);
  const [debouncedShow] = useDebounce(show, 2500);

  useEffect(() => {
    setShow(isFinished(uploadOrFile));
  }, [uploadOrFile]);

  return (
    debouncedShow ? (
      <Fade in={ true } timeout={{ enter: 1000 }}>
        <>
          { uploadOrFile.progress === 1 && !error && (
            <CheckCircleIcon className={ classes.successIcon } />
          )}
          { error && (
            <ErrorIcon className={ classes.errorIcon } />
          )}
          { showActions && (
            <>
              <Divider orientation="vertical" className={ classes.divider } />
              <IconButton onClick={() => dispatch(Creators.removeUpload({ id: upload!.video!.id }))}>
                <DeleteIcon color="primary" />
              </IconButton>
              <IconButton component={ Link } to={ `/videos/${ upload!.video!.id }/edit` }>
                <EditIcon color="primary" />
              </IconButton>
            </>
          )}
        </>
      </Fade>
    ) : null
  );
};

export default UploadActions;