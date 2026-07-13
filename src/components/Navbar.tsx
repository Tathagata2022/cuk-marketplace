"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="text-3xl font-extrabold tracking-tight transition-transform group-hover:scale-105">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">CUK</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500 ml-1">Marketplace</span>
              </div>
            </Link>
            
            <div className="hidden md:flex flex-col border-l border-gray-300 pl-6">
              <span className="text-xs font-bold text-gray-800 tracking-wide uppercase">University Campus</span>
              <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">Central University of Kerala</span>
            </div>
          </div>

          {/* Search Bar - Visual only for now */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="w-full relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search for books, electronics, cycles..." 
                className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-white shadow-inner transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/sell" 
              className="hidden sm:flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-2.5 rounded-full shadow-lg shadow-yellow-400/20 border border-yellow-300 transition-all hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              SELL
            </Link>

            {status === "loading" ? (
              <div className="w-10 h-10 bg-gray-200/50 rounded-full animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 hover:bg-white/50 p-1.5 sm:p-2 rounded-xl transition-all border border-transparent hover:border-white/50 hover:shadow-sm"
                >
                  <div className="text-left hidden sm:block pr-2">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Account</div>
                    <div className="text-sm font-bold text-gray-800 truncate max-w-[100px] leading-tight">{session.user?.name?.split(' ')[0]}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white border-2 border-white shadow-sm flex-shrink-0">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-yellow-100 text-yellow-600 font-bold">
                        {session.user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-64 glass-card rounded-2xl shadow-xl py-2 z-50 border border-white">
                    <div className="px-5 py-3 border-b border-gray-100/50 mb-2">
                      <p className="text-sm font-bold text-gray-900">{session.user?.name}</p>
                      {/* @ts-ignore */}
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{session.user?.department || "Setup pending"}</p>
                    </div>
                    <Link onClick={() => setMenuOpen(false)} href="/profile" className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-white/60 transition-colors">
                      My Dashboard
                    </Link>
                    <Link onClick={() => setMenuOpen(false)} href="/sell" className="block sm:hidden px-5 py-2.5 text-sm text-green-600 font-bold hover:bg-white/60 transition-colors">
                      Sell an Item
                    </Link>
                    
                    {/* Only show Admin link if they are actually an ADMIN */}
                    {/* @ts-ignore */}
                    {session?.user?.role === "ADMIN" && (
                      <Link 
                        onClick={() => setMenuOpen(false)} 
                        href="/admin" 
                        className="block px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-white/60 transition-colors border-b border-gray-100/50"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100/50 mt-2 pt-2">
                      <button 
                        onClick={() => signOut()}
                        className="w-full text-left px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-white/60 hover:text-gray-800 transition-colors"
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
                className="text-sm font-bold text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-white/50 transition-all"
              >
                Login
              </button>
            )}

            {/* Cart Button */}
            <Link 
              href="/profile"
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-gray-900/20 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
