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
