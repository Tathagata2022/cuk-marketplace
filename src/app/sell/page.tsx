"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { createProduct } from "../actions/product"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

import Navbar from "@/components/Navbar"

export default function SellPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
      </div>
    }>
      <SellForm />
    </Suspense>
  )
}

function SellForm() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  
  const defaultCategory = searchParams.get("category") || "📚 Books & Study Materials"

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
        <p className="mt-4 text-blue-600 font-bold tracking-widest uppercase text-sm animate-pulse">Loading...</p>
      </div>
    )
  }
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-gray-100 shadow-xl">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">You must be logged in to list products on the marketplace.</p>
          <button 
            onClick={() => router.push("/")}
            className="w-full inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
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
    
    const imageFiles = formData.getAll("imageFile") as File[];
    const validFiles = imageFiles.filter(f => f.size > 0).slice(0, 5);
    
    if (validFiles.length > 0) {
      try {
        const urls: string[] = [];
        for (const file of validFiles) {
          const imgFormData = new FormData();
          imgFormData.append("image", file);
          
          const res = await fetch(`https://api.imgbb.com/1/upload?key=e26954b517978c1538c01f4d536983be`, {
            method: "POST",
            body: imgFormData
          });
          
          const data = await res.json();
          if (!data.success) {
            console.error("ImgBB Error:", data);
            throw new Error(data.error?.message || "Upload failed for one image");
          }
          urls.push(data.data.url);
          // Wait 500ms between uploads to prevent rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        formData.set("imageUrl", JSON.stringify(urls));
      } catch (error: any) {
        toast.error(`Image upload error: ${error.message}`);
        setLoading(false);
        return;
      }
    }
    
    // CRITICAL: Delete the actual image files from the form data so we don't send them to the server action!
    // Next.js Server Actions have a 1MB payload limit, sending raw images will cause a 413 Payload Too Large error.
    formData.delete("imageFile");
    
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
    <div className="min-h-screen bg-gray-50 flex flex-col relative text-gray-900">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="max-w-2xl w-full bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden"
          >
            <div className="px-6 sm:px-12 py-8 sm:py-10 relative z-10 text-center sm:text-left border-b border-gray-100 bg-gray-50/50">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Create a Listing
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-2">Reach hundreds of students on campus instantly.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 sm:px-12 py-8 sm:py-10 space-y-6 relative z-10 bg-white">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest pl-2">Title</label>
                <input 
                  name="title"
                  required 
                  type="text" 
                  placeholder="E.g. MacBook Air M1, Like New"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest pl-2">Description</label>
                <textarea 
                  name="description"
                  required 
                  rows={4}
                  placeholder="Describe the condition, age, accessories included, and reason for selling..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest pl-2">Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                    <input 
                      name="price"
                      required 
                      type="number" 
                      min="0"
                      placeholder="0"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-5 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 font-black"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest pl-2">Category</label>
                  <select 
                    name="category"
                    required
                    defaultValue={defaultCategory}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                  >
                    <option value="📚 Books & Study Materials">📚 Books & Study Materials</option>
                    <option value="💻 Electronics">💻 Electronics</option>
                    <option value="📱 Gadgets & Accessories">📱 Gadgets & Accessories</option>
                    <option value="🪑 Furniture & Home Essentials">🪑 Furniture & Home Essentials</option>
                    <option value="🧹 Cleaning & Household Utilities">🧹 Cleaning & Household Utilities</option>
                    <option value="🥼 Clothing & Academic Essentials">🥼 Clothing & Academic Essentials</option>
                    <option value="🏍️ 2-Wheelers">🏍️ 2-Wheelers</option>
                    <option value="🚗 Automobile Accessories">🚗 Automobile Accessories</option>
                    <option value="🏸 Sports & Fitness">🏸 Sports & Fitness</option>
                    <option value="🏠 Hostel & Daily Essentials">🏠 Hostel & Daily Essentials</option>
                    <option value="🎒 Bags & Luggage">🎒 Bags & Luggage</option>
                    <option value="🎮 Entertainment & Hobbies">🎮 Entertainment & Hobbies</option>
                    <option value="✨ Other">✨ Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest pl-2">Condition</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {['Brand New', 'Like New', 'Good', 'Fair', 'Poor'].map((cond) => (
                    <label key={cond} className="relative cursor-pointer group">
                      <input type="radio" name="condition" value={cond} className="peer sr-only" required defaultChecked={cond === 'Good'} />
                      <div className="text-center px-2 py-3 rounded-xl bg-gray-50 border border-gray-200 peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700 text-gray-500 font-bold text-sm transition-all shadow-sm">
                        {cond}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest pl-2">Product Images (Max 5)</label>
                <input 
                  name="imageFile"
                  type="file" 
                  accept="image/*"
                  multiple
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-[10px] font-bold text-gray-500 pl-2 pt-1 uppercase">Select up to 5 images (Max 32MB each)</p>
              </div>

              <div className="pt-6 flex flex-col-reverse sm:flex-row justify-end gap-4 border-t border-gray-100">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => router.back()}
                  className="px-8 py-3.5 bg-white rounded-xl text-gray-600 hover:text-gray-900 font-bold transition-colors border border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
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
