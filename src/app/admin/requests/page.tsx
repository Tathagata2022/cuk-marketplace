"use client"

import { useEffect, useState } from "react"
import { getAllRequestsForAdmin, deleteRequestByAdmin } from "../../actions/request"

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadRequests() {
    const data = await getAllRequestsForAdmin()
    setRequests(data)
    setLoading(false)
  }

  useEffect(() => {
    loadRequests()
  }, [])

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this request?")) {
      await deleteRequestByAdmin(id)
      setRequests(requests.filter(r => r.id !== id))
    }
  }

  if (loading) return <div>Loading requests...</div>

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-gray-800">Manage Item Requests</h3>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-bold">Title</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Requester</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{req.title}</div>
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{req.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {req.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{req.requester.name}</div>
                    <div className="text-xs text-gray-500">{req.requester.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(req.id)}
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No item requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
