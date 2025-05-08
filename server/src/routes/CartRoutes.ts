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
router.post('/', protectedRoute, async (req: Request, res: Response) => {
  const userId = req.userId
  const { productId, quantity } = req.body

  if (!productId || quantity < 1) {
    return res.status(400).json({ error: 'Geçersiz veri' })
  }

  try {
    // Varsa artır, yoksa oluştur
    const existingItem = await prisma.cartItem.findFirst({
      where: { userId, productId }
    })

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
      return res.json(updated)
    }

    const created = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity
      }
    })

    res.status(201).json(created)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Sepete eklenemedi' })
  }
})

// DELETE /cart/:id → Sepetten ürünü çıkar
router.delete('/:id', protectedRoute, async (req: Request, res: Response) => {
  const cartItemId = parseInt(req.params.id)

  try {
    await prisma.cartItem.delete({
      where: { id: cartItemId }
    })

    res.json({ message: 'Ürün sepetten silindi' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Silme işlemi başarısız' })
  }
})

export default router
