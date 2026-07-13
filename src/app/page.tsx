import { getProducts } from "./actions/product"
import Navbar from "@/components/Navbar"
import AnimatedGridContainer from "@/components/AnimatedGridContainer"
import AnimatedProductCard from "@/components/AnimatedProductCard"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {/* Banner Section */}
        <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-300 p-6 sm:p-10 shadow-sm relative">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              Campus Essentials,<br/>Delivered in Minutes.
            </h1>
            <p className="text-gray-800 text-sm sm:text-base font-medium mb-6">
              Buy and sell directly with students on campus. Zero delivery fees, infinite convenience.
            </p>
            <Link 
              href="/sell"
              className="inline-block bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors shadow-md"
            >
              Start Selling Now
            </Link>
          </div>
          {/* Decorative graphic */}
          <div className="absolute right-0 bottom-0 opacity-20 sm:opacity-100 transform translate-x-1/4 translate-y-1/4 pointer-events-none">
             <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Categories / Filters (Visual) */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {['All Items', 'Electronics', 'Books', 'Furniture', 'Cycles', 'Other'].map((cat, i) => (
            <button key={cat} className={`flex-shrink-0 px-5 py-2 rounded-xl text-sm font-bold transition-colors ${i === 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Trending near you</h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm animate-in fade-in duration-500">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-500 mb-6">Be the first to list an item on the campus marketplace!</p>
            <Link 
              href="/sell"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors hover:shadow-md"
            >
              Start Selling
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
  )
}
