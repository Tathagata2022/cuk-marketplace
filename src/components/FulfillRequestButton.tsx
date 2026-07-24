"use client"

import { useState } from "react"
import { fulfillItemRequest } from "@/app/actions/request"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function FulfillRequestButton({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFulfill = async () => {
    setLoading(true)
    const promise = fulfillItemRequest(requestId)
    
    toast.promise(promise, {
      loading: 'Marking as fulfilled...',
      success: 'Request fulfilled! 🎉 You can now create a listing for this item.',
      error: 'Failed to fulfill request.',
    })

    try {
      const res = await promise
      if (res.success) {
        setTimeout(() => {
          router.push("/sell")
        }, 1500)
      } else {
        if (res.error === "Unauthorized") {
          toast.error("Please login first to fulfill requests")
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleFulfill}
      disabled={loading}
      className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold py-2 px-4 rounded-xl transition-colors shadow-sm disabled:opacity-50"
    >
      {loading ? "Processing..." : "I have this!"}
    </button>
  )
}
