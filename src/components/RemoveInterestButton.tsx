"use client"

import { removeInterest } from "@/app/actions/product"
import { useState } from "react"
import toast from "react-hot-toast"

export default function RemoveInterestButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false)

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating to product page
    e.stopPropagation()

    if (!confirm("Are you sure you want to remove this item from your interested list?")) return

    setLoading(true)
    const promise = removeInterest(orderId)
    toast.promise(promise, {
      loading: 'Removing...',
      success: 'Item removed!',
      error: 'Failed to remove',
    })

    try {
      await promise
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleRemove}
      disabled={loading}
      className="bg-white text-gray-500 p-2 rounded-full shadow-md border border-gray-100 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50"
      title="Remove Interest"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  )
}
