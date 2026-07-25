const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: "desc" }
  })
  products.forEach(p => console.log(p.id, p.title, JSON.stringify(p.images)))
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
