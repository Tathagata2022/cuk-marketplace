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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-neon-green/20 border-t-neon-green animate-spin"></div>
          <p className="mt-4 text-neon-green font-bold tracking-widest uppercase text-sm animate-pulse">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8 dark-glass rounded-2xl border border-white/10">
            <h2 className="text-2xl font-black text-white mb-2">Product Not Found</h2>
            <p className="text-gray-400 mb-6">This listing may have been removed or no longer exists.</p>
            <Link href="/" className="inline-block bg-[#111111] text-neon-yellow border border-neon-yellow/30 px-6 py-2 rounded-xl font-bold hover:bg-[#222222] transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isOwner = session?.user && (session.user as any).id === product.sellerId

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden text-white">
      {/* Dark Mode Background Elements */}
      <div className="fixed inset-0 z-0 bg-grid-pattern pointer-events-none opacity-20"></div>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-neon-green/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-neon-yellow/5 blur-[150px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <Link href="/" className="inline-flex mb-8 text-sm font-bold text-gray-400 hover:text-white transition-colors items-center gap-2 bg-[#111111] px-4 py-2 rounded-full w-fit shadow-sm border border-white/10 hover:border-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to feed
          </Link>

          <div className="dark-glass rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row relative">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-green to-neon-yellow z-20"></div>

            <div className="md:w-1/2 bg-[#111111] p-10 min-h-[300px] sm:min-h-[400px] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-neon-green/10 to-neon-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              <img
                src={product.images || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.title)}&background=111111&color=39FF14&size=600`}
                alt={product.title}
                className="w-full h-full object-contain max-h-[500px] transition-transform duration-700 group-hover:scale-105 drop-shadow-xl"
              />
            </div>

            <div className="md:w-1/2 p-6 sm:p-12 flex flex-col relative z-10 bg-black/40 backdrop-blur-xl">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-[#111111] border border-white/10 text-gray-300 shadow-sm px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest">
                  {product.category}
                </span>
                <span className="text-xs font-bold text-gray-500 bg-[#111111] border border-white/5 px-3 py-1.5 rounded-full">
                  Listed {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">{product.title}</h1>

              <div className="flex items-end gap-4 mb-10">
                <p className="text-5xl font-black text-neon-yellow leading-none tracking-tight drop-shadow-[0_0_15px_rgba(255,255,0,0.2)]">₹{product.price.toLocaleString('en-IN')}</p>
              </div>

              <div className="mb-10 flex-grow">
                <h3 className="text-xs font-extrabold text-neon-green uppercase tracking-widest mb-3">Product Details</h3>
                <p className="text-base sm:text-lg text-gray-400 leading-relaxed whitespace-pre-line font-medium">{product.description}</p>
              </div>

              <div className="bg-[#111111] rounded-2xl p-6 mb-10 grid grid-cols-2 gap-6 border border-white/10 shadow-inner">
                <div>
                  <span className="block text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-1.5">Condition</span>
                  <span className="text-sm font-bold text-white bg-black px-3 py-1.5 rounded-lg border border-white/5">{product.condition}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-1.5">Seller</span>
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#111111] border-[2px] border-neon-green shadow-[0_0_10px_rgba(57,255,20,0.2)] overflow-hidden flex-shrink-0">
                      {product.seller.image ? (
                        <img src={product.seller.image} alt={product.seller.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[12px] font-black text-neon-green">
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
                  <div className="bg-[#1a1a1a] border border-white/10 text-gray-400 p-5 rounded-2xl text-center font-bold shadow-sm">
                    This is your active listing.
                  </div>
                ) : success ? (
                  <div className="bg-[#1a1a1a] border border-neon-green/30 text-neon-green p-6 rounded-2xl text-center shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                    <h4 className="text-lg font-black mb-1">
                      {success === "PAID" ? "Payment Successful! 🎉" : "Interest Registered! 🎉"}
                    </h4>
                    <p className="text-sm font-medium text-gray-400">Our admins have been notified and will coordinate delivery shortly.</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleExpressInterest}
                      disabled={actionLoading}
                      className="flex-1 bg-[#111111] border border-white/20 hover:border-white/40 text-white shadow-sm py-4 px-6 rounded-2xl font-bold text-base transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {actionLoading ? "Processing..." : "WISH TO BUY"}
                    </button>
                    <button
                      onClick={handlePayNow}
                      disabled={actionLoading}
                      className="flex-1 bg-neon-green text-black py-4 px-6 rounded-2xl font-black text-base shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {actionLoading ? "Processing..." : "PAY NOW"}
                    </button>
                  </div>
                )}
                {!isOwner && !success && (
                  <p className="text-center text-[11px] font-bold text-gray-500 mt-5 flex items-center justify-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-yellow" viewBox="0 0 20 20" fill="currentColor">
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
