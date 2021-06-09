import React from 'react';
import { Card, CardContent, Divider, Accordion, AccordionDetails, AccordionSummary, Grid, List, Typography, Box } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSelector } from 'react-redux';
import Page from '../../components/Page';
import UploadItem from './UploadItem';
import { Upload, UploadModule } from '../../store/uploads/types';
import { useStyles } from './styles';
import { VideoFileFieldsMap } from '../../util/models';

const Uploads: React.FC = () => {
  const classes = useStyles();

  const uploads = useSelector<UploadModule, Upload[]>(
    state => state.upload.uploads
  );

  return (
    <Page title="Uploads">
      <Box marginTop={4}>
        { uploads.map((upload, index) => (
          <Box key={ index } paddingBottom={4}>
            <Card elevation={5}>
              <CardContent>
                <UploadItem uploadOrFile={ upload }>
                  { upload.video.title }
                </UploadItem>
                <Accordion style={{ margin: 0 }}>
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon className={ classes.expandedIcon } />
                    }
                    className={ classes.panelSummary }
                  >
                    <Typography>
                      Ver detalhes
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{ padding: 0 }}>
                    <Grid item xs={12}>
                      <List dense style={{ padding: 0 }}>
                        { upload.files.map((file, index) => (
                          <React.Fragment key={ index }>
                            <Divider />
                            <UploadItem uploadOrFile={ file }>
                              { `${ VideoFileFieldsMap[file.fileField] } - ${ file.fileName }` }
                            </UploadItem>
                          </React.Fragment>
                        ))}
                      </List>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Page>
  );
};

export default Uploads;