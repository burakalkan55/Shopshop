import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  const baseButtonStyle = {
    borderRadius: '12px',
    textTransform: 'none',
    padding: '8px 16px',
    margin: '0 5px',
    fontSize: '0.95rem',
    fontWeight: 500,
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const renderLinks = () => {
    const links = isAuthenticated
      ? [
          { label: 'Home', path: '/' },
          { label: 'Profile', path: '/profile' },
          { label: 'Products', path: '/products' },
          { label: 'Cart', path: '/cart' },
        ]
      : [
          { label: 'Login', path: '/login' },
          { label: 'Register', path: '/register' },
        ];

    return links.map((link) => (
      <Button
        key={link.path}
        component={Link}
        to={link.path}
        sx={{
          ...baseButtonStyle,
          color: isActive(link.path) ? theme.palette.primary.main : 'black',
          borderBottom: isActive(link.path) ? `2px solid ${theme.palette.primary.main}` : 'none',
          background: 'transparent',
          '&:hover': {
            background: 'rgba(25, 118, 210, 0.05)',
          },
        }}
      >
        {link.label}
      </Button>
    ));
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box
            component={Link}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}
          >
            <ShoppingBagIcon sx={{ color: theme.palette.primary.main, fontSize: 30, mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>ShopShop</Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            {renderLinks()}
            {isAuthenticated && (
              <Button
              onClick={logout}
              sx={{
                ...baseButtonStyle,
                color: 'black',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Logout
            </Button>
            
            )}
          </Box>

          <IconButton
            sx={{ display: { xs: 'block', sm: 'none' } }}
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List>
          {renderLinks().map((button, i) => (
            <ListItem key={i} disablePadding onClick={() => setOpenDrawer(false)}>
              {button}
            </ListItem>
          ))}
          {isAuthenticated && (
            <ListItem button onClick={() => { logout(); setOpenDrawer(false); }}>
              Logout
            </ListItem>
          )}
        </List>
      </Drawer>

      <Toolbar /> {/* push content down below AppBar */}
    </>
  );
};

export default Navbar;
