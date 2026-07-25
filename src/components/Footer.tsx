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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
          
          {/* Branding Left */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Initiated & Supported By</span>
            <a 
              href="https://iedc-cuk.web.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:border-blue-200 group-hover:shadow-xl group-hover:shadow-blue-600/10 transition-all">
                <img 
                  src="https://iedc-cuk.web.app/iedc_logo.png" 
                  alt="IEDC Logo" 
                  className="w-10 h-10 object-contain mix-blend-multiply"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-gray-900 leading-none mb-1.5 group-hover:text-blue-600 transition-colors">IEDC</h3>
                <p className="text-sm font-bold text-gray-500">Central University of Kerala</p>
              </div>
            </a>
          </div>

          <div className="hidden md:block w-px h-20 bg-gray-100"></div>

          {/* Developer Right */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Architected & Developed By</span>
            <a
              href="https://www.linkedin.com/in/tathagata-mandal-453863225/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center md:flex-row-reverse gap-4 hover:-translate-y-1 transition-transform duration-300 text-center md:text-right"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:border-emerald-300 group-hover:shadow-xl group-hover:shadow-emerald-600/10 transition-all">
                <span className="text-3xl">👨‍💻</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 leading-none mb-1.5 group-hover:text-emerald-600 transition-colors">Tathagata Mandal</h3>
                <p className="text-sm font-bold text-gray-500">Software Engineer</p>
              </div>
            </a>
          </div>

        </div>
        
        <div className="w-full h-px bg-gray-100 my-10 lg:my-12"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold text-gray-400">
          <p>&copy; {new Date().getFullYear()} CUK Marketplace. All rights reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <Link href="/" className="hover:text-gray-900 transition-colors">Platform Feed</Link>
            <Link href="/requests" className="hover:text-gray-900 transition-colors">Item Requests</Link>
            <Link href="/sell" className="hover:text-gray-900 transition-colors">Start Selling</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
