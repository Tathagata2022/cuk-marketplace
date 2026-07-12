import { getProducts } from "../actions/product"
import Link from "next/link"
import AnimatedGridContainer from "@/components/AnimatedGridContainer"
import AnimatedProductCard from "@/components/AnimatedProductCard"

export const dynamic = "force-dynamic"

export default async function ProductsFeed() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm mb-8 sticky top-0 z-50">
        <Link href="/" className="text-2xl font-bold tracking-tight text-blue-600 transition-colors hover:text-blue-700">
          Campus Marketplace
        </Link>
        <Link 
          href="/sell"
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-transform hover:scale-105 active:scale-95 shadow-sm"
        >
          Sell an Item
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Marketplace</h1>
            <p className="text-gray-500 mt-1">Discover items from students across campus.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm animate-in fade-in duration-500">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-6">Be the first to list an item on the campus marketplace!</p>
            <Link 
              href="/sell"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors hover:shadow-md"
            >
              Start Selling
            </Link>
          </div>
        ) : (
          <AnimatedGridContainer>
            {products.map((product) => (
              <AnimatedProductCard key={product.id} product={product} />
            ))}
          </AnimatedGridContainer>
        )}
      </main>
    </div>
  )
}
