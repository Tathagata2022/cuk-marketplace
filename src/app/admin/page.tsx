"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { getAdminOrders } from "../actions/admin"
import { motion } from "framer-motion"

export default function AdminOverview() {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const orders = await getAdminOrders()
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: any) => o.status !== "COMPLETED" && o.status !== "CANCELLED").length
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div>Loading statistics...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Platform Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Active Orders</p>
            <h3 className="text-4xl font-bold text-gray-900">{stats.pendingOrders}</h3>
          </div>
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">All Time Orders</p>
            <h3 className="text-4xl font-bold text-gray-900">{stats.totalOrders}</h3>
          </div>
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Welcome to the Admin Center</h3>
        <p className="text-gray-600 mb-6">
          From here you can manage all escrow orders, moderate users, and oversee marketplace activity. 
          Use the sidebar to navigate to the specific management modules.
        </p>
      </div>
    </div>
  )
}
