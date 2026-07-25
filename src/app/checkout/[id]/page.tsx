import { getProductById } from "@/app/actions/product"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Navbar from "@/components/Navbar"
import CheckoutClient from "./CheckoutClient"

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect(`/api/auth/signin?callbackUrl=/checkout/${resolvedParams.id}`)
  }

  const product = await getProductById(resolvedParams.id)
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-500">The product you are trying to buy does not exist.</p>
          </div>
        </div>
      </div>
    )
  }

  // Define the Admin UPI Details
  const upiId = "9832667439@jio" 
  const upiName = "IEDC Central University of Kerala"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <CheckoutClient 
          product={product} 
          upiId={upiId}
          upiName={upiName}
        />
      </main>
    </div>
  )
}
