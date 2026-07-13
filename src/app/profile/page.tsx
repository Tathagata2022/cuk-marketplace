import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import AnimatedGridContainer from "@/components/AnimatedGridContainer"
import AnimatedProductCard from "@/components/AnimatedProductCard"
import Navbar from "@/components/Navbar"
import DeleteAccountButton from "@/components/DeleteAccountButton"

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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col relative overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-300/30 blur-[80px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-300/20 blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="glass-card rounded-[2rem] p-8 mb-12 relative overflow-hidden">
            {/* Subtle glow inside the profile card */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-100/50 to-green-100/50 rounded-[2rem] blur opacity-50 -z-10"></div>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
              <div className="w-28 h-28 rounded-full overflow-hidden glass border-4 border-white shadow-xl shadow-gray-200/50 flex-shrink-0">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-900 text-4xl font-black">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-1">{session.user.name}</h1>
                <p className="text-gray-500 font-medium mb-4">{session.user.email}</p>
                {/* @ts-ignore */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs">
                  {/* @ts-ignore */}
                  <span className="glass px-4 py-1.5 rounded-full font-bold text-yellow-700 shadow-sm border border-yellow-200/50">
                    {/* @ts-ignore */}
                    {session.user.department || "No Department"}
                  </span>
                  {/* @ts-ignore */}
                  <span className="glass px-4 py-1.5 rounded-full font-bold text-gray-700 shadow-sm border border-gray-200/50">
                    {/* @ts-ignore */}
                    {session.user.phoneNumber || "No Phone"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3 tracking-tight">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                My Listings
              </h2>
              {myListings.length === 0 ? (
                <div className="glass-card p-12 rounded-[2rem] text-center text-gray-500 shadow-sm border border-white">
                  <div className="w-16 h-16 bg-gray-100/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No active listings</h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven't listed any items for sale yet.</p>
                  <Link 
                    href="/sell"
                    className="inline-flex bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold transition-transform hover:scale-105 shadow-md"
                  >
                    Create a Listing
                  </Link>
                </div>
              ) : (
                <AnimatedGridContainer>
                  {myListings.map(product => (
                    <AnimatedProductCard key={product.id} product={product} />
                  ))}
                </AnimatedGridContainer>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3 tracking-tight">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                Items I'm Interested In
              </h2>
              {myOrders.length === 0 ? (
                <div className="glass-card p-12 rounded-[2rem] text-center text-gray-500 shadow-sm border border-white">
                  <div className="w-16 h-16 bg-gray-100/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 max-w-sm mx-auto">You haven't expressed interest in any items yet.</p>
                </div>
              ) : (
                <AnimatedGridContainer>
                  {myOrders.map(order => (
                    <AnimatedProductCard key={order.product.id} product={order.product} />
                  ))}
                </AnimatedGridContainer>
              )}
            </section>

            <DeleteAccountButton />
          </div>
        </main>
      </div>
    </div>
  )
}
