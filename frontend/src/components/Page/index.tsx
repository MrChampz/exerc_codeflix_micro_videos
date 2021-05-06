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
      <Typography component="h1" variant="h5" className={ classes.title }>
        { props.title }
      </Typography>
      <Box paddingTop={1}>
        { props.children }
      </Box>
    </Container>
  );
}

export default Page
