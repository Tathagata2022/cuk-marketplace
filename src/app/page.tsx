"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { motion, Variants } from "framer-motion"

export default function Home() {
  const { data: session } = useSession()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col overflow-hidden">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tight text-blue-600"
        >
          Campus Marketplace
        </motion.h1>
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm group-hover:shadow-md transition-shadow">
                  {session.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xs">
                      {session.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors hidden sm:inline-block">My Dashboard</span>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut()}
                className="bg-gray-100 hover:bg-red-50 text-gray-800 hover:text-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </motion.button>
            </div>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signIn("google")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              Login with Google
            </motion.button>
          )}
        </motion.nav>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-grow flex flex-col items-center justify-center p-8 text-center relative"
      >
        {/* Decorative background blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 z-10 relative">
          The smart way to buy & sell on campus
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mb-12 z-10 relative">
          A secure, managed marketplace exclusively for university students. 
          List your products, find what you need, and let us handle the transactions securely.
        </motion.p>
        
        {session ? (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10 relative">
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Sell an Item</h3>
              <p className="text-gray-600 mb-8 text-base flex-grow">Got textbooks you don't need? A mini-fridge? List it quickly and safely.</p>
              <Link href="/sell" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center mt-auto font-semibold shadow-md hover:shadow-lg">
                List a Product
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Browse Marketplace</h3>
              <p className="text-gray-600 mb-8 text-base flex-grow">Discover items listed by other students. Secure and on-campus.</p>
              <Link href="/products" className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors inline-block text-center mt-auto font-semibold shadow-md hover:shadow-lg">
                View Products
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-10 max-w-lg w-full shadow-lg z-10 relative">
            <h3 className="text-2xl font-bold mb-4 text-blue-900">Get Started</h3>
            <p className="text-blue-800 mb-8 text-base">Sign in securely with your Google account to join the exclusive campus community marketplace.</p>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("google")}
              className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg font-semibold flex items-center justify-center gap-3 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
              </svg>
              Sign in with Google
            </motion.button>
          </motion.div>
        )}
      </motion.main>
      
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500 z-10 relative">
        &copy; {new Date().getFullYear()} Campus Marketplace. Escrow-managed for your security.
      </footer>
    </div>
  )
}
