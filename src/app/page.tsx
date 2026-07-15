import { prisma } from "@/lib/prisma"
import Navbar from "@/components/Navbar"
import WelcomeGate from "@/components/WelcomeGate"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import AnimatedProductCard from "@/components/AnimatedProductCard"

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return <WelcomeGate />
  }

  const params = await searchParams
  const currentCategory = params.category || "All"

  const whereClause = currentCategory !== "All" ? { category: currentCategory } : {}
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { seller: true }
  })

  const categories = ["All", "Electronics", "Textbooks", "Dorm", "Cycles", "Other"]

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col relative text-gray-900">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="relative bg-white rounded-[2.5rem] p-8 sm:p-12 mb-12 border border-gray-100 shadow-sm overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-400"></div>
          
          <div className="relative z-10">
            <div className="inline-block bg-blue-50 border border-blue-100 text-blue-600 px-4 py-1.5 rounded-full mb-6 text-xs font-bold uppercase tracking-widest">
              v2.0 Now Live
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-4 leading-tight">
              Curated Marketplace: <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Discover Unique Goods.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-8">
              The exclusive platform for students to buy, sell, and trade safely on campus.
            </p>
            <div className="flex justify-center">
              <a href="#feed" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-md shadow-blue-600/20 hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2">
                Explore Collections
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Categories & Feed */}
        <div id="feed" className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-28">
              <h2 className="text-sm font-bold text-gray-900 mb-4 px-2 uppercase tracking-widest">Featured Categories</h2>
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
                {categories.map(cat => (
                  <a 
                    key={cat} 
                    href={`/?category=${cat}`}
                    className={`whitespace-nowrap px-4 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-3 ${
                      currentCategory === cat 
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                        : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">
                {currentCategory === "All" ? "Latest Arrivals" : `${currentCategory} Collection`}
              </h2>
              <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{products.length} Items</span>
            </div>

            {products.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-[2rem] p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">There are currently no listings in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <AnimatedProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
