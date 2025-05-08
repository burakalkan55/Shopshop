import { useEffect, useState } from 'react'
import { Box, Typography, Button, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'

const Profile = () => {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  // useEffect ile token kontrolü ve kullanıcı bilgilerini alıyoruz
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      // Eğer token yoksa login sayfasına yönlendir
      navigate('/login')
    }

    // API'ye istek gönderip, giriş yapan kullanıcının bilgilerini alıyoruz
    api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => setUser(res.data))
    .catch(() => {
      // Hata varsa logout işlemi ve login sayfasına yönlendir
      localStorage.removeItem('token')
      navigate('/login')
    })
  }, [navigate])

  // Eğer kullanıcı bilgileri alınamazsa "Giriş yapmalısınız" mesajı göster
  if (!user) {
    return <Typography variant="h6" align="center">Giriş yapmalısınız!</Typography>
  }


  const handleLogout = async () => {
    const token = localStorage.getItem('token')
    
    try {
      // Try to logout from server first
      if (token) {
        await api.post('/auth/logout', {}, { // Added empty object as body
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local state regardless of server response
      localStorage.removeItem('token')
      setUser(null)
      navigate('/login')
    }
  }
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ fontSize: { xs: '1.8rem', sm: '2rem', md: '2.5rem' } }}>
        Profil Sayfası
      </Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
            Merhaba, {user.name}
          </Typography>
          <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Email: {user.email}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleLogout} 
            sx={{ marginTop: 2, fontSize: { xs: '0.8rem', sm: '1rem' } }}
          >
            Çıkış Yap
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile
