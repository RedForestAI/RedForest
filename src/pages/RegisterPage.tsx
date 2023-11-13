import React, { useState } from 'react';
import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Box,
  Avatar,
  Link,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore'; // Import the Zustand store

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const isValidEmail = (email: string) => {
    // Basic email validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleRegister = () => {
    setError(''); // Clear previous error messages

    // Check if email and passwords are provided
    if (!email || !password || !verifyPassword) {
      setError('Please provide an email and passwords.');
      openModal();
      return;
    }

    // Check if the passwords match
    if (password !== verifyPassword) {
      setError('Passwords do not match.');
      openModal();
      return;
    }

    // Check if the email is valid
    if (!isValidEmail(email)) {
      setError('Please provide a valid email address.');
      openModal();
      return;
    }

    // Make a POST request to your FastAPI server for register
    fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.detail);
          });
        }
        // Handle successful login here
        return response.json();
      })
      .then((data) => {
        console.log(data)
        // Update the Zustand store with the login data
        authStore.setEmail(data.email);

        // Handle successful login here
        navigate('/verify-email');
      })
      .catch((error) => {
        // Handle login failure and display an error message in the modal
        setError('Registration failed: ' + error.message)
        openModal();
        console.error(error);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="verifyPassword"
            label="Verify Password"
            type="password"
            id="verifyPassword"
            autoComplete="new-password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleRegister}
          >
            Register
          </Button>
          <Link href="/login" variant="body2">
            Already have an account? Sign In
          </Link>
        </Box>
      </Box>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isModalOpen}>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '4px',
              padding: '20px',
              maxWidth: '300px',
              margin: 'auto',
              marginTop: '100px',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" color="error">
              Error
            </Typography>
            <Typography variant="body2">{error}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={closeModal}
              style={{ marginTop: '10px' }}
            >
              Close
            </Button>
          </div>
        </Fade>
      </Modal>
    </Container>
  );
};

export default RegisterPage;
