import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Define a custom request type that includes userId
interface CustomRequest extends Request {
  userId?: number;
}

// Statik klasör (yüklenen kullanıcı resimlerine erişim için)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware'ler
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route importları
import cartRoutes from './routes/CartRoutes'; // Ensure casing matches CartRoutes.ts
import orderRoutes from './routes/OrderRoutes'; // Ensure casing matches OrderRoutes.ts
import userRoutes from './routes/UserRoutes';   // Ensure casing matches UserRoutes.ts
import favRoutes from './routes/favRoutes';
import { protectedRoute } from './middleware/protectedRoute';

// Route bağlama
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/favs', favRoutes);
app.use('/', userRoutes);

// Kayıt
app.post('/auth/register', async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Tüm alanlar zorunlu' });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'Bu e-posta zaten kayıtlı' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1h' }
    );

    await prisma.session.create({
      data: { userId: user.id, token, status: 'online' }
    });

    res.status(201).json({ message: 'Kayıt başarılı', token, user });
  } catch (err) {
    next(err); // Pass errors to the next error-handling middleware
  }
});

// Giriş
app.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Gerekli alanlar boş' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Geçersiz bilgiler' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1h' }
    );

    await prisma.session.create({
      data: { userId: user.id, token, status: 'online' }
    });

    res.json({ message: 'Giriş başarılı', token, user });
  } catch (err) {
    next(err);
  }
});

// Çıkış
app.post('/auth/logout', async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    await prisma.session.deleteMany({ where: { token } });
    res.json({ message: 'Çıkış başarılı' });
  } catch (err) {
    next(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});