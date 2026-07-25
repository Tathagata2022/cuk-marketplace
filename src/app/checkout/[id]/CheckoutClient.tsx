"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { submitPayment } from "@/app/actions/product"
import { useRouter } from "next/navigation"

export default function CheckoutClient({ product, upiId, upiName }: { product: any, upiId: string, upiName: string }) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [utr, setUtr] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Basic mobile detection
    if (typeof window !== "undefined") {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
  }, [])

  // Format price exactly to 2 decimal places as required by strict UPI apps
  const formattedPrice = Number(product.price).toFixed(2)
  
  // Provide the EXACT bank account name and a simple transaction note.
  // GPay requires 'pn' (Payee Name) to perfectly match the bank account, otherwise it throws 'Bank Limit Exceeded'.
  const exactName = encodeURIComponent("Tathagata Mandal")
  const upiString = `upi://pay?pa=${upiId}&pn=${exactName}&tn=Marketplace&am=${formattedPrice}&cu=INR`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    
    if (utr.length < 12) {
      setError("Please enter a valid 12-digit UTR number.")
      return
    }

    setLoading(true)
    try {
      const res = await submitPayment(product.id, utr)
      if (res.success) {
        alert("Payment Submitted! Admin will verify your UTR and process the order.")
        router.push(`/products/${product.id}`)
      } else {
        setError(res.error || "Failed to submit payment.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Secure Checkout</h1>
          <p className="text-gray-500 font-medium mt-1">Escrow Managed Transaction via IEDC</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Amount to Pay</p>
          <p className="text-4xl font-black text-blue-600 tracking-tight">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-12">
        {/* Payment Instructions */}
        <div className="flex flex-col items-center justify-center bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 border border-gray-100">
            <QRCodeSVG value={upiString} size={200} level="H" />
          </div>
          
          {isMobile && (
            <div className="w-full flex flex-col gap-3 mb-6">
              <a 
                href={`gpay://upi/pay?pa=${upiId}&pn=${exactName}&tn=Marketplace&am=${formattedPrice}&cu=INR`}
                className="w-full bg-white border border-gray-200 text-gray-800 py-3 px-4 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all text-center flex items-center justify-center gap-2"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="GPay" className="w-5 h-5" />
                Pay with GPay
              </a>
              <a 
                href={`phonepe://pay?pa=${upiId}&pn=${exactName}&tn=Marketplace&am=${formattedPrice}&cu=INR`}
                className="w-full bg-white border border-gray-200 text-purple-700 py-3 px-4 rounded-xl font-bold text-sm shadow-sm hover:bg-purple-50 transition-all text-center flex items-center justify-center gap-2"
              >
                Pay with PhonePe
              </a>
              <a 
                href={`paytmmp://pay?pa=${upiId}&pn=${exactName}&tn=Marketplace&am=${formattedPrice}&cu=INR`}
                className="w-full bg-white border border-gray-200 text-sky-600 py-3 px-4 rounded-xl font-bold text-sm shadow-sm hover:bg-sky-50 transition-all text-center flex items-center justify-center gap-2"
              >
                Pay with Paytm
              </a>
              <div className="text-center mt-2">
                <p className="text-xs text-gray-500 font-medium">Or take a screenshot and scan the QR code above.</p>
              </div>
            </div>
          )}
          
          {!isMobile && (
            <p className="text-sm font-bold text-gray-500 text-center mb-6">Scan QR code using Google Pay, PhonePe, or Paytm</p>
          )}
          
          <div className="w-full bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
            <p className="text-[10px] font-black uppercase text-blue-500 tracking-wider mb-1">Paying To</p>
            <p className="text-sm font-bold text-blue-900">{upiName}</p>
            <p className="text-xs font-medium text-blue-700/70">{upiId}</p>
          </div>
        </div>

        {/* Verification Form */}
        <div className="flex flex-col justify-center">
          <h3 className="text-xl font-black text-gray-900 mb-2">Confirm Payment</h3>
          <p className="text-sm text-gray-500 mb-8 font-medium">After completing the payment, please enter the 12-digit UTR (Transaction ID) below.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label htmlFor="utr" className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                12-Digit UTR Number
              </label>
              <input
                id="utr"
                type="text"
                maxLength={12}
                value={utr}
                onChange={(e) => setUtr(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 301234567890"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:font-normal placeholder:text-gray-400"
                required
              />
              {error && <p className="text-red-500 text-sm font-bold mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || utr.length < 12}
              className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-bold text-base hover:bg-gray-800 transition-all disabled:opacity-50 disabled:hover:bg-gray-900 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  Processing...
                </>
              ) : (
                "Submit Payment for Verification"
              )}
            </button>
            <p className="text-xs font-bold text-gray-400 text-center flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Verified via IEDC CUK Escrow
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
