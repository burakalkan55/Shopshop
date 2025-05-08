import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, Box, Grid } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate("/profile")
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h4" sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>Hoş Geldiniz!</Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
            Alışveriş yapmaya başlayın.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ marginTop: 2 }}
            onClick={handleStart}
          >
            Başla
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home