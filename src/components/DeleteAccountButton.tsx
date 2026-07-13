"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteUserAccount } from "@/app/actions/user"
import { signOut } from "next-auth/react"
import toast from "react-hot-toast"

export default function DeleteAccountButton() {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently delete your account? This action cannot be undone and will delete all your listed products and active orders.")) {
      setIsDeleting(true)
      try {
        const result = await deleteUserAccount()
        if (result.success) {
          toast.success("Account deleted successfully")
          // Sign out and redirect to home
          await signOut({ callbackUrl: "/" })
        } else {
          toast.error(result.error || "Failed to delete account")
          setIsDeleting(false)
        }
      } catch (err) {
        toast.error("An unexpected error occurred")
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h3>
      <p className="text-gray-500 mb-4 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-white border border-red-200 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {isDeleting ? "Deleting Account..." : "Delete My Account"}
      </button>
    </div>
  )
}
