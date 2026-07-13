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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col relative overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-300/30 blur-[80px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-300/20 blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/" className="inline-block mb-8 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full w-fit shadow-sm border border-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to feed
          </Link>

          <div className="glass-card rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white overflow-hidden flex flex-col md:flex-row p-2">
            <div className="md:w-1/2 bg-white/50 rounded-[2rem] p-10 min-h-[400px] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100/40 to-green-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src={product.images || 'https://via.placeholder.com/600x600?text=No+Image'}
                alt={product.title}
                className="w-full h-full object-contain max-h-[500px] mix-blend-multiply drop-shadow-md transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="md:w-1/2 p-8 sm:p-12 flex flex-col relative">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-white/80 backdrop-blur-md border border-white text-gray-800 shadow-sm px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest">
                  {product.category}
                </span>
                <span className="text-xs font-bold text-gray-400 bg-white/40 px-3 py-1 rounded-full">
                  Listed {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-[1.15] tracking-tight">{product.title}</h1>

              <div className="flex items-end gap-4 mb-10">
                <p className="text-5xl font-black text-gray-900 leading-none tracking-tight">₹{product.price.toLocaleString('en-IN')}</p>
                <span className="text-lg font-bold text-gray-400 line-through mb-1">₹{Math.floor(product.price * 1.2)}</span>
              </div>

              <div className="mb-10 flex-grow">
                <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">Product Details</h3>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line font-medium">{product.description}</p>
              </div>

              <div className="glass rounded-[1.5rem] p-6 mb-10 grid grid-cols-2 gap-6 border border-white/60 shadow-inner">
                <div>
                  <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1.5">Condition</span>
                  <span className="text-sm font-bold text-gray-900 bg-white/60 px-3 py-1 rounded-md">{product.condition}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1.5">Seller</span>
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white shadow-sm overflow-hidden flex-shrink-0">
                      {product.seller.image ? (
                        <img src={product.seller.image} alt={product.seller.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-600 bg-gray-100">
                          {product.seller.name?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                    <span className="truncate max-w-[120px]">{product.seller.name}</span>
                  </span>
                </div>
              </div>

              <div className="mt-auto">
                {isOwner ? (
                  <div className="bg-yellow-400/20 backdrop-blur-md text-yellow-900 p-5 rounded-2xl text-center font-bold border border-yellow-400/30 shadow-sm">
                    This is your active listing.
                  </div>
                ) : success ? (
                  <div className="bg-green-500/10 backdrop-blur-md border border-green-500/20 text-green-900 p-6 rounded-2xl text-center shadow-sm">
                    <h4 className="text-lg font-extrabold mb-1">
                      {success === "PAID" ? "Payment Successful! 🎉" : "Interest Registered! 🎉"}
                    </h4>
                    <p className="text-sm font-medium opacity-80">Our admins have been notified and will coordinate delivery shortly.</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleExpressInterest}
                      disabled={actionLoading}
                      className="flex-1 bg-white/60 backdrop-blur-md text-gray-900 border border-white shadow-sm py-4 px-6 rounded-2xl font-bold text-base hover:bg-white transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {actionLoading ? "Processing..." : "WISH TO BUY"}
                    </button>
                    <button
                      onClick={handlePayNow}
                      disabled={actionLoading}
                      className="flex-1 bg-gray-900 text-white py-4 px-6 rounded-2xl font-black text-base shadow-xl shadow-gray-900/20 hover:shadow-gray-900/30 transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {actionLoading ? "Processing..." : "PAY NOW"}
                    </button>
                  </div>
                )}
                {!isOwner && !success && (
                  <p className="text-center text-[11px] font-bold text-gray-500 mt-5 flex items-center justify-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
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
    </div>
  )
}
