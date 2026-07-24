"use client"

import { useState } from "react"
import { deleteItemRequest } from "@/app/actions/request"
import toast from "react-hot-toast"
import Link from "next/link"

export default function FulfillRequestButton({ requestId, isOwner, category }: { requestId: string, isOwner: boolean, category: string }) {
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this request?")) return
    setLoading(true)
    const promise = deleteItemRequest(requestId)
    
    toast.promise(promise, {
      loading: 'Deleting request...',
      success: 'Request deleted!',
      error: 'Failed to delete request.',
    })

    try {
      const res = await promise
      if (res.success) {
        setDeleted(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (deleted) return null

  if (isOwner) {
    return (
      <button 
        onClick={handleDelete}
        disabled={loading}
        className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
      >
        {loading ? "..." : "Delete Request"}
      </button>
    )
  }

  return (
    <Link 
      href={`/sell?category=${encodeURIComponent(category)}`}
      className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold py-2 px-4 rounded-xl transition-colors shadow-sm"
    >
      I have this!
    </Link>
  )
}
