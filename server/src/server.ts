import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// .env dosyasını yükle
dotenv.config()

// Express ve Prisma başlat
const app = express()
const prisma = new PrismaClient()

// Middleware'ler
app.use(cors({
  origin: 'http://localhost:5173', // sadece frontend'e izin veriyoruz
  credentials: true
}))
app.use(express.json()) // JSON gövdesini parse etmek için gerekli
app.use(express.urlencoded({ extended: true })) // Eğer form veri gönderilecekse

// Middleware: Token doğrulaması ve session kontrolü
const protectedRoute = async (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Yetkisiz' })
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecret')
    const session = await prisma.session.findUnique({
      where: { token: token },
    })

    if (!session || session.status !== 'online') {
      return res.status(401).json({ error: 'Session geçersiz veya offline' })
    }

    req.userId = decoded.userId
    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
}

// POST /auth/register → Yeni kullanıcı kaydı
app.post('/auth/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Tüm alanlar zorunlu' })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return res.status(409).json({ error: 'Bu e-posta zaten kayıtlı' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Yeni bir session oluşturuyoruz
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1h' }
    )

    await prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        status: 'online',  // İlk oturumda online olarak kaydediyoruz
      }
    })

    res.status(201).json({ message: 'Kayıt başarılı', token, user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// POST /auth/login → Kullanıcı girişi ve session oluşturma
app.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'E-posta ve şifre zorunlu' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1h' }
    )

    // Yeni bir session oluşturuyoruz
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        status: 'online',  // İlk oturumda online olarak kaydediyoruz
      }
    })

    res.json({ message: 'Giriş başarılı', token, sessionId: session.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// GET /users/me → Giriş yapan kullanıcıyı al
app.get('/users/me', protectedRoute, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    })

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' })
    }

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// POST /auth/logout → Kullanıcı çıkış yaparsa session'ı güncelle
// POST /auth/logout → Kullanıcı çıkış yaparsa session'ı güncelle
app.post('/auth/logout', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Yetkisiz' })
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecret')
    
    // Kullanıcının tüm aktif sessionlarını offline yap
    await prisma.session.updateMany({
      where: { 
        userId: decoded.userId,
        status: 'online'
      },
      data: { status: 'offline' }
    })

    res.json({ message: 'Çıkış başarılı' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})


// GET /products → Tüm ürünleri getir
app.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany()
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ürünler alınamadı' })
  }
})

// POST /orders → Sipariş oluştur (Token ile korumalı)
app.post('/orders', protectedRoute, async (req: Request, res: Response) => {
  const { productId } = req.body

  if (!productId) {
    return res.status(400).json({ error: 'Ürün ID zorunlu' })
  }

  try {
    const order = await prisma.order.create({
      data: {
        productId: Number(productId),
        userId: req.userId
      }
    })

    res.status(201).json({ message: 'Sipariş oluşturuldu', order })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sipariş oluşturulamadı' })
  }
})


// Server'ı başlat
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
