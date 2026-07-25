const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const headphoneUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
  
  const result = await prisma.product.updateMany({
    where: {
      images: headphoneUrl
    },
    data: {
      images: "[]"
    }
  })
  
  console.log(`Updated ${result.count} products to use default image placeholder instead of headphones.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
