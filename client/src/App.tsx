import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        {/* ProtectedRoute ile korunan sayfalar */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Diğer sayfalar burada olacak */}
      </Routes>
    </Router>
  )
}

export default App
