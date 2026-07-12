"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function isAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user && (session.user as any).role === "ADMIN"
}

export async function getAdminOrders() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized: Admin access required")
  }

  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { 
        select: { 
          title: true, 
          price: true, 
          images: true,
          seller: { select: { name: true, email: true, phoneNumber: true } }
        } 
      },
      buyer: { select: { name: true, email: true, phoneNumber: true } }
    }
  })
}

export async function updateOrderStatus(orderId: string, status: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized: Admin access required")
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  })
  
  if (status === "COMPLETED") {
    // If order is completed, mark product as sold
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (order) {
      await prisma.product.update({
        where: { id: order.productId },
        data: { status: "SOLD" }
      })
    }
  }

  revalidatePath("/admin")
  return { success: true }
}
