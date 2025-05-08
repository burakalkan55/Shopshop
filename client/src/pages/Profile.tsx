import { useEffect, useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
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

  const handleLogout = () => {
    const token = localStorage.getItem('token')

    api.post('/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      // Başarılı çıkış sonrası token'ı silip login sayfasına yönlendiriyoruz
      localStorage.removeItem('token')
      navigate('/login')
    })
    .catch((error) => {
      console.error('Logout error:', error)
      localStorage.removeItem('token')
      navigate('/login')
    })
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Profil Sayfası</Typography>
      <Typography variant="h6">Merhaba, {user.name}</Typography>
      <Typography>Email: {user.email}</Typography>
      {/* Çıkış yap butonu */}
      <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ marginTop: 2 }}>
        Çıkış Yap
      </Button>
    </Box>
  )
}

export default Profile
