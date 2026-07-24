"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createItemRequest(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || !(session.user as any).id) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const budget = parseFloat(formData.get("budget") as string)
  const category = formData.get("category") as string
  
  const request = await prisma.itemRequest.create({
    data: {
      title,
      description,
      budget,
      category,
      requesterId: (session.user as any).id,
    },
  })

  revalidatePath("/requests")
  return { success: true, requestId: request.id }
}

export async function getActiveItemRequests() {
  return await prisma.itemRequest.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    include: { requester: { select: { department: true } } },
  })
}

export async function deleteItemRequest(requestId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || !(session.user as any).id) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const request = await prisma.itemRequest.findUnique({
      where: { id: requestId }
    })
    
    if (!request || request.requesterId !== (session.user as any).id) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.itemRequest.delete({
      where: { id: requestId }
    })
    
    revalidatePath("/requests")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete request" }
  }
}
