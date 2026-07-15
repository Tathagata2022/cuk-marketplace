"use client"

import { signIn } from "next-auth/react"
import { motion } from "framer-motion"

export default function WelcomeGate() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden px-4">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-emerald-50/50 blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="clean-card rounded-[2rem] p-8 sm:p-12 text-center relative overflow-hidden bg-white">
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-blue-50 border border-blue-100 shadow-sm rounded-3xl flex items-center justify-center mb-8 rotate-3"
          >
            <span className="text-4xl sm:text-5xl">🎓</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            CUK <span className="text-blue-600">Marketplace</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-500 font-medium mb-10 leading-relaxed max-w-[280px] mx-auto">
            The exclusive platform for students to buy, sell, and trade.
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn("google")}
            className="w-full bg-white border border-gray-200 text-gray-800 font-bold py-4 sm:py-5 px-6 rounded-2xl flex items-center justify-center gap-3 text-lg sm:text-xl transition-all hover:bg-gray-50 hover:shadow-md shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 sm:w-7 sm:h-7" alt="Google" />
            Continue with Google
          </motion.button>
          
          <p className="mt-6 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Requires @cukerala.ac.in
          </p>
        </div>
      </motion.div>
    </div>
  )
}
