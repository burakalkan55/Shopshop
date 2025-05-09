import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { protectedRoute } from '../middleware/protectedRoute';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// 📂 uploads klasörünü kontrol et, yoksa oluştur
const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 📸 Multer yapılandırması (diskStorage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${baseName}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 📍 GET /users/me → Kullanıcı bilgilerini getir
router.get('/users/me', protectedRoute, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    res.json(user);
  } catch (err) {
    console.error('[GET /users/me]', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// 🛠 PATCH /users/me → Kullanıcı adı, email ve profil fotoğrafını güncelle
router.patch(
  '/users/me',
  protectedRoute,
  upload.single('image'), // 'image' alanı frontend'den FormData ile gelmeli
  async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!name && !email && !image) {
      return res.status(400).json({ error: 'Güncellenecek bilgi yok' });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: req.userId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(image && { image }), // Prisma schema'da `image` alanı olmalı
        },
      });

      res.json(updatedUser);
    } catch (err) {
      console.error('[PATCH /users/me]', err);
      res.status(500).json({ error: 'Güncelleme başarısız' });
    }
  }
);

export default router;
