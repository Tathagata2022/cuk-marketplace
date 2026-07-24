"use client"

import { use, useState, useEffect } from "react"
import { getProductById, expressInterest, payForProduct, getRelatedProducts } from "../../actions/product"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import AnimatedProductCard from "@/components/AnimatedProductCard"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session } = useSession()
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [success, setSuccess] = useState<"INTERESTED" | "PAID" | null>(null)
  const [currentImgIndex, setCurrentImgIndex] = useState(0)

  let imagesArray: string[] = []
  if (product && product.images) {
    try {
      if (product.images.startsWith('[')) {
        imagesArray = JSON.parse(product.images)
      } else {
        imagesArray = [product.images]
      }
    } catch(e) {
      imagesArray = [product.images]
    }
  }

  useEffect(() => {
    async function load() {
      const data = await getProductById(resolvedParams.id)
      if (data) {
        setProduct(data)
        const related = await getRelatedProducts(data.category, data.id)
        setRelatedProducts(related)
      }
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          <p className="mt-4 text-blue-600 font-bold tracking-widest uppercase text-sm animate-pulse">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8 bg-white shadow-sm rounded-2xl border border-gray-100 max-w-sm w-full mx-4">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-500 mb-6">This listing may have been removed or no longer exists.</p>
            <Link href="/" className="inline-block bg-white text-gray-700 border border-gray-200 px-6 py-2 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isOwner = session?.user && (session.user as any).id === product.sellerId

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative text-gray-900">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <Link href="/" className="inline-flex mb-8 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors items-center gap-2 bg-white px-4 py-2 rounded-full w-fit shadow-sm border border-gray-200 hover:border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to feed
          </Link>

          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row relative">
            <div className="md:w-1/2 bg-gray-50 p-4 sm:p-10 min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden group border-b md:border-b-0 md:border-r border-gray-100">
              {imagesArray.length > 0 ? (
                <>
                  <div className="w-full flex-grow flex items-center justify-center relative mb-4">
                    <img
                      src={imagesArray[currentImgIndex]}
                      alt={product.title}
                      className="w-full h-full object-contain max-h-[400px] transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {imagesArray.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 px-2 w-full max-w-full z-20 relative justify-center">
                      {imagesArray.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImgIndex(idx)}
                          className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${currentImgIndex === idx ? 'border-blue-600 opacity-100 shadow-md scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                        >
                          <img src={img} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 opacity-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-medium text-lg">No Image Provided</p>
                </div>
              )}
            </div>

            <div className="md:w-1/2 p-6 sm:p-12 flex flex-col relative z-10 bg-white">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-blue-50 text-blue-700 border border-blue-100 shadow-sm px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest">
                  {product.category}
                </span>
                <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                  Listed {new Date(product.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert("Link copied to clipboard!")
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ml-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight flex flex-wrap items-center gap-3">
                {product.title}
                {product.isVerified && (
                  <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 flex items-center gap-1.5 shrink-0 align-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    VERIFIED
                  </span>
                )}
              </h1>

              <div className="flex items-end gap-4 mb-10">
                <p className="text-5xl font-black text-gray-900 leading-none tracking-tight">₹{product.price.toLocaleString('en-IN')}</p>
              </div>

              <div className="mb-10 flex-grow">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Product Details</h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed whitespace-pre-line font-medium">{product.description}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-10 grid grid-cols-2 gap-6 border border-gray-100 shadow-sm">
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">Condition</span>
                  <span className="text-sm font-bold text-gray-800 bg-white px-3 py-1.5 rounded-lg border border-gray-200">{product.condition}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">Seller</span>
                  <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="truncate max-w-[120px]">Anonymous Student</span>
                  </span>
                </div>
              </div>

              <div className="mt-auto">
                {isOwner ? (
                  <div className="bg-gray-50 border border-gray-200 text-gray-600 p-5 rounded-2xl text-center font-bold shadow-sm">
                    This is your active listing.
                  </div>
                ) : success ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl text-center shadow-sm">
                    <h4 className="text-lg font-black mb-1">
                      {success === "PAID" ? "Payment Successful! 🎉" : "Interest Registered! 🎉"}
                    </h4>
                    <p className="text-sm font-medium text-green-600/80">Our admins have been notified and will coordinate delivery shortly.</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleExpressInterest}
                      disabled={actionLoading}
                      className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 shadow-sm py-4 px-6 rounded-2xl font-bold text-base transition-all disabled:opacity-50 hover:shadow-md active:scale-[0.98]"
                    >
                      {actionLoading ? "Processing..." : "WISH TO BUY"}
                    </button>
                    <button
                      onClick={handlePayNow}
                      disabled={actionLoading}
                      className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all disabled:opacity-50 hover:bg-blue-700 active:scale-[0.98]"
                    >
                      {actionLoading ? "Processing..." : "PAY NOW"}
                    </button>
                  </div>
                )}
                {!isOwner && !success && (
                  <p className="text-center text-[11px] font-bold text-gray-500 mt-5 flex items-center justify-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Escrow Managed Transaction
                  </p>
                )}
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Similar Items You Might Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map(p => (
                  <AnimatedProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
