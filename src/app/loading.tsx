import Navbar from "@/components/Navbar"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col relative text-gray-900">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
        <p className="mt-4 text-blue-600 font-bold tracking-widest uppercase text-sm animate-pulse">Loading CUK Marketplace...</p>
      </div>
    </div>
  )
}
