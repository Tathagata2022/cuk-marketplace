"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function WelcomeGate() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Top Navbar strictly for Admin Access */}
      <div className="absolute top-0 w-full p-6 flex justify-end z-20">
        <Link 
          href="/admin/login" 
          className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          Admin Login
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-12 text-center"
        >
          <div className="mb-8">
            <div className="text-4xl font-extrabold tracking-tight mb-2"><span className="text-yellow-500">CUK</span> <span className="text-green-600">Marketplace</span></div>
            <p className="text-gray-500 font-medium">Your exclusive campus commerce platform.</p>
          </div>

          <div className="space-y-4">
            {/* Log In Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("google")}
              className="w-full bg-white border-2 border-gray-200 text-gray-800 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm font-extrabold flex items-center justify-center gap-3 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
              </svg>
              Log In
            </motion.button>

            {/* Sign Up Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("google")}
              className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-colors shadow-md font-extrabold flex items-center justify-center gap-3 text-lg"
            >
              Sign Up
            </motion.button>
          </div>
          
          <div className="mt-8 text-xs text-gray-400 font-medium px-4">
            By continuing, you agree to our Terms of Service and Privacy Policy. Valid CUK email addresses only.
          </div>
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-yellow-400/10 skew-y-6 transform origin-top-left -z-0"></div>
      <div className="absolute bottom-0 right-0 w-full h-[40vh] bg-green-600/5 -skew-y-6 transform origin-bottom-right -z-0"></div>
    </div>
  )
}
