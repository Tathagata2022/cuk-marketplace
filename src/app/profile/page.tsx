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
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden text-white">
      
      {/* Dark Mode Background Elements */}
      <div className="fixed inset-0 z-0 bg-grid-pattern pointer-events-none opacity-20"></div>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-neon-green/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-neon-yellow/5 blur-[150px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          
          {/* Profile Header Card */}
          <div className="dark-glass rounded-[2rem] p-6 sm:p-10 mb-10 border border-white/10 shadow-xl relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-green to-neon-yellow"></div>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative z-10">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#111111] border-[3px] border-neon-green p-1 shadow-[0_0_20px_rgba(57,255,20,0.2)] flex-shrink-0">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] text-neon-green text-4xl font-black rounded-full">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">{session.user.name}</h1>
                <p className="text-base sm:text-lg text-neon-green font-medium mb-4">{session.user.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs">
                  {/* @ts-ignore */}
                  <span className="bg-[#111111] px-4 py-1.5 rounded-full font-bold text-gray-400 shadow-sm border border-white/10">
                    {/* @ts-ignore */}
                    {session.user.department || "No Department"}
                  </span>
                  <span className="bg-[#111111] px-4 py-1.5 rounded-full font-bold text-gray-400 shadow-sm border border-white/10">
                    {/* @ts-ignore */}
                    {session.user.phoneNumber || "No Phone"}
                  </span>
                </div>
              </div>

              <div className="sm:ml-auto flex gap-4 mt-6 sm:mt-0">
                <div className="bg-[#111111] border border-white/10 rounded-2xl px-6 py-4 text-center min-w-[100px] sm:min-w-[120px]">
                  <p className="text-2xl sm:text-3xl font-black text-white">{myListings.length}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Listings</p>
                </div>
                <div className="bg-[#111111] border border-white/10 rounded-2xl px-6 py-4 text-center min-w-[100px] sm:min-w-[120px]">
                  <p className="text-2xl sm:text-3xl font-black text-neon-yellow">{myOrders.length}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Purchases</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-16 pb-20">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <span className="w-2 h-8 bg-neon-green rounded-full"></span>
                  My Listings
                </h2>
                <Link 
                  href="/sell"
                  className="bg-neon-green text-black px-5 py-2.5 rounded-xl text-sm font-black transition-transform hover:scale-105 shadow-[0_0_15px_rgba(57,255,20,0.3)] hidden sm:block"
                >
                  + New Listing
                </Link>
              </div>
              
              {myListings.length === 0 ? (
                <div className="dark-glass p-10 sm:p-12 rounded-[2rem] text-center text-gray-500 shadow-sm border border-white/10">
                  <p className="text-gray-400 mb-6 font-medium text-lg">You haven't listed any items for sale yet.</p>
                  <Link 
                    href="/sell"
                    className="inline-flex bg-[#1a1a1a] border border-neon-green/30 hover:bg-[#222222] hover:border-neon-green text-neon-green px-6 py-3 rounded-xl font-bold transition-all shadow-md"
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
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <span className="w-2 h-8 bg-neon-yellow rounded-full"></span>
                  Items I'm Interested In
                </h2>
              </div>
              
              {myOrders.length === 0 ? (
                <div className="dark-glass p-10 sm:p-12 rounded-[2rem] text-center text-gray-500 shadow-sm border border-white/10">
                  <p className="text-gray-400 mb-6 font-medium text-lg">You haven't expressed interest in any items yet.</p>
                  <Link href="/" className="inline-block mt-4 text-neon-yellow hover:text-neon-green font-bold transition-colors">
                    Browse the marketplace →
                  </Link>
                </div>
              ) : (
                <AnimatedGridContainer>
                  {myOrders.map(order => (
                    <AnimatedProductCard key={order.product.id} product={order.product} />
                  ))}
                </AnimatedGridContainer>
              )}
            </section>

            <div className="pt-8 border-t border-white/10">
              <DeleteAccountButton />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
