import React, { useState } from 'react';
import { Divider, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@material-ui/core';
import MovieIcon from '@material-ui/icons/Movie';
import UploadActions from './UploadActions';
import { UploadProgress } from '..';
import { Upload } from '../../store/uploads/types';
import { hasError } from '../../store/uploads/getters';
import { useUploadItemStyles } from './styles';

interface UploadItemProps {
  upload: Upload;
}

const UploadItem: React.FC<UploadItemProps> = ({ upload }) => {
  const classes = useUploadItemStyles();
  const error = hasError(upload);

  const [itemHover, setItemHover] = useState(false);

  return (
    <>
      <Tooltip
        title={ error ? "Não foi possível fazer o upload, clique para mais detalhes" : "" }
        placement="left"
        disableFocusListener
        disableTouchListener
      >
        <ListItem
          button
          onMouseOver={() => setItemHover(true)}
          onMouseLeave={() => setItemHover(false)}
          className={ classes.listItem }
        >
          <ListItemIcon className={ classes.movieIcon }>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText
            className={ classes.listItemText }
            primary={
              <Typography variant="subtitle2" color="inherit" noWrap>
                { upload.video.title }
              </Typography>
            }
          />
          <UploadProgress size={24} uploadOrFile={ upload } />
          <UploadActions upload={ upload } hover={ itemHover } />
        </ListItem>
      </Tooltip>
      <Divider component="li" />
    </>
  );
};

export default UploadItem;