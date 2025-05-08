import { useState } from 'react'
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/api'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Formdaki alanların boş olup olmadığını kontrol edelim
    if (!name || !email || !password) {
      setError("Tüm alanlar zorunludur!")
      return
    }

    try {
      const response = await api.post('/auth/register', { name, email, password })
      console.log('Kayıt başarılı:', response.data)

      // Kayıt başarılı olduğunda success mesajı göster
      setSnackbarMessage('Kayıt başarılı!')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)

      // 2 saniye sonra Snackbar'ı kapat ve profil sayfasına yönlendir
      setTimeout(() => {
        setOpenSnackbar(false)
        navigate('/profile') // Kullanıcıyı profile sayfasına yönlendir
      }, 2000)
    } catch (err: any) {
      // Hata durumunda error mesajı göster
      setSnackbarMessage(err.response?.data?.error || 'Kayıt sırasında hata oluştu')
      setSnackbarSeverity('error')
      setOpenSnackbar(true)
    }
  }

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      <Typography variant="h5" sx={{ fontSize: { xs: '1.8rem', sm: '2rem' } }}>
        Kayıt Ol
      </Typography>
      {error && <Typography color="error" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>{error}</Typography>}

      {/* Form alanları */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="İsim"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
        />
        <TextField
          label="E-posta"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
        />
        <TextField
          label="Şifre"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
        />

        {/* Kayıt butonu */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
        >
          Kaydol
        </Button>
      </form>

      {/* Giriş yap linki */}
      <Typography variant="body2" align="center" sx={{ marginTop: 2, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
        Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
      </Typography>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000} // 2 saniye sonra kapanacak
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Register
