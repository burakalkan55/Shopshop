import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { protectedRoute } from '../middleware/protectedRoute'

const router = express.Router()
const prisma = new PrismaClient()

// POST /orders → Sepetten sipariş oluştur
router.post('/', protectedRoute, async (req: Request, res: Response) => {
  const userId = req.userId

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId }
    })

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Sepet boş' })
    }

    // Siparişi oluştur
    const order = await prisma.order.create({
      data: {
        userId,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        items: true
      }
    })

    // Sepeti temizle
    await prisma.cartItem.deleteMany({
      where: { userId }
    })

    res.status(201).json({ message: 'Sipariş oluşturuldu', order })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sipariş oluşturulamadı' })
  }
})

// GET /orders → Kullanıcının sipariş geçmişi
router.get('/', protectedRoute, async (req: Request, res: Response) => {
  const userId = req.userId

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Siparişler alınamadı' })
  }
})

export default router
