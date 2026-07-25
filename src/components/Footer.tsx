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
    <footer className={`w-full py-8 px-6 border-t border-gray-200 bg-white mt-auto ${isAuth ? 'pb-28 md:pb-8' : ''}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* IEDC Credit */}
        <div className="flex items-center gap-2.5 text-sm font-medium text-gray-500">
          <span>Initiated By</span>
          <a 
            href="https://iedc-cuk.web.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-900 font-bold hover:text-blue-600 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50"
          >
            <img 
              src="https://iedc-cuk.web.app/iedc_logo.png" 
              alt="IEDC" 
              className="w-5 h-5 object-contain mix-blend-multiply"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            IEDC CUK
          </a>
        </div>
        
        {/* Developer Credit */}
        <div className="flex items-center gap-2.5 text-sm font-medium text-gray-500">
          <span>Developed By</span>
          <a
            href="https://www.linkedin.com/in/tathagata-mandal-453863225/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 font-bold hover:text-emerald-600 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50"
          >
            Tathagata Mandal
          </a>
        </div>

      </div>
    </footer>
  )
}
