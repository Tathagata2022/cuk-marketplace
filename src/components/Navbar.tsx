"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-3xl font-extrabold tracking-tight"><span className="text-yellow-500">CUK</span> <span className="text-green-600">Marketplace</span></div>
            </Link>
            
            <div className="hidden md:flex flex-col border-l border-gray-200 pl-6">
              <span className="text-xs font-bold text-gray-800">Delivery in 10 minutes</span>
              <span className="text-sm text-gray-500 truncate max-w-[200px]">Central University of Kerala, Kasaragod</span>
            </div>
          </div>

          {/* Search Bar - Visual only for now */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search for books, electronics, cycles..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/sell" 
              className="hidden sm:flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold px-6 py-2.5 rounded-full shadow-sm border-2 border-yellow-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              SELL
            </Link>

            {status === "loading" ? (
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 hover:bg-gray-50 p-1 sm:p-2 rounded-lg transition-colors"
                >
                  <div className="text-left hidden sm:block">
                    <div className="text-xs text-gray-500">My Account</div>
                    <div className="text-sm font-bold text-gray-800 truncate max-w-[100px]">{session.user?.name?.split(' ')[0]}</div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-50 mb-2">
                      <p className="text-sm font-bold text-gray-900">{session.user?.name}</p>
                      {/* @ts-ignore */}
                      <p className="text-xs text-gray-500">{session.user?.department || "Setup pending"}</p>
                    </div>
                    <Link onClick={() => setMenuOpen(false)} href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                      My Dashboard
                    </Link>
                    <Link onClick={() => setMenuOpen(false)} href="/sell" className="block sm:hidden px-4 py-2 text-sm text-green-600 hover:bg-green-50 font-bold">
                      Sell an Item
                    </Link>
                    
                    {/* Always show Admin link so they can navigate to it */}
                    <Link onClick={() => setMenuOpen(false)} href="/admin/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-bold border-b border-gray-100 text-red-600">
                      {/* @ts-ignore */}
                      {session?.user?.role === "ADMIN" ? "Admin Dashboard" : "Admin Login"}
                    </Link>
                    
                    <div className="border-t border-gray-50 mt-2 pt-2">
                      <button 
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 font-medium"
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
                className="text-sm font-bold text-gray-800 hover:text-green-600 px-2 transition-colors"
              >
                Login
              </button>
            )}

            {/* Cart Button (Visual) */}
            <Link 
              href="/profile"
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">My Items</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
