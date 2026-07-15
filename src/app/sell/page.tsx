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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-neon-green/20 border-t-neon-green animate-spin"></div>
        <p className="mt-4 text-neon-green font-bold tracking-widest uppercase text-sm animate-pulse">Loading...</p>
      </div>
    )
  }
  
  if (!session) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="dark-glass rounded-2xl p-8 max-w-md w-full text-center border border-white/10 shadow-[0_0_30px_rgba(57,255,20,0.1)]">
          <h1 className="text-3xl font-black text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">You must be logged in to list products on the marketplace.</p>
          <button 
            onClick={() => router.push("/")}
            className="w-full inline-block bg-neon-green text-black font-black px-6 py-3 rounded-xl hover:bg-neon-yellow transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)]"
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
    
    const promise = createProduct(formData)
    
    toast.promise(promise, {
      loading: 'Creating your listing...',
      success: 'Product listed successfully! 🎉',
      error: 'Failed to list product.',
    })

    try {
      const res = await promise
      if (res.success) {
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
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden text-white">
      {/* Dark Mode Background Elements */}
      <div className="fixed inset-0 z-0 bg-grid-pattern pointer-events-none opacity-20"></div>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-neon-green/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-neon-yellow/5 blur-[150px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="max-w-2xl w-full dark-glass rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-green to-neon-yellow"></div>

            <div className="px-6 sm:px-12 py-8 sm:py-10 relative z-10 text-center sm:text-left border-b border-white/5">
              <h1 className="text-3xl font-black text-white tracking-tight flex justify-center sm:justify-start items-center gap-3">
                <span className="w-2 h-8 bg-neon-green rounded-full"></span>
                Create a Listing
              </h1>
              <p className="text-sm font-medium text-gray-400 mt-2 sm:ml-5">Reach hundreds of students on campus instantly.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 sm:px-12 py-8 sm:py-10 space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-neon-green uppercase tracking-widest pl-2">Title</label>
                <input 
                  name="title"
                  required 
                  type="text" 
                  placeholder="E.g. MacBook Air M1, Like New"
                  className="w-full bg-[#111111] border border-white/10 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none transition-all placeholder:text-gray-600 text-white font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-neon-green uppercase tracking-widest pl-2">Description</label>
                <textarea 
                  name="description"
                  required 
                  rows={4}
                  placeholder="Describe the condition, age, accessories included, and reason for selling..."
                  className="w-full bg-[#111111] border border-white/10 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none transition-all placeholder:text-gray-600 text-white font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-neon-green uppercase tracking-widest pl-2">Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neon-yellow font-bold">₹</span>
                    <input 
                      name="price"
                      required 
                      type="number" 
                      min="0"
                      placeholder="0"
                      className="w-full bg-[#111111] border border-white/10 rounded-2xl pl-10 pr-5 py-3.5 focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none transition-all placeholder:text-gray-600 text-neon-yellow font-black"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-neon-green uppercase tracking-widest pl-2">Category</label>
                  <select 
                    name="category"
                    required
                    className="w-full bg-[#111111] border border-white/10 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none transition-all text-white font-medium appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2339FF14'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                  >
                    <option value="Electronics" className="bg-[#111111] text-white">Electronics</option>
                    <option value="Textbooks" className="bg-[#111111] text-white">Textbooks</option>
                    <option value="Dorm" className="bg-[#111111] text-white">Dorm Furniture</option>
                    <option value="Cycles" className="bg-[#111111] text-white">Cycles</option>
                    <option value="Other" className="bg-[#111111] text-white">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-neon-green uppercase tracking-widest pl-2">Condition</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Like New', 'Good', 'Fair', 'Poor'].map((cond) => (
                    <label key={cond} className="relative cursor-pointer group">
                      <input type="radio" name="condition" value={cond} className="peer sr-only" required defaultChecked={cond === 'Good'} />
                      <div className="text-center px-2 py-3 rounded-xl bg-[#111111] border border-white/10 peer-checked:bg-neon-green/10 peer-checked:border-neon-green peer-checked:text-neon-green text-gray-400 font-bold text-sm transition-all shadow-sm">
                        {cond}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-neon-green uppercase tracking-widest pl-2">Image URL</label>
                <input 
                  name="imageUrl"
                  type="url" 
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#111111] border border-white/10 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none transition-all placeholder:text-gray-600 text-white font-medium"
                />
                <p className="text-[10px] font-bold text-gray-500 pl-2 pt-1 uppercase">Leave blank for placeholder</p>
              </div>

              <div className="pt-6 flex flex-col-reverse sm:flex-row justify-end gap-4 border-t border-white/5">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => router.back()}
                  className="px-8 py-3.5 bg-[#111111] rounded-xl text-gray-400 hover:text-white font-bold transition-colors border border-white/10 hover:border-white/30"
                >
                  Cancel
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-neon-green text-black rounded-xl hover:bg-neon-yellow font-black transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(255,255,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
