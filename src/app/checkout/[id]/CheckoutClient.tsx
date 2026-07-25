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
      <div className="p-6 sm:p-8 border-b border-gray-100 bg-white flex flex-col items-center text-center">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Amount to Pay</p>
        <h1 className="text-5xl sm:text-6xl font-black text-blue-600 tracking-tight mb-2">₹{product.price.toLocaleString('en-IN')}</h1>
        <p className="text-sm font-medium text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">Escrow Managed Transaction via IEDC</p>
      </div>

      <div className="p-6 sm:p-8 grid md:grid-cols-2 gap-8 sm:gap-12 bg-gray-50/50">
        {/* Payment Instructions */}
        <div className="flex flex-col items-center justify-center bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          
          {isMobile ? (
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm mb-6">
                <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Select UPI App</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {/* GPay */}
                  <a 
                    href={`gpay://upi/pay?pa=${upiId}&pn=${exactName}&tn=Marketplace&am=${formattedPrice}&cu=INR`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center p-2.5">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="GPay" className="w-full h-full object-contain" />
                      </div>
                      <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Google Pay</span>
                    </div>
                    <div className="bg-blue-600 text-white text-[11px] font-black px-4 py-2 rounded-full shadow-md shadow-blue-600/20 active:scale-95 transition-transform">PAY</div>
                  </a>

                  {/* PhonePe - CSS Logo */}
                  <a 
                    href={`phonepe://pay?pa=${upiId}&pn=${exactName}&tn=Marketplace&am=${formattedPrice}&cu=INR`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center p-1.5">
                        <div className="w-full h-full rounded-full bg-[#5f259f] flex items-center justify-center text-white font-bold italic text-xs leading-none pb-0.5">
                          पे
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 group-hover:text-[#5f259f] transition-colors">PhonePe</span>
                    </div>
                    <div className="bg-[#5f259f] text-white text-[11px] font-black px-4 py-2 rounded-full shadow-md shadow-purple-900/20 active:scale-95 transition-transform">PAY</div>
                  </a>

                  {/* Paytm - CSS Logo */}
                  <a 
                    href={`paytmmp://pay?pa=${upiId}&pn=${exactName}&tn=Marketplace&am=${formattedPrice}&cu=INR`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center p-1">
                        <div className="flex items-center -ml-0.5 mt-0.5">
                          <span className="text-[#002970] font-black italic text-[13px] tracking-tighter">Pay</span>
                          <span className="text-[#00BAF2] font-black italic text-[13px] tracking-tighter">tm</span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 group-hover:text-[#00BAF2] transition-colors">Paytm</span>
                    </div>
                    <div className="bg-[#00BAF2] text-white text-[11px] font-black px-4 py-2 rounded-full shadow-md shadow-sky-500/20 active:scale-95 transition-transform">PAY</div>
                  </a>
                </div>
              </div>
              
              {/* Fallback QR Code for Mobile */}
              <div className="mt-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px bg-gray-200 flex-grow"></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OR SCAN QR</span>
                  <div className="h-px bg-gray-200 flex-grow"></div>
                </div>
                <div className="inline-block bg-white p-3 rounded-2xl shadow-sm border border-gray-200 mb-2">
                  <QRCodeSVG value={upiString} size={140} level="H" />
                </div>
                <p className="text-xs text-gray-500 font-medium">Take a screenshot to scan from gallery</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-3xl shadow-sm mb-6 border border-gray-100">
                <QRCodeSVG value={upiString} size={220} level="H" />
              </div>
              <p className="text-sm font-bold text-gray-500 text-center mb-6 max-w-[250px]">
                Open <span className="text-blue-600">Google Pay</span>, <span className="text-purple-600">PhonePe</span>, or <span className="text-sky-500">Paytm</span> to scan this code
              </p>
            </>
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
