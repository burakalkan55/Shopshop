import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

// Middleware'ler (mutlaka en üstte olmalı!)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 🔐 Middleware dışa aktarıldıysa import et
import cartRoutes from './routes/cartRoutes'
import orderRoutes from './routes/orderRoutes'
import { protectedRoute } from './middleware/protectedRoute'

// Route'lar
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)

// 🔐 Auth işlemleri
app.post('/auth/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  if (!email || !password || !name) return res.status(400).json({ error: 'Tüm alanlar zorunlu' })

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return res.status(409).json({ error: 'Bu e-posta zaten kayıtlı' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1h' })
    await prisma.session.create({
      data: { userId: user.id, token, status: 'online' }
    })

    res.status(201).json({ message: 'Kayıt başarılı', token, user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

app.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Gerekli alanlar boş' })

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Geçersiz bilgiler' })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1h' })
    const session = await prisma.session.create({
      data: { userId: user.id, token, status: 'online' }
    })

    res.json({ message: 'Giriş başarılı', token, sessionId: session.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

app.post('/auth/logout', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Yetkisiz' })

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecret')
    await prisma.session.updateMany({
      where: { userId: decoded.userId, status: 'online' },
      data: { status: 'offline' }
    })
    res.json({ message: 'Çıkış başarılı' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

app.get('/users/me', protectedRoute, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

app.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany()
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ürünler alınamadı' })
  }
})

// Server'ı başlat
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
