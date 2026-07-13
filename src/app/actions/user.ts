"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { success: false, error: "Not authenticated" }
  }

  const phoneNumber = formData.get("phoneNumber") as string
  const department = formData.get("department") as string
  const course = formData.get("course") as string
  const semester = parseInt(formData.get("semester") as string)
  const university = formData.get("university") as string

  if (!phoneNumber || !department || !course || isNaN(semester)) {
    return { success: false, error: "Phone, Department, Course, and Semester are required" }
  }

  try {
    // @ts-ignore
    await prisma.user.update({
      // @ts-ignore
      where: { id: session.user.id },
      data: {
        phoneNumber,
        department,
        course,
        semester: isNaN(semester) ? null : semester,
        university
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

export async function deleteUserAccount() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { success: false, error: "Not authenticated" }
  }
  
  // @ts-ignore
  const userId = session.user.id

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Delete all orders where this user is the buyer
      await tx.order.deleteMany({
        where: { buyerId: userId }
      })

      // 2. Delete all orders on products owned by this user
      const userProducts = await tx.product.findMany({
        where: { sellerId: userId },
        select: { id: true }
      })
      const productIds = userProducts.map(p => p.id)
      
      if (productIds.length > 0) {
        await tx.order.deleteMany({
          where: { productId: { in: productIds } }
        })
      }

      // 3. Delete all products owned by this user
      await tx.product.deleteMany({
        where: { sellerId: userId }
      })

      // 4. Delete sessions & accounts (handled by Cascade if set, but manual just in case)
      await tx.session.deleteMany({ where: { userId } })
      await tx.account.deleteMany({ where: { userId } })

      // 5. Delete the user
      await tx.user.delete({
        where: { id: userId }
      })
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting account:", error)
    return { success: false, error: "Failed to delete account" }
  }
}
