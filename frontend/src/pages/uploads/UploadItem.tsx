import React, { ReactNode } from 'react';
import { Grid, ListItem, Typography } from '@material-ui/core';
import { Movie as MovieIcon, Image as ImageIcon } from '@material-ui/icons';
import { UploadProgress } from '../../components';
import UploadActions from './UploadActions';
import { FileUpload, Upload } from '../../store/uploads/types';
import { useUploadItemStyles } from './styles';
import { isUploadType } from '../../store/uploads/getters';

interface UploadItemProps {
  uploadOrFile: Upload | FileUpload;
  children: ReactNode;
}

const UploadItem: React.FC<UploadItemProps> = ({ uploadOrFile, children }) => {
  const classes = useUploadItemStyles();
  const upload = isUploadType(uploadOrFile);

  const makeIcon = () => {
    const file = uploadOrFile as any;
    if (!upload && (file.fileField === 'thumb_file' || file.fileField === 'banner_file')) {
      return (
        <ImageIcon className={ classes.icon } />
      );
    }
    return (
      <MovieIcon className={ classes.icon } />
    );
  }

  return (
    <ListItem>
      <Grid container alignItems="center">
        <Grid item xs={12} md={9} className={ classes.gridTitle }>
          { makeIcon() }
          <Typography color="inherit">
            { children }
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="flex-end"
          >
            <UploadProgress size={48} uploadOrFile={ uploadOrFile } />
            <UploadActions uploadOrFile={ uploadOrFile } />
          </Grid>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default UploadItem;