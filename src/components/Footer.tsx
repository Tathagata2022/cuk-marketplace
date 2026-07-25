"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

export default function Footer() {
  const pathname = usePathname()
  const { status } = useSession()

  // Hide footer in admin dashboard to keep it clean
  if (pathname?.startsWith("/admin")) return null

  // Add extra padding at the bottom only if authenticated (because BottomNav shows up)
  const isAuth = status === "authenticated"

  return (
    <footer className={`w-full mt-auto bg-white border-t border-gray-100 ${isAuth ? 'pb-24 md:pb-0' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-col items-center justify-center gap-6">
          
          {/* Branding - Unified IEDC & CUK */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Initiated & Supported By</span>
            
            <a 
              href="https://iedc-cuk.web.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col md:flex-row items-center gap-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-100 group-hover:border-blue-200 group-hover:shadow-xl group-hover:shadow-blue-600/10 transition-all">
                {/* CUK Logo */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center p-1">
                  <img 
                    src="/cuk_logo.png" 
                    alt="CUK Logo" 
                    className="w-full h-full object-contain mix-blend-multiply"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                
                {/* IEDC Logo */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center p-1">
                  <img 
                    src="https://iedc-cuk.web.app/iedc_logo.png" 
                    alt="IEDC Logo" 
                    className="w-full h-full object-contain mix-blend-multiply"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              </div>

              <div className="text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1 group-hover:text-blue-600 transition-colors">IEDC CUK</h3>
                <p className="text-xs sm:text-sm font-bold text-gray-500">Central University of Kerala</p>
              </div>
            </a>
          </div>

        </div>
        
        <div className="w-full h-px bg-gray-100 my-8"></div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-400">
          <p>&copy; {new Date().getFullYear()} CUK Marketplace. All rights reserved.</p>
          <p>
            Developed by{' '}
            <a 
              href="https://www.linkedin.com/in/tathagata-mandal-453863225/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Tathagata Mandal
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
