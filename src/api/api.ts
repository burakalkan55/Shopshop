import axios from 'axios'

// API url'si (Backend'e istek göndereceğimiz URL)
const api = axios.create({
  baseURL: 'http://localhost:3000', // Backend API adresi
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token'ı header'da gönderecek bir interceptor ekliyoruz
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
