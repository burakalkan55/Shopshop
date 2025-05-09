import { useEffect, useState } from 'react';
import {
  Box, Grid, Paper, Typography, Avatar, Button,
  Stack, Divider, useTheme
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    api.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }
  };

  if (!user) {
    return <Typography align="center">You must be logged in!</Typography>;
  }

  return (
    <Box sx={{ py: 6, px: 3, background: '#f5f8ff', minHeight: '100vh' }}>
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          maxWidth: 900,
          mx: 'auto',
          p: { xs: 3, sm: 5 },
          backgroundColor: '#ffffff',
          boxShadow: '0px 8px 30px rgba(0,0,0,0.05)',
        }}
      >
        <Grid container spacing={4}>
          {/* Left Side – Avatar & Info */}
          <Grid item xs={12} md={4}>
            <Stack alignItems="center" spacing={2}>
              <Avatar
                src={user.image ? `http://localhost:3000${user.image}` : undefined}
                sx={{
                  width: 120,
                  height: 120,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                }}
              >
                {!user.image && <PersonIcon sx={{ fontSize: 60 }} />}
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Stack>
          </Grid>

          {/* Right Side – Actions */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight={700}>
                Welcome back 👋
              </Typography>
              <Divider sx={{ mb: 1 }} />

              <Button
                component={Link}
                to="/orders"
                variant="outlined"
                color="primary"
                startIcon={<ReceiptLongIcon />}
                fullWidth
                sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
              >
                My Orders
              </Button>

              <Button
                component={Link}
                to="/fav"
                variant="outlined"
                color="error"
                startIcon={<FavoriteIcon />}
                fullWidth
                sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
              >
                My Favorites
              </Button>

              <Button
                component={Link}
                to="/usermanagement"
                variant="outlined"
                color="secondary"
                startIcon={<PersonIcon />}
                fullWidth
                sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
              >
                Manage Profile
              </Button>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                fullWidth
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                  backgroundColor: theme.palette.error.main,
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: theme.palette.error.dark,
                  }
                }}
              >
                Log Out
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
