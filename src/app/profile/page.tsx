import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import AnimatedGridContainer from "@/components/AnimatedGridContainer"
import AnimatedProductCard from "@/components/AnimatedProductCard"

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
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <Link href="/" className="text-2xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition-colors">
          Campus Marketplace
        </Link>
        <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Back to Browse
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-3xl font-bold">
                  {session.user.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{session.user.name}</h1>
              <p className="text-gray-500">{session.user.email}</p>
              {/* @ts-ignore */}
              <div className="mt-2 flex gap-3 text-sm text-gray-600">
                {/* @ts-ignore */}
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">{session.user.department}</span>
                {/* @ts-ignore */}
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">{session.user.phoneNumber}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              My Listings
            </h2>
            {myListings.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500 shadow-sm">
                You haven't listed any items yet.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Items I'm Interested In
            </h2>
            {myOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500 shadow-sm">
                You haven't expressed interest in any items yet.
              </div>
            ) : (
              <AnimatedGridContainer>
                {myOrders.map(order => (
                  <AnimatedProductCard key={order.product.id} product={order.product} />
                ))}
              </AnimatedGridContainer>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
