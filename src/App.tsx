import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import UserManagement from './pages/UserManagament'
import ProtectedRoute from './components/ProtectedRoute'
import Fav from './pages/Fav'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path ="/orders" element={<Orders />} />
        <Route path="/usermanagement" element={<UserManagement />} />
        <Route path="/fav" element={<Fav />} />
        {/* Diğer sayfalar burada olacak */}
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
