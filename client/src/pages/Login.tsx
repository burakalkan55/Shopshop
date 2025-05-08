import { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', response.data.token) // Token'ı localStorage'a kaydet
      console.log('Giriş başarılı:', response.data)
      navigate('/profile') // Giriş başarılıysa profil sayfasına yönlendir
    } catch (err: any) {
      setError(err.response?.data?.error || 'Giriş sırasında hata oluştu')
    }
  }

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      <Typography variant="h5">Giriş Yap</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="E-posta"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Şifre"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth>Giriş Yap</Button>


        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link> </Typography>
      </form>
    </Box>
  )
}

export default Login
