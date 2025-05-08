import { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  

  const toggleDrawer = (open: boolean) => {
    setOpenDrawer(open)
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Alışveriş Uygulaması
          </Typography>

          {/* Hamburger Menu Icon for small screens */}
          <IconButton 
            color="inherit" 
            aria-label="open drawer" 
            onClick={() => toggleDrawer(true)}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop buttons */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Button color="inherit" component={Link} to="/">Ana Sayfa</Button>
            <Button color="inherit" component={Link} to="/profile">Profil</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile screens */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
      >
        <List sx={{ width: 250 }}>
          <ListItem 
            button 
            component={Link} 
            to="/" 
            onClick={() => toggleDrawer(false)} 
            sx={{ padding: '10px 15px', fontSize: '1.2rem', color: '#1976d2', '&:hover': { backgroundColor: '#f5f5f5' } }}
          >
            Ana Sayfa
          </ListItem>
          <ListItem 
            button 
            component={Link} 
            to="/profile" 
            onClick={() => toggleDrawer(false)} 
            sx={{ padding: '10px 15px', fontSize: '1.2rem', color: '#1976d2', '&:hover': { backgroundColor: '#f5f5f5' } }}
          >
            Profil
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}

export default Navbar
