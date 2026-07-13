"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createProduct } from "../actions/product"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

import Navbar from "@/components/Navbar"

export default function SellPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (status === "loading") return <div className="p-8 text-center">Loading...</div>
  
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full"
        >
          <h2 className="text-xl font-bold mb-4">Please log in to sell</h2>
          <p className="text-gray-600 mb-6">You must be logged in to list products on the marketplace.</p>
          <button 
            onClick={() => router.push("/")}
            className="w-full bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-700"
          >
            Go Home
          </button>
        </motion.div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // We can show a loading toast if we wanted, but let's just use success/error
    const promise = createProduct(formData)
    
    toast.promise(promise, {
      loading: 'Creating your listing...',
      success: 'Product listed successfully! 🎉',
      error: 'Failed to list product.',
    })

    try {
      const res = await promise
      if (res.success) {
        // slight delay before routing to allow user to read the toast
        setTimeout(() => {
          router.push("/")
        }, 1000)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-yellow-500 bg-yellow-400 text-gray-900">
            <h1 className="text-2xl font-extrabold text-gray-900">List an Item</h1>
            <p className="text-sm font-medium text-gray-800 mt-1">Provide details about the item you want to sell.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                name="title"
                required 
                type="text" 
                placeholder="E.g. iPhone 13 Pro Max"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
              />
            </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description"
              required 
              rows={4}
              placeholder="Describe the condition, age, and reason for selling..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input 
                name="price"
                required 
                type="number" 
                min="0"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                name="category"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Furniture">Furniture</option>
                <option value="Cycles">Cycles</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select 
              name="condition"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
            >
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional for prototype)</label>
            <input 
              name="imageUrl"
              type="url" 
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank to use a default placeholder image.</p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
            >
              {loading ? "Listing..." : "List Product"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
