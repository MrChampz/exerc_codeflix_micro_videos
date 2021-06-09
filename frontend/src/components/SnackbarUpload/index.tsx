import { forwardRef, useState } from 'react';
import { Card, CardActions, Collapse, IconButton, List, Typography } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, Close as CloseIcon } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import classnames from 'classnames';
import { useStyles } from './styles';
import UploadItem from './UploadItem';
import { Upload, UploadModule } from '../../store/uploads/types';
import { countInProgress } from '../../store/uploads/getters';

interface SnackbarUploadProps {
  id: string | number;
}

const SnackbarUpload = forwardRef<any, SnackbarUploadProps>((props, ref) => {
  const { id } = props;

  const classes = useStyles();
  const { closeSnackbar } = useSnackbar();

  const [expanded, setExpanded] = useState(true);

  const uploads = useSelector<UploadModule, Upload[]>(
    state => state.upload.uploads
  );

  const totalInProgress = countInProgress(uploads);

  return (
    <Card ref={ ref } className={ classes.card }>
      <CardActions classes={{ root: classes.cardActionsRoot }}>
        <Typography variant="subtitle2" className={ classes.title }>
          { totalInProgress <= 0 
              ? ""
              : totalInProgress === 1
                ? "Fazendo upload de 1 vídeo"
                : `Fazendo upload de ${ totalInProgress } vídeos`
          }
        </Typography>
        <div className={ classes.icons }>
          <IconButton
            color="inherit"
            onClick={() => setExpanded(!expanded)}
            className={ classnames(classes.expand, { [classes.expandOpen]: expanded })}
          >
            <ExpandMoreIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => closeSnackbar(id)}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </CardActions>
      <Collapse in={ expanded }>
        <List className={ classes.list }>
          { uploads.map((upload, index) => (
              <UploadItem key={ index } upload={ upload } />
          ))}
        </List>
      </Collapse>
    </Card>
  );
});

export default SnackbarUpload;