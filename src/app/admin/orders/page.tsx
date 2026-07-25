"use client"

import { useEffect, useState } from "react"
import { getAdminOrders, updateOrderStatus } from "../../actions/admin"

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminOrders()
        setOrders(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } catch (err) {
      alert("Failed to update status")
    }
  }

  if (loading) return <div className="text-center py-12">Loading orders...</div>

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500 shadow-sm">
          No orders found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction (UTR)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${order.status === 'PAID' ? 'bg-green-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700 border-r border-gray-100">
                      ORD-{order.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.product.title}</div>
                      <div className="text-xs font-mono text-gray-500">PRD-{order.product.id.split('-')[0].toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.buyer.name}</div>
                      <div className="text-xs text-gray-500">{order.buyer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.product.seller.name}</div>
                      <div className="text-xs text-gray-500">{order.product.seller.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.transactionId ? (
                        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block text-gray-700 tracking-wider">
                          {order.transactionId}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No UTR</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'INTERESTED' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${order.status === 'PAYMENT_PENDING' ? 'bg-orange-100 text-orange-800' : ''}
                        ${order.status === 'PAID' ? 'bg-green-100 text-green-800 border border-green-200' : ''}
                        ${order.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {order.status === 'PAID' ? 'PAID (Awaiting Verification)' : order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-2">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 outline-none w-full"
                        >
                          <option value="INTERESTED">Interested</option>
                          <option value="PAID">Paid (Unverified)</option>
                          <option value="DELIVERING">Verified & Delivering</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="REJECTED">Reject Payment</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        {order.status === 'PAID' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'DELIVERING')}
                            className="bg-green-600 text-white text-xs font-bold py-1.5 px-3 rounded shadow-sm hover:bg-green-700 w-full"
                          >
                            Verify & Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
