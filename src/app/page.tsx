import { getProducts } from "./actions/product"
import Navbar from "@/components/Navbar"
import AnimatedGridContainer from "@/components/AnimatedGridContainer"
import AnimatedProductCard from "@/components/AnimatedProductCard"
import WelcomeGate from "@/components/WelcomeGate"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return <WelcomeGate />
  }

  const products = await getProducts()

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden text-white">
      
      {/* Dark Mode Background Elements */}
      <div className="fixed inset-0 z-0 bg-grid-pattern pointer-events-none opacity-20"></div>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-neon-green/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-neon-yellow/5 blur-[150px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
          
          {/* Hero Banner Section (Midnight Neon) */}
          <div className="mb-10 sm:mb-16 rounded-[2rem] overflow-hidden dark-glass p-8 sm:p-14 relative flex items-center min-h-[250px] sm:min-h-[350px] group border border-white/10 shadow-2xl">
            {/* Spotlight Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green/20 to-neon-yellow/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
            
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block py-1.5 px-4 rounded-full bg-[#1a1a1a] border border-white/10 text-[10px] sm:text-xs font-black text-neon-yellow tracking-widest uppercase mb-4 sm:mb-6 shadow-sm">
                Next-Gen Campus Commerce
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight">
                Premium Goods.<br/>
                <span className="text-neon-green">Traded Instantly.</span>
              </h1>
              <p className="text-base sm:text-xl text-gray-400 font-medium max-w-xl leading-relaxed mb-8">
                The most advanced marketplace for CUK students. Secure, fast, and exclusively for you.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/sell"
                  className="inline-flex items-center justify-center bg-neon-green text-black font-black px-8 py-4 rounded-2xl hover:bg-neon-yellow transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                >
                  Start Selling
                </Link>
                <Link 
                  href="#trending"
                  className="inline-flex items-center justify-center bg-[#111111] text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#1a1a1a] hover:border-white/20 transition-all border border-white/10 shadow-sm"
                >
                  Browse Items
                </Link>
              </div>
            </div>
            
            {/* Minimal abstract graphic */}
            <div className="hidden lg:block absolute right-12 top-1/2 transform -translate-y-1/2 opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 border-[4px] border-neon-green/20 rounded-[3rem] transform rotate-12 transition-transform group-hover:rotate-6 duration-1000"></div>
                <div className="absolute inset-4 border-[2px] border-neon-yellow/30 rounded-[2rem] transform -rotate-6 transition-transform group-hover:rotate-0 duration-1000"></div>
              </div>
            </div>
          </div>

          {/* Categories / Filters */}
          <div className="flex gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide snap-x">
            {['All Items', 'Textbooks', 'Electronics', 'Dorm', 'Jobs', 'Other'].map((cat, i) => (
              <button key={cat} className={`snap-center flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${i === 0 ? 'bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'bg-[#111111] hover:bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5 hover:border-white/20'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div id="trending" className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-neon-yellow rounded-full"></span>
              Trending near you
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 dark-glass rounded-[2rem]">
              <div className="w-16 h-16 bg-[#111111] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No products available</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">The marketplace is currently empty. Be the first to list an item and reach hundreds of students!</p>
              <Link 
                href="/sell"
                className="inline-flex bg-neon-green text-black px-8 py-3 rounded-xl font-black transition-transform hover:scale-105 shadow-[0_0_15px_rgba(57,255,20,0.2)]"
              >
                List an Item
              </Link>
            </div>
          ) : (
            <AnimatedGridContainer>
              {products.map((product: any) => (
                <AnimatedProductCard key={product.id} product={product} />
              ))}
            </AnimatedGridContainer>
          )}
        </main>
      </div>
    </div>
  )
}
