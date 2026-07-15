"use client"

import Link from "next/link"
import { useSession, signOut, signIn } from "next-auth/react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all shadow-md shadow-blue-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
              CUK Marketplace
            </span>
          </Link>

          {/* Desktop Navigation */}
          {status === "authenticated" ? (
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Feed</Link>
              <Link href="/profile" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Profile</Link>
              <Link href="/sell" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 flex items-center gap-2 transform hover:-translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Sell Item
              </Link>

              <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                <Link href="/profile" className="flex items-center gap-3 group">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-gray-900 leading-none group-hover:text-blue-600 transition-colors">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{session.user?.email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100 group-hover:border-blue-200 transition-colors">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="User profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 bg-gray-100">
                        {session.user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Sign Out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          ) : status !== "loading" ? (
             <div className="hidden md:flex items-center gap-4">
                <button 
                  onClick={() => signIn("google")}
                  className="text-sm font-bold text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Login
                </button>
             </div>
          ) : null}

          {/* Mobile Menu Button */}
          {status === "authenticated" && (
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {menuOpen && status === "authenticated" && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden shadow-xl absolute w-full"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-white shadow-sm">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="User profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">
                      {session.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900 leading-tight">{session.user?.name}</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">{session.user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href="/" 
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Feed
                </Link>
                <Link 
                  href="/profile" 
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
              </div>

              <Link 
                href="/sell" 
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-md shadow-blue-600/20 active:scale-95 transition-transform"
              >
                + Create New Listing
              </Link>
              
              <button 
                onClick={() => signOut()}
                className="w-full py-4 text-red-600 font-bold bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
