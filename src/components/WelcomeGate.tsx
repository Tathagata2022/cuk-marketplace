"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function WelcomeGate() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col relative overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-400/20 blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-400/20 blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-blue-300/20 blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Top Navbar strictly for Admin Access */}
      <div className="absolute top-0 w-full p-6 flex justify-end z-20">
        <Link 
          href="/admin/login" 
          className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 glass px-5 py-2.5 rounded-full shadow-sm hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          Admin Portal
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="max-w-lg w-full glass-card rounded-[2.5rem] p-10 sm:p-14 text-center relative"
        >
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.8)] pointer-events-none"></div>

          <div className="mb-10 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-green-500 rounded-2xl mx-auto mb-6 shadow-xl flex items-center justify-center transform rotate-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white transform -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 text-gray-900 leading-tight">
              Welcome to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-500">CUK Market</span>
            </h1>
            <p className="text-base text-gray-500 font-medium px-4">Your exclusive campus commerce platform.</p>
          </div>

          <div className="space-y-4 relative z-10">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("google")}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl shadow-xl shadow-gray-900/20 font-bold flex items-center justify-center gap-3 text-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
              </svg>
              Continue with Google
            </motion.button>
          </div>
          
          <div className="mt-8 text-[11px] text-gray-400 font-medium px-6 relative z-10">
            By continuing, you agree to our Terms of Service and Privacy Policy. Valid CUK email addresses only.
          </div>
        </motion.div>
      </div>
    </div>
  )
}
