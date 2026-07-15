"use client"

import { deleteMyProduct } from "@/app/actions/product"
import { useState } from "react"
import toast from "react-hot-toast"

export default function DeleteListingButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating to product page
    e.stopPropagation()

    if (!confirm("Are you sure you want to delete this listing?")) return

    setLoading(true)
    const promise = deleteMyProduct(productId)
    toast.promise(promise, {
      loading: 'Deleting listing...',
      success: 'Listing deleted!',
      error: 'Failed to delete listing',
    })

    try {
      await promise
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="bg-white text-red-500 p-2 rounded-full shadow-md border border-gray-100 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
      title="Delete Listing"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </button>
  )
}
