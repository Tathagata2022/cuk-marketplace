"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createItemRequest } from "@/app/actions/request"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import Navbar from "@/components/Navbar"

export default function NewRequestPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
      </div>
    )
  }
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-gray-100 shadow-xl">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">You must be logged in to post a request.</p>
          <button 
            onClick={() => router.push("/")}
            className="w-full inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const promise = createItemRequest(formData)
    
    toast.promise(promise, {
      loading: 'Posting request...',
      success: 'Request posted successfully! 🎉',
      error: 'Failed to post request.',
    })

    try {
      const res = await promise
      if (res.success) {
        setTimeout(() => {
          router.push("/requests")
        }, 1000)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative text-gray-900">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center pb-24 md:pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="max-w-2xl w-full bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden"
          >
            <div className="px-6 sm:px-12 py-8 sm:py-10 relative z-10 text-center sm:text-left border-b border-gray-100 bg-blue-50/50">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Post an ISO Request
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-2">Can't find what you need? Let the campus know what you are looking for.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 sm:px-12 py-8 sm:py-10 space-y-6 relative z-10 bg-white">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest pl-2">What are you looking for?</label>
                <input 
                  name="title"
                  required 
                  type="text" 
                  placeholder="E.g. Engineering Mathematics Textbook Vol 1"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest pl-2">Details (Edition, Condition preferred, etc)</label>
                <textarea 
                  name="description"
                  required 
                  rows={4}
                  placeholder="I need the 5th edition. Willing to accept slightly used."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest pl-2">Your Budget (₹)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                    <input 
                      name="budget"
                      required 
                      type="number" 
                      min="0"
                      placeholder="0"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-5 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-black"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest pl-2">Category</label>
                  <select 
                    name="category"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                  >
                    <option value="📚 Books & Study Materials">📚 Books & Study Materials</option>
                    <option value="💻 Electronics">💻 Electronics</option>
                    <option value="📱 Gadgets & Accessories">📱 Gadgets & Accessories</option>
                    <option value="🪑 Furniture & Home Essentials">🪑 Furniture & Home Essentials</option>
                    <option value="✨ Other">✨ Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex flex-col-reverse sm:flex-row justify-end gap-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className="px-8 py-3.5 bg-white rounded-xl text-gray-600 font-bold transition-colors border border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {loading ? "Posting..." : "Post Request"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
