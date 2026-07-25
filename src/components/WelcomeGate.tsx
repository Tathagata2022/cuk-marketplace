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

      {/* Footer Branding for Welcome Page */}
      <div className="w-full max-w-6xl mx-auto p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto relative z-10">
        <a 
          href="https://iedc-cuk.web.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-2 group-hover:border-blue-200 transition-colors">
            <img 
              src="https://iedc-cuk.web.app/iedc_logo.png" 
              alt="IEDC Logo" 
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Initiated By</p>
            <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">IEDC CUK</p>
          </div>
        </a>

        <a 
          href="https://www.linkedin.com/in/tathagata-mandal-453863225/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 group"
        >
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Developed By</p>
            <p className="text-sm font-black text-gray-900 group-hover:text-emerald-600 transition-colors">Tathagata Mandal</p>
          </div>
        </a>
      </div>
    </div>
  )
}
