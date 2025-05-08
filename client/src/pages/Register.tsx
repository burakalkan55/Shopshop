import { useState } from 'react'
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await api.post('/auth/register', { name, email, password })
      console.log('Kayıt başarılı:', response.data)

      // Kayıt başarılı olduğunda Snackbar'ı göster
      setSnackbarMessage('Kayıt başarılı!')
      setOpenSnackbar(true)

      // 2 saniye sonra Snackbar'ı kapat ve profil sayfasına yönlendir
      setTimeout(() => {
        setOpenSnackbar(false)
        navigate('/profile') // Kullanıcıyı profile sayfasına yönlendir
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Kayıt sırasında hata oluştu')
    }
  }

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      <Typography variant="h5">Kayıt Ol</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="İsim"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Button type="submit" variant="contained" fullWidth>Kaydol</Button>
      </form>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000} // 2 saniye sonra kapanacak
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Register
