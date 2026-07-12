"use client"

import { use, useState, useEffect } from "react"
import { getProductById, expressInterest } from "../../actions/product"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session } = useSession()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await getProductById(resolvedParams.id)
      setProduct(data)
      setLoading(false)
    }
    load()
  }, [resolvedParams.id])

  async function handleExpressInterest() {
    if (!session) {
      alert("Please login to express interest")
      return
    }
    setActionLoading(true)
    try {
      const res = await expressInterest(resolvedParams.id)
      if (res.success) {
        setSuccess(true)
      }
    } catch (err) {
      console.error(err)
      alert("Failed to express interest.")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen p-8 flex justify-center items-center">Loading product...</div>
  if (!product) return <div className="min-h-screen p-8 text-center text-red-500">Product not found.</div>

  const isOwner = session?.user && (session.user as any).id === product.sellerId

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm mb-8">
        <Link href="/products" className="text-2xl font-bold tracking-tight text-blue-600 flex items-center gap-2">
          <span className="text-xl">&larr;</span> Back to Feed
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gray-100 aspect-square md:aspect-auto min-h-[400px]">
            <img 
              src={product.images} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="md:w-1/2 p-8 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-sm text-gray-500">
                Posted {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-4xl font-extrabold text-gray-900 mb-6">₹{product.price.toLocaleString('en-IN')}</p>
            
            <div className="mb-8 flex-grow">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-gray-500 uppercase">Condition</span>
                <span className="font-medium text-gray-900">{product.condition}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase">Seller</span>
                <span className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                    {product.seller.image ? (
                      <img src={product.seller.image} alt={product.seller.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {product.seller.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  {product.seller.name}
                </span>
              </div>
            </div>
            
            <div className="mt-auto">
              {isOwner ? (
                <div className="bg-gray-100 text-gray-600 p-4 rounded-lg text-center font-medium border border-gray-200">
                  This is your listing.
                </div>
              ) : success ? (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-center">
                  <h4 className="font-bold mb-1">Interest Registered! 🎉</h4>
                  <p className="text-sm">Our admins have been notified and will contact you shortly to coordinate payment and delivery.</p>
                </div>
              ) : (
                <button
                  onClick={handleExpressInterest}
                  disabled={actionLoading}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {actionLoading ? "Processing..." : "I'm Interested"}
                </button>
              )}
              {!isOwner && !success && (
                <p className="text-center text-xs text-gray-500 mt-3">
                  Clicking this notifies admins. We act as an escrow to guarantee your safety.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
