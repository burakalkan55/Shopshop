import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { protectedRoute } from '../middleware/protectedRoute'

const router = express.Router()
const prisma = new PrismaClient()

// GET /cart → Kullanıcının sepetini getir
router.get('/', protectedRoute, async (req: Request, res: Response) => {
  const userId = req.userId

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    })

    res.json(cartItems)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Sepet alınamadı' })
  }
})

// POST /cart → Sepete ürün ekle
router.post("/", protectedRoute, async (req: Request, res: Response) => {
    const userId = req.userId;
    const { productId, quantity } = req.body;
  
    if (!productId || !quantity) {
      return res.status(400).json({ error: "Eksik veri" });
    }
  
    try {
      const existing = await prisma.cartItem.findFirst({
        where: { userId, productId },
      });
  
      // Eğer varsa güncelle
      if (existing) {
        const newQty = existing.quantity + quantity;
  
        if (newQty <= 0) {
          await prisma.cartItem.delete({ where: { id: existing.id } });
          return res.json({ message: "Silindi" });
        }
  
        const updated = await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: newQty },
        });
  
        return res.json(updated);
      }
  
      // Yoksa yeni oluştur
      const created = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
  
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  });
  
// DELETE /cart/:id → Sepetten ürünü çıkar
router.delete('/:id', protectedRoute, async (req: Request, res: Response) => {
    const cartItemId = Number(req.params.id);
  
    try {
      const deleted = await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
  
      res.json({ message: 'Silindi', deleted });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Silinemedi' });
    }
  });
  
export default router
