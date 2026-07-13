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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col relative overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-300/30 blur-[80px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-300/20 blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="max-w-2xl w-full glass-card rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white relative overflow-hidden"
          >
            {/* Inner top glow */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-yellow-200/30 to-transparent pointer-events-none"></div>

            <div className="px-8 sm:px-12 py-10 relative z-10 text-center sm:text-left">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create a Listing</h1>
              <p className="text-sm font-medium text-gray-500 mt-2">Reach hundreds of students on campus instantly.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="px-8 sm:px-12 pb-10 space-y-6 relative z-10">
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-2">Title</label>
                <input 
                  name="title"
                  required 
                  type="text" 
                  placeholder="E.g. MacBook Air M1, Like New"
                  className="w-full bg-white/60 backdrop-blur-sm border border-white shadow-inner rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-green-400 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-2">Description</label>
                <textarea 
                  name="description"
                  required 
                  rows={4}
                  placeholder="Describe the condition, age, accessories included, and reason for selling..."
                  className="w-full bg-white/60 backdrop-blur-sm border border-white shadow-inner rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-green-400 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-900 font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-2">Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input 
                      name="price"
                      required 
                      type="number" 
                      min="0"
                      placeholder="0"
                      className="w-full bg-white/60 backdrop-blur-sm border border-white shadow-inner rounded-2xl pl-10 pr-5 py-3.5 focus:ring-2 focus:ring-green-400 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-900 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-2">Category</label>
                  <select 
                    name="category"
                    required
                    className="w-full bg-white/60 backdrop-blur-sm border border-white shadow-inner rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-green-400 focus:bg-white outline-none transition-all text-gray-900 font-medium appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Textbooks">Textbooks</option>
                    <option value="Dorm">Dorm Furniture</option>
                    <option value="Cycles">Cycles</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-2">Condition</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Like New', 'Good', 'Fair', 'Poor'].map((cond) => (
                    <label key={cond} className="relative cursor-pointer group">
                      <input type="radio" name="condition" value={cond} className="peer sr-only" required defaultChecked={cond === 'Good'} />
                      <div className="text-center px-3 py-3 rounded-xl bg-white/40 border border-white peer-checked:bg-green-50 peer-checked:border-green-400 peer-checked:text-green-700 text-gray-600 font-bold text-sm transition-all shadow-sm hover:shadow-md">
                        {cond}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-2">Image URL</label>
                <input 
                  name="imageUrl"
                  type="url" 
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white/60 backdrop-blur-sm border border-white shadow-inner rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-green-400 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                />
                <p className="text-[10px] font-bold text-gray-400 pl-2 pt-1 uppercase">Leave blank for placeholder</p>
              </div>

              <div className="pt-6 flex flex-col-reverse sm:flex-row justify-end gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => router.back()}
                  className="px-8 py-3.5 glass rounded-xl text-gray-700 hover:bg-white font-bold transition-colors border border-white/50"
                >
                  Cancel
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-black font-black transition-all shadow-lg shadow-gray-900/20 disabled:opacity-50 flex items-center justify-center min-w-[160px]"
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : "Publish Listing"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
