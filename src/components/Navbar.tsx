"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Location */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="text-2xl sm:text-3xl font-black tracking-tight transition-transform group-hover:scale-105">
                <span className="text-neon-yellow">CUK</span>
                <span className="text-neon-green ml-1">Marketplace</span>
              </div>
            </Link>
            
            <div className="hidden md:flex flex-col border-l border-white/10 pl-6">
              <span className="text-[10px] font-black text-white/50 tracking-widest uppercase">University Campus</span>
              <span className="text-sm text-gray-300 font-medium truncate max-w-[200px]">Central University of Kerala</span>
            </div>
          </div>

          {/* Search Bar - Visual only for now */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="w-full relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500 group-focus-within:text-neon-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search for books, electronics, cycles..." 
                className="w-full bg-[#111111] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-neon-green focus:border-neon-green transition-all placeholder:text-gray-600 text-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              href="/sell" 
              className="hidden sm:flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222222] text-neon-green font-bold px-6 py-2.5 rounded-full border border-neon-green/30 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              SELL
            </Link>

            {status === "loading" ? (
              <div className="w-10 h-10 bg-white/5 rounded-full animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 hover:bg-white/5 p-1.5 sm:p-2 rounded-xl transition-all border border-transparent hover:border-white/10"
                >
                  <div className="text-left hidden sm:block pr-2">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Account</div>
                    <div className="text-sm font-bold text-white truncate max-w-[100px] leading-tight">{session.user?.name?.split(' ')[0]}</div>
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-[#111111] border-2 border-white/10 flex-shrink-0">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#111111] text-neon-yellow font-bold">
                        {session.user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#111111] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/5 mb-2 bg-[#1a1a1a]">
                      <p className="text-sm font-bold text-white">{session.user?.name}</p>
                      {/* @ts-ignore */}
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{session.user?.department || "Setup pending"}</p>
                    </div>
                    <Link onClick={() => setMenuOpen(false)} href="/profile" className="block px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                      My Dashboard
                    </Link>
                    <Link onClick={() => setMenuOpen(false)} href="/sell" className="block sm:hidden px-5 py-2.5 text-sm text-neon-green font-bold hover:bg-white/5 transition-colors">
                      Sell an Item
                    </Link>
                    
                    {/* Only show Admin link if they are actually an ADMIN */}
                    {/* @ts-ignore */}
                    {session?.user?.role === "ADMIN" && (
                      <Link 
                        onClick={() => setMenuOpen(false)} 
                        href="/admin" 
                        className="block px-5 py-2.5 text-sm font-bold text-red-500 hover:bg-white/5 transition-colors border-b border-white/5"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <div className="border-t border-white/5 mt-2 pt-2">
                      <button 
                        onClick={() => signOut()}
                        className="w-full text-left px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => signIn("google")}
                className="text-sm font-bold text-white hover:text-neon-green px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
              >
                Login
              </button>
            )}

            {/* Cart Button */}
            <Link 
              href="/profile"
              className="bg-white text-black hover:bg-gray-200 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 hover:-translate-y-0.5 ml-1 sm:ml-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">My Items</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
