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
    <div className="min-h-screen flex flex-col relative bg-[#f8f9fa] overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-300/30 blur-[80px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-300/20 blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          
          {/* Hero Banner Section (Glassmorphic) */}
          <div className="mb-12 rounded-[2rem] overflow-hidden glass-card p-8 sm:p-12 relative flex items-center min-h-[300px]">
            <div className="relative z-10 max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-[1.1]">
                Your Campus <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-500">Marketplace</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg font-medium mb-8 leading-relaxed max-w-md">
                Buy, sell, and trade directly with students on campus. Zero delivery fees, infinite convenience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/sell"
                  className="inline-flex items-center justify-center bg-gray-900 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-900/20"
                >
                  Start Selling
                </Link>
                <Link 
                  href="#trending"
                  className="inline-flex items-center justify-center bg-white/50 backdrop-blur-md text-gray-900 font-semibold px-8 py-4 rounded-2xl hover:bg-white/80 transition-all border border-gray-200 shadow-sm"
                >
                  Browse Items
                </Link>
              </div>
            </div>
            {/* Minimal abstract graphic */}
            <div className="hidden lg:block absolute right-12 top-1/2 transform -translate-y-1/2">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 to-green-500/40 rounded-3xl backdrop-blur-xl border border-white/50 shadow-2xl transform rotate-12 transition-transform hover:rotate-6 duration-500"></div>
                <div className="absolute inset-4 bg-white/60 rounded-2xl backdrop-blur-md border border-white/80 shadow-inner transform -rotate-6 transition-transform hover:rotate-0 duration-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-900/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Categories / Filters (Glassmorphic) */}
          <div className="flex gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide snap-x">
            {['All Items', 'Textbooks', 'Electronics', 'Dorm', 'Jobs', 'Other'].map((cat, i) => (
              <button key={cat} className={`snap-center flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${i === 0 ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'glass hover:bg-white/90 text-gray-700 hover:shadow-md'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div id="trending" className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Trending near you</h2>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 glass-card rounded-[2rem] border border-white">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">The marketplace is currently empty. Be the first to list an item and reach hundreds of students!</p>
              <Link 
                href="/sell"
                className="inline-flex bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold transition-transform hover:scale-105 shadow-lg"
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
