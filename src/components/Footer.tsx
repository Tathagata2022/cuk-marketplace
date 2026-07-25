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
    <footer className={`w-full py-6 px-4 bg-transparent mt-auto ${isAuth ? 'pb-24 md:pb-6' : 'pb-6'}`}>
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2 text-center opacity-70 hover:opacity-100 transition-opacity">
        
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
          <span>Initiated By</span>
          <a 
            href="https://iedc-cuk.web.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-1.5"
          >
            <img 
              src="https://iedc-cuk.web.app/iedc_logo.png" 
              alt="IEDC" 
              className="w-3.5 h-3.5 object-contain mix-blend-multiply"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            IEDC CUK
          </a>
          
          <span className="text-gray-300 mx-1">•</span>
          
          <span>Developed By</span>
          <a
            href="https://www.linkedin.com/in/tathagata-mandal-453863225/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
          >
            Tathagata Mandal
          </a>
        </div>

      </div>
    </footer>
  )
}
