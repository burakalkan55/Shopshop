import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protectedRoute } from '../middleware/protectedRoute';

const router = express.Router();
const prisma = new PrismaClient();

// GET /favs → kullanıcının favorileri
router.get('/', protectedRoute, async (req, res) => {
  const favs = await prisma.fav.findMany({
    where: { userId: req.userId },
    select: { productId: true },
  });
  res.json(favs);
});

// POST /favs → favori ekle
router.post('/', protectedRoute, async (req, res) => {
  const { productId } = req.body;
  try {
    const fav = await prisma.fav.create({
      data: { userId: req.userId, productId },
    });
    res.status(201).json(fav);
  } catch (err) {
    res.status(400).json({ error: 'Favori eklenemedi' });
  }
});

// DELETE /favs/:productId → favori sil
router.delete('/:productId', protectedRoute, async (req, res) => {
  const { productId } = req.params;
  await prisma.fav.deleteMany({
    where: {
      userId: req.userId,
      productId: parseInt(productId),
    },
  });
  res.json({ message: 'Favori silindi' });
});

export default router;
