"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { updateUserProfile } from "../actions/user"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

export default function OnboardingPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  if (!session) {
    router.push("/")
    return null
  }

  // @ts-ignore
  if (session.user?.department && session.user?.phoneNumber) {
    router.push("/")
    return null
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const promise = updateUserProfile(formData)
    
    toast.promise(promise, {
      loading: 'Saving profile...',
      success: 'Welcome to Campus Marketplace! 🎉',
      error: 'Failed to save profile.',
    })

    try {
      const res = await promise
      if (res.success) {
        // Force session update so the guard sees the new data
        await update()
        setTimeout(() => {
          router.push("/products")
        }, 1500)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="px-8 py-6 bg-yellow-400 text-gray-900 text-center">
          <h1 className="text-2xl font-extrabold">Complete Your Profile</h1>
          <p className="text-sm font-medium text-gray-800 mt-2">Just a few more details to join the marketplace.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input 
              name="phoneNumber"
              required 
              type="tel" 
              placeholder="+91 9876543210"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
            <input 
              name="department"
              required 
              type="text" 
              placeholder="e.g. Computer Science"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <input 
                name="course"
                type="text" 
                placeholder="e.g. B.Tech"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <input 
                name="semester"
                type="number" 
                min="1"
                max="10"
                placeholder="e.g. 5"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University / College</label>
            <input 
              name="university"
              type="text" 
              placeholder="Central University of Kerala"
              defaultValue="Central University of Kerala"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="pt-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Start Exploring"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
