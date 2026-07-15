import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import AnimatedGridContainer from "@/components/AnimatedGridContainer"
import AnimatedProductCard from "@/components/AnimatedProductCard"
import Navbar from "@/components/Navbar"
import DeleteAccountButton from "@/components/DeleteAccountButton"
import DeleteListingButton from "@/components/DeleteListingButton"
import RemoveInterestButton from "@/components/RemoveInterestButton"

export const dynamic = "force-dynamic"

export default async function ProfileDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/")
  }

  // @ts-ignore
  const userId = session.user.id

  const [myListings, myOrders] = await Promise.all([
    prisma.product.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: "desc" },
      include: { seller: true }
    }),
    prisma.order.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: "desc" },
      include: { 
        product: {
          include: { seller: true }
        }
      }
    })
  ])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative text-gray-900">
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          
          {/* Profile Header Card */}
          <div className="clean-card bg-white rounded-[2rem] p-6 sm:p-10 mb-10 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative z-10">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-100 border-[4px] border-white p-1 shadow-md flex-shrink-0">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-4xl font-black rounded-full">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">{session.user.name}</h1>
                <p className="text-base sm:text-lg text-gray-500 font-medium mb-4">{session.user.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs">
                  {/* @ts-ignore */}
                  <span className="bg-gray-100 px-4 py-1.5 rounded-full font-bold text-gray-600 border border-gray-200">
                    {/* @ts-ignore */}
                    {session.user.department || "No Department"}
                  </span>
                  <span className="bg-gray-100 px-4 py-1.5 rounded-full font-bold text-gray-600 border border-gray-200">
                    {/* @ts-ignore */}
                    {session.user.phoneNumber || "No Phone"}
                  </span>
                </div>
              </div>

              <div className="sm:ml-auto flex gap-4 mt-6 sm:mt-0">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 text-center min-w-[100px] sm:min-w-[120px]">
                  <p className="text-2xl sm:text-3xl font-black text-blue-700">{myListings.length}</p>
                  <p className="text-[10px] sm:text-xs text-blue-600/70 font-bold uppercase tracking-wider mt-1">Listings</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-4 text-center min-w-[100px] sm:min-w-[120px]">
                  <p className="text-2xl sm:text-3xl font-black text-emerald-700">{myOrders.length}</p>
                  <p className="text-[10px] sm:text-xs text-emerald-600/70 font-bold uppercase tracking-wider mt-1">Purchases</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-16 pb-20">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                  My Listings
                </h2>
                <Link 
                  href="/sell"
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 hover:shadow-lg transition-all hover:-translate-y-0.5 hidden sm:block"
                >
                  + New Listing
                </Link>
              </div>
              
              {myListings.length === 0 ? (
                <div className="bg-white p-10 sm:p-12 rounded-[2rem] text-center shadow-sm border border-gray-100">
                  <p className="text-gray-500 mb-6 font-medium text-lg">You haven't listed any items for sale yet.</p>
                  <Link 
                    href="/sell"
                    className="inline-flex bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
                  >
                    Create a Listing
                  </Link>
                </div>
              ) : (
                <AnimatedGridContainer>
                  {myListings.map(product => (
                    <AnimatedProductCard 
                      key={product.id} 
                      product={product} 
                      actionButton={<DeleteListingButton productId={product.id} />}
                    />
                  ))}
                </AnimatedGridContainer>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Items I'm Interested In
                </h2>
              </div>
              
              {myOrders.length === 0 ? (
                <div className="bg-white p-10 sm:p-12 rounded-[2rem] text-center shadow-sm border border-gray-100">
                  <p className="text-gray-500 mb-6 font-medium text-lg">You haven't expressed interest in any items yet.</p>
                  <Link href="/" className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-bold transition-colors">
                    Browse the marketplace →
                  </Link>
                </div>
              ) : (
                <AnimatedGridContainer>
                  {myOrders.map(order => (
                    <AnimatedProductCard 
                      key={order.product.id} 
                      product={order.product} 
                      actionButton={<RemoveInterestButton orderId={order.id} />}
                    />
                  ))}
                </AnimatedGridContainer>
              )}
            </section>

            <div className="pt-8 border-t border-gray-200">
              <DeleteAccountButton />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
