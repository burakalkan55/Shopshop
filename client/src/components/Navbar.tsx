import { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, Box } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const toggleDrawer = (open: boolean) => {
    setOpenDrawer(open)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/login')
  }

  const renderAuthenticatedMenu = () => (
    <>
      <Button color="inherit" component={Link} to="/">Ana Sayfa</Button>
      <Button color="inherit" component={Link} to="/profile">Profil</Button>
      <Button color="inherit" onClick={handleLogout}>Çıkış Yap</Button>
    </>
  )

  const renderUnauthenticatedMenu = () => (
    <>
      <Button color="inherit" component={Link} to="/login">Giriş Yap</Button>
      <Button color="inherit" component={Link} to="/register">Kayıt Ol</Button>
    </>
  )

  const renderAuthenticatedDrawer = () => (
    <>
      <ListItem button component={Link} to="/" onClick={() => toggleDrawer(false)} 
        sx={{ padding: '10px 15px', fontSize: '1.2rem', color: '#1976d2', '&:hover': { backgroundColor: '#f5f5f5' } }}>
        Ana Sayfa
      </ListItem>
      <ListItem button component={Link} to="/profile" onClick={() => toggleDrawer(false)}
        sx={{ padding: '10px 15px', fontSize: '1.2rem', color: '#1976d2', '&:hover': { backgroundColor: '#f5f5f5' } }}>
        Profil
      </ListItem>
      <ListItem button onClick={() => { handleLogout(); toggleDrawer(false); }}
        sx={{ padding: '10px 15px', fontSize: '1.2rem', color: '#1976d2', '&:hover': { backgroundColor: '#f5f5f5' } }}>
        Çıkış Yap
      </ListItem>
    </>
  )

  const renderUnauthenticatedDrawer = () => (
    <>
      <ListItem button component={Link} to="/login" onClick={() => toggleDrawer(false)}
        sx={{ padding: '10px 15px', fontSize: '1.2rem', color: '#1976d2', '&:hover': { backgroundColor: '#f5f5f5' } }}>
        Giriş Yap
      </ListItem>
      <ListItem button component={Link} to="/register" onClick={() => toggleDrawer(false)}
        sx={{ padding: '10px 15px', fontSize: '1.2rem', color: '#1976d2', '&:hover': { backgroundColor: '#f5f5f5' } }}>
        Kayıt Ol
      </ListItem>
    </>
  )

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Alışveriş Uygulaması
          </Typography>

          <IconButton 
            color="inherit" 
            aria-label="open drawer" 
            onClick={() => toggleDrawer(true)}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {isAuthenticated ? renderAuthenticatedMenu() : renderUnauthenticatedMenu()}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
      >
        <List sx={{ width: 250 }}>
          {isAuthenticated ? renderAuthenticatedDrawer() : renderUnauthenticatedDrawer()}
        </List>
      </Drawer>
    </>
  )
}

export default Navbar
