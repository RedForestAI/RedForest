
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

const NotFoundPage = () => {
  return (
    <div>
      <ResponsiveAppBar />
      <Container maxWidth="md" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          Sorry, the page you are looking for doesn't exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          style={{ marginTop: '1rem' }}
        >
          Go to Home
        </Button>
      </Container>
    </div>
  );
};

export default NotFoundPage;
