import React from 'react'
import { Box, Container, Typography } from '@material-ui/core';
import { useStyles } from './styles';

type PageProps = {
  title: string
};

const Page: React.FC<PageProps> = (props) => {
  const classes = useStyles();
  return (
    <Container>
      <Box marginTop={2}>
        <Typography component="h1" variant="h5" className={ classes.title }>
          { props.title }
        </Typography>
      </Box>
      { props.children }
    </Container>
  );
}

export default Page
