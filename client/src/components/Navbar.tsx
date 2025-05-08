import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Alışveriş Uygulaması
        </Typography>
        <Button color="inherit" component={Link} to="/">Ana Sayfa</Button>
        <Button color="inherit" component={Link} to="/profile">Profil</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
