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
  if (!session?.user) return { success: false, error: "Not logged in" }

  // @ts-ignore
  const userId = session.user.id

  try {
    await prisma.order.create({
      data: {
        productId,
        buyerId: userId,
        status: "INTERESTED"
      }
    })
    return { success: true }
  } catch (e) {
    return { success: false, error: "Failed" }
  }
}

export async function payForProduct(productId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { success: false, error: "Not logged in" }

  // @ts-ignore
  const userId = session.user.id

  try {
    await prisma.order.create({
      data: {
        productId,
        buyerId: userId,
        status: "PAID"
      }
    })
    return { success: true }
  } catch (e) {
    return { success: false, error: "Failed" }
  }
}

export async function deleteProduct(productId: string) {
  const session = await getServerSession(authOptions)
  // Ensure the user is an admin
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    // Delete associated orders first to satisfy foreign key constraints
    await prisma.order.deleteMany({
      where: { productId }
    })
    
    await prisma.product.delete({
      where: { id: productId }
    })
    return { success: true }
  } catch (e) {
    return { success: false, error: "Failed to delete product" }
  }
}

export async function updateProductPrice(productId: string, newPrice: number) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.product.update({
      where: { id: productId },
      data: { price: newPrice }
    })
    return { success: true }
  } catch (e) {
    return { success: false, error: "Failed to update price" }
  }
}

export async function deleteMyProduct(productId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }
  
  // @ts-ignore
  const userId = session.user.id

  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product || product.sellerId !== userId) {
    return { success: false, error: "Unauthorized or not found" }
  }

  try {
    // Delete associated orders first
    await prisma.order.deleteMany({
      where: { productId }
    })
    
    await prisma.product.delete({
      where: { id: productId }
    })
    
    revalidatePath("/profile")
    revalidatePath("/")
    return { success: true }
  } catch (e) {
    return { success: false, error: "Failed to delete product" }
  }
}

export async function removeInterest(orderId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  // @ts-ignore
  const userId = session.user.id

  const order = await prisma.order.findUnique({
    where: { id: orderId }
  })

  if (!order || order.buyerId !== userId) {
    return { success: false, error: "Unauthorized or not found" }
  }

  try {
    await prisma.order.delete({
      where: { id: orderId }
    })
    
    revalidatePath("/profile")
    return { success: true }
  } catch (e) {
    return { success: false, error: "Failed to remove interest" }
  }
}
