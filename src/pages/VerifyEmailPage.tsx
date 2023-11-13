import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  CssBaseline,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
  

const VerifyEmailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const authStore = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(authStore.email)
    if (!authStore.email) {
      navigate('/');
    }
  }, [authStore.isAuth, navigate]);

  const handleResendVerification = async () => {
    setIsLoading(true);

    try {
      // Send an AJAX request to FastAPI's /mail/verify with the email parameter
      const response = await fetch(`${process.env.REACT_APP_API_URL}/mail/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: authStore.email }),
      });

      if (response.ok) {
        // Successful response (e.g., email verification sent)
        // You can handle success as needed (e.g., show a success message)
        console.log('Verification email resent successfully.');
      } else {
        // Error response
        // You can handle errors and show an error message
        console.error('Error resending verification email.');
      }
    } catch (error) {
      // Network error or other issues
      // You can handle errors and show an error message
      console.error('Error resending verification email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Email Verification
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          An email with a verification link has been sent to {authStore.email}.
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          After you verify your email, you can log in by returning to the home page.
        </Typography>
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleResendVerification}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Resend Verification Email'
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default VerifyEmailPage;
