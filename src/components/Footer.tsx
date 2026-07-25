"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()

  // Hide footer in admin dashboard to keep it clean
  if (pathname?.startsWith("/admin")) return null

  return (
    <footer className="w-full py-8 px-4 border-t border-gray-100 bg-white/50 backdrop-blur-md pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
        
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          {/* IEDC Credit */}
          <Link 
            href="https://iedc-cuk.web.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors group"
          >
            <span className="text-xs font-bold uppercase tracking-widest">Initiated By</span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 group-hover:border-blue-200 transition-colors">
              <img 
                src="https://iedc-cuk.web.app/iedc_logo.png" 
                alt="IEDC CUK Logo" 
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  // Fallback if logo fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-sm font-black text-gray-900 group-hover:text-blue-600">IEDC CUK</span>
            </div>
          </Link>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300"></div>

          {/* Developer Credit */}
          <Link
            href="https://www.linkedin.com/in/tathagata-mandal-453863225/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors group"
          >
            <span className="text-xs font-bold uppercase tracking-widest">Developed By</span>
            <span className="text-sm font-black text-gray-900 group-hover:text-emerald-600 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 group-hover:border-emerald-200 transition-colors">
              Tathagata Mandal
            </span>
          </Link>
        </div>

        <p className="text-[10px] text-gray-400 font-medium">
          &copy; {new Date().getFullYear()} Central University of Kerala Marketplace. All rights reserved.
        </p>

      </div>
    </footer>
  )
}
