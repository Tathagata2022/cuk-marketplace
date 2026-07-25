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
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-8">
          
          {/* Branding Left - IEDC & CUK */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Initiated & Supported By</span>
            <div className="flex items-center gap-6">
              
              {/* CUK Logo */}
              <a 
                href="https://www.cukerala.ac.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:border-blue-200 group-hover:shadow-xl group-hover:shadow-blue-600/10 transition-all p-2">
                  <img 
                    src="/cuk_logo.png" 
                    alt="CUK Logo" 
                    className="w-full h-full object-contain mix-blend-multiply"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-blue-600 transition-colors">CU Kerala</h3>
              </a>

              <div className="w-px h-12 bg-gray-200"></div>

              {/* IEDC Logo */}
              <a 
                href="https://iedc-cuk.web.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:border-blue-200 group-hover:shadow-xl group-hover:shadow-blue-600/10 transition-all p-3">
                  <img 
                    src="https://iedc-cuk.web.app/iedc_logo.png" 
                    alt="IEDC Logo" 
                    className="w-full h-full object-contain mix-blend-multiply"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-blue-600 transition-colors">IEDC</h3>
              </a>

            </div>
          </div>

          <div className="hidden md:block w-px h-20 bg-gray-100"></div>

          {/* Developer Right - Normal Size */}
          <div className="flex flex-col items-center md:items-end gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Developed By</span>
            <a
              href="https://www.linkedin.com/in/tathagata-mandal-453863225/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col md:flex-row items-center gap-3 hover:-translate-y-0.5 transition-transform duration-300 text-center md:text-right bg-emerald-50/50 px-4 py-2.5 rounded-xl border border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-md"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                <span className="text-lg">👨‍💻</span>
              </div>
              <div className="text-left md:text-right">
                <h3 className="text-sm font-black text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors">Tathagata Mandal</h3>
              </div>
            </a>
          </div>

        </div>
        
        <div className="w-full h-px bg-gray-100 my-8"></div>
        
        <div className="flex items-center justify-center text-xs font-bold text-gray-400">
          <p>&copy; {new Date().getFullYear()} CUK Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
