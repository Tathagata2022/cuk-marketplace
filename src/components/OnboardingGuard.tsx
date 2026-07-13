"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export default function OnboardingGuard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "loading" || !session?.user) return

    // @ts-ignore
    const hasProfile = session.user.department && session.user.phoneNumber

    // If they are logged in but missing profile details, and not already on onboarding
    if (!hasProfile && pathname !== "/onboarding") {
      router.replace("/onboarding")
    }
  }, [session, status, pathname, router])

  return null
}
