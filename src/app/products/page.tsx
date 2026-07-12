import { getProducts } from "../actions/product"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function ProductsFeed() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm mb-8">
        <Link href="/" className="text-2xl font-bold tracking-tight text-blue-600">
          Campus Marketplace
        </Link>
        <Link 
          href="/sell"
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-6">Be the first to list an item on the campus marketplace!</p>
            <Link 
              href="/sell"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Start Selling
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={product.images} 
                    alt={product.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {product.category}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-900 truncate mb-1" title={product.title}>
                    {product.title}
                  </h3>
                  <p className="text-xl font-bold text-gray-900 mb-2">₹{product.price.toLocaleString('en-IN')}</p>
                  
                  <div className="mt-auto flex items-center pt-3 border-t border-gray-50">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-2 overflow-hidden">
                      {product.seller.image ? (
                        <img src={product.seller.image} alt="Seller" className="w-full h-full object-cover" />
                      ) : (
                        product.seller.name?.charAt(0) || "U"
                      )}
                    </div>
                    <span className="text-xs text-gray-500 truncate">{product.seller.name}</span>
                    <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      {product.condition}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
