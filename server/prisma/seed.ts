// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

async function main() {
  const response = await axios.get("https://dummyjson.com/products?limit=100")
  const products = response.data.products

  for (const p of products) {
    await prisma.product.create({
      data: {
        title: p.title,
        description: p.description,
        price: p.price,
        image: p.thumbnail,
      },
    })
  }

  console.log("✅ Veritabanına 100 ürün başarıyla eklendi.")
}

main()
  .catch((e) => {
    console.error("🚨 Seed sırasında hata:", e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
