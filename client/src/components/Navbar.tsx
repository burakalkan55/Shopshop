import { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  Box,
  useTheme
} from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'

const Navbar = () => {
  const theme = useTheme()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navbarStyles = {
    appBar: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: theme.palette.text.primary,
      '& svg': {
        fontSize: '2rem',
        color: theme.palette.primary.main,
      },
    },
    button: {
      borderRadius: '12px',
      textTransform: 'none',
      padding: '8px 16px',
      margin: '0 5px',
      fontSize: '0.95rem',
      fontWeight: 500,
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(25, 118, 210, 0.08)',
        transform: 'translateY(-2px)',
      },
    },
    drawerItem: {
      margin: '8px 16px',
      borderRadius: '12px',
      padding: '12px 20px',
      fontSize: '1rem',
      fontWeight: 500,
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(25, 118, 210, 0.08)',
        transform: 'translateX(5px)',
      },
    },
  }

  const toggleDrawer = (open: boolean) => setOpenDrawer(open)

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/login')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [location]) // Sayfa değişince token kontrol et

  const renderAuthenticatedMenu = () => (
    <>
      <Button sx={navbarStyles.button} color="primary" component={Link} to="/">
        Ana Sayfa
      </Button>
      <Button sx={navbarStyles.button} color="primary" component={Link} to="/profile">
        Profil
      </Button>

      <Button sx={navbarStyles.button} color="primary" component={Link} to="/products">
        Ürünler
      </Button>
      <Button sx={navbarStyles.button} color="primary" component={Link} to="/cart">
        Sepet
      </Button>
      
      <Button
        sx={{
          ...navbarStyles.button,
          background: theme.palette.primary.main,
          color: 'white',
          '&:hover': {
            background: theme.palette.primary.dark,
            transform: 'translateY(-2px)',
          },
        }}
        onClick={handleLogout}
      >
        Çıkış Yap
      </Button>
    </>
  )

  const renderUnauthenticatedMenu = () => (
    <>
      <Button sx={navbarStyles.button} color="primary" component={Link} to="/login">
        Giriş Yap
      </Button>
      <Button
        sx={{
          ...navbarStyles.button,
          background: theme.palette.primary.main,
          color: 'white',
          '&:hover': {
            background: theme.palette.primary.dark,
            transform: 'translateY(-2px)',
          },
        }}
        component={Link}
        to="/register"
      >
        Kayıt Ol
      </Button>
    </>
  )

  const renderAuthenticatedDrawer = () => (
    <>
      <ListItem button component={Link} to="/" onClick={() => toggleDrawer(false)} sx={navbarStyles.drawerItem}>
        Ana Sayfa
      </ListItem>
      <ListItem button component={Link} to="/profile" onClick={() => toggleDrawer(false)} sx={navbarStyles.drawerItem}>
        Profil
      </ListItem>
      <ListItem button component={Link} to="/products" onClick={() => toggleDrawer(false)} sx={navbarStyles.drawerItem}>
        Products
      </ListItem>

      <ListItem button component={Link} to="/cart" onClick={() => toggleDrawer(false)} sx={navbarStyles.drawerItem}>
        Cart
      </ListItem>
      <ListItem button onClick={() => { handleLogout(); toggleDrawer(false); }} sx={navbarStyles.drawerItem}>
        Çıkış Yap
      </ListItem>
      
    </>
  )

  const renderUnauthenticatedDrawer = () => (
    <>
      <ListItem button component={Link} to="/login" onClick={() => toggleDrawer(false)} sx={navbarStyles.drawerItem}>
        Giriş Yap
      </ListItem>
      <ListItem button component={Link} to="/register" onClick={() => toggleDrawer(false)} sx={navbarStyles.drawerItem}>
        Kayıt Ol
      </ListItem>
    </>
  )

  return (
    <>
      <AppBar position="fixed" sx={navbarStyles.appBar}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          <Box component={Link} to="/" sx={{ ...navbarStyles.logo, textDecoration: 'none' }}>
            <ShoppingBagIcon />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              ShopShop
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            {isAuthenticated ? renderAuthenticatedMenu() : renderUnauthenticatedMenu()}
          </Box>

          <IconButton
            color="primary"
            aria-label="open drawer"
            onClick={() => toggleDrawer(true)}
            sx={{
              display: { xs: 'block', sm: 'none' },
              background: 'rgba(25, 118, 210, 0.08)',
              '&:hover': {
                background: 'rgba(25, 118, 210, 0.15)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            width: 280,
            borderLeft: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '-8px 0 32px 0 rgba(31, 38, 135, 0.15)',
          }
        }}
      >
        <List>
          {isAuthenticated ? renderAuthenticatedDrawer() : renderUnauthenticatedDrawer()}
        </List>
      </Drawer>
      <Toolbar />
    </>
  )
}

export default Navbar
