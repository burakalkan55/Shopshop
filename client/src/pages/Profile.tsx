import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Avatar, Button, Stack, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');

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

  if (!user) return <Typography align="center">You must be logged in!</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={user.image ? `http://localhost:3000${user.image}` : undefined}
                sx={{ width: 100, height: 100, mb: 2 }}
              >
                {!user.image && <PersonIcon sx={{ fontSize: 60 }} />}
              </Avatar>

              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Profile Page
              </Typography>
              <Divider />
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/orders"
                startIcon={<ReceiptLongIcon />}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'start',
                  width: '100%',
                  px: 2
                }}
              >
                My Orders
              </Button>

              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/usermanagement"
                startIcon={<PersonIcon />}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'start',
                  width: '100%',
                  px: 2
                }}
              >
                User Management
              </Button>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'start',
                  width: '100%',
                  px: 2
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
