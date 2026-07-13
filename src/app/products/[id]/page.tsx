"use client"

import { use, useState, useEffect } from "react"
import { getProductById, expressInterest, payForProduct } from "../../actions/product"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session } = useSession()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [success, setSuccess] = useState<"INTERESTED" | "PAID" | null>(null)

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
      if (res.success) setSuccess("INTERESTED")
    } catch (err) {
      console.error(err)
      alert("Failed to express interest.")
    } finally {
      setActionLoading(false)
    }
  }

  async function handlePayNow() {
    if (!session) {
      alert("Please login to pay")
      return
    }
    setActionLoading(true)
    try {
      const res = await payForProduct(resolvedParams.id)
      if (res.success) setSuccess("PAID")
    } catch (err) {
      console.error(err)
      alert("Payment failed.")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex flex-col"><Navbar /><div className="p-8 flex justify-center items-center flex-grow">Loading product...</div></div>
  if (!product) return <div className="min-h-screen bg-gray-50 flex flex-col"><Navbar /><div className="p-8 text-center text-red-500 flex-grow">Product not found.</div></div>

  const isOwner = session?.user && (session.user as any).id === product.sellerId

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-block mb-6 text-sm font-bold text-gray-500 hover:text-green-600 transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to feed
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-[#f8f9fa] p-8 min-h-[400px] flex items-center justify-center">
            <img
              src={product.images || 'https://via.placeholder.com/600x600?text=No+Image'}
              alt={product.title}
              className="w-full h-full object-contain max-h-[500px]"
            />
          </div>

          <div className="md:w-1/2 p-8 flex flex-col border-l border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide">
                {product.category}
              </span>
              <span className="text-xs font-bold text-gray-400">
                Listed {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 w-fit px-2 py-1 rounded mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              10 MINS DELIVERY
            </div>

            <div className="flex items-end gap-3 mb-8">
              <p className="text-4xl font-black text-gray-900 leading-none">₹{product.price.toLocaleString('en-IN')}</p>
              <span className="text-sm font-bold text-gray-400 line-through mb-1">₹{Math.floor(product.price * 1.2)}</span>
            </div>

            <div className="mb-8 flex-grow">
              <h3 className="text-[11px] font-extrabold text-gray-900 uppercase tracking-wider mb-2">Product Details</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-8 grid grid-cols-2 gap-4 border border-gray-100">
              <div>
                <span className="block text-[10px] text-gray-500 font-extrabold uppercase mb-1">Condition</span>
                <span className="text-sm font-bold text-gray-900">{product.condition}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 font-extrabold uppercase mb-1">Seller</span>
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-yellow-100 overflow-hidden flex-shrink-0">
                    {product.seller.image ? (
                      <img src={product.seller.image} alt={product.seller.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-yellow-700">
                        {product.seller.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <span className="truncate max-w-[100px]">{product.seller.name}</span>
                </span>
              </div>
            </div>

            <div className="mt-auto">
              {isOwner ? (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-center font-bold border border-yellow-200">
                  This is your listing.
                </div>
              ) : success ? (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center">
                  <h4 className="font-extrabold mb-1">
                    {success === "PAID" ? "Payment Successful! 🎉" : "Interest Registered! 🎉"}
                  </h4>
                  <p className="text-xs font-medium">Our admins have been notified and will coordinate delivery shortly.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleExpressInterest}
                    disabled={actionLoading}
                    className="w-full bg-white text-green-600 border-2 border-green-600 py-3 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors disabled:opacity-50 tracking-wide"
                  >
                    {actionLoading ? "Processing..." : "WISH TO BUY"}
                  </button>
                  <button
                    onClick={handlePayNow}
                    disabled={actionLoading}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-black text-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 tracking-wide"
                  >
                    {actionLoading ? "Processing..." : "PAY NOW"}
                  </button>
                </div>
              )}
              {!isOwner && !success && (
                <p className="text-center text-[10px] font-bold uppercase text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Escrow Managed Transaction
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
