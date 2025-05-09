import { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('All fields are required!');
      return;
    }

    try {
      const response = await api.post('/auth/register', { name, email, password });

      setSnackbarMessage('Registration successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      setTimeout(() => {
        setOpenSnackbar(false);
        navigate('/profile');
      }, 2000);
    } catch (err: any) {
      setSnackbarMessage(err.response?.data?.error || 'Registration failed');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      <Typography variant="h5" sx={{ fontSize: { xs: '1.8rem', sm: '2rem' } }}>
        Create Account
      </Typography>

      {error && <Typography color="error" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" variant="contained" fullWidth>
          Register
        </Button>
      </form>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </Typography>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
