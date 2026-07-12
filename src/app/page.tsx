"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-blue-600">Campus Marketplace</h1>
        <nav>
          {session ? (
            <div className="flex items-center gap-4">
              {(session.user as any)?.role === "ADMIN" && (
                <Link href="/admin" className="text-sm font-semibold text-red-600 hover:text-red-800">
                  Admin Panel
                </Link>
              )}
              <span className="text-sm text-gray-600">Hello, {session.user?.name}</span>
              <button 
                onClick={() => signOut()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn("google")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              Login with Google
            </button>
          )}
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-gray-900">
          The smart way to buy & sell on campus
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          A secure, managed marketplace exclusively for university students. 
          List your products, find what you need, and let us handle the transactions securely.
        </p>
        
        {session ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Sell an Item</h3>
              <p className="text-gray-600 mb-4 text-sm flex-grow">List your used books, electronics, or furniture.</p>
              <Link href="/sell" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors inline-block text-center mt-auto font-medium">
                List Product
              </Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Browse Marketplace</h3>
              <p className="text-gray-600 mb-4 text-sm flex-grow">Discover items listed by other students.</p>
              <Link href="/products" className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition-colors inline-block text-center mt-auto font-medium">
                View Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4 text-blue-900">Get Started</h3>
            <p className="text-blue-800 mb-6 text-sm">Sign in with your Google account to start buying and selling in your campus community.</p>
            <button 
              onClick={() => signIn("google")}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium flex items-center justify-center gap-2"
            >
              Sign in with Google
            </button>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Campus Marketplace. Escrow-managed for your security.
      </footer>
    </div>
  )
}
