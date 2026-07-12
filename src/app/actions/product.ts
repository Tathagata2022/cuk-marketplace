"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || !(session.user as any).id) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const condition = formData.get("condition") as string
  const category = formData.get("category") as string
  // For the prototype, we will just use a placeholder image if none provided
  const images = (formData.get("imageUrl") as string) || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
  
  const product = await prisma.product.create({
    data: {
      title,
      description,
      price,
      condition,
      category,
      images,
      sellerId: (session.user as any).id,
    },
  })

  revalidatePath("/products")
  return { success: true, productId: product.id }
}

export async function getProducts() {
  return await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { seller: { select: { name: true, image: true } } },
  })
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: { seller: { select: { name: true, image: true, department: true } } },
  })
}

export async function expressInterest(productId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || !(session.user as any).id) {
    throw new Error("Unauthorized")
  }

  const order = await prisma.order.create({
    data: {
      productId,
      buyerId: (session.user as any).id,
      status: "INTERESTED",
    },
  })

  return { success: true, orderId: order.id }
}
