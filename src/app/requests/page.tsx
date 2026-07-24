import { getActiveItemRequests } from "@/app/actions/request"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import FulfillRequestButton from "@/components/FulfillRequestButton"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function RequestsPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user ? (session.user as any).id : null
  const requests = await getActiveItemRequests()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative text-gray-900">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pb-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">"In Search Of" Board</h1>
            <p className="text-gray-500 font-medium mt-1">See what items students are actively looking for right now.</p>
          </div>
          <Link 
            href="/requests/new"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-md shadow-blue-600/20 transition-all text-center"
          >
            + Post a Request
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No active requests</h3>
            <p className="text-gray-500 mb-6">Everyone has what they need right now! Be the first to post a request.</p>
            <Link 
              href="/requests/new"
              className="inline-block bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm"
            >
              Post a Request
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div key={req.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {req.category}
                  </span>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{req.title}</h3>
                <p className="text-sm text-gray-600 mb-6 line-clamp-3 font-medium">{req.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Willing to Pay</p>
                    <p className="text-2xl font-black text-gray-900 leading-none tracking-tight">₹{req.budget.toLocaleString('en-IN')}</p>
                  </div>
                  
                  <FulfillRequestButton requestId={req.id} isOwner={req.requesterId === userId} category={req.category} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
