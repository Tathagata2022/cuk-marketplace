"use client"

import { useEffect, useState } from "react"
import { getAllRequestsForAdmin, deleteRequestByAdmin, updateRequestByAdmin } from "../../actions/request"

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRequest, setEditingRequest] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

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

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editingRequest) return

    setIsSaving(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      budget: formData.get("budget"),
      category: formData.get("category"),
      status: formData.get("status"),
    }
    
    await updateRequestByAdmin(editingRequest.id, data)
    
    setRequests(requests.map(r => {
      if (r.id === editingRequest.id) {
        return { ...r, ...data, budget: parseFloat(data.budget as string) }
      }
      return r
    }))
    setEditingRequest(null)
    setIsSaving(false)
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
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{req.requester.name}</div>
                    <div className="text-xs text-gray-500">{req.requester.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingRequest(req)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(req.id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
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

      {editingRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Edit Item Request</h3>
              <button onClick={() => setEditingRequest(null)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow text-sm">
              <form id="editRequestForm" onSubmit={handleUpdate} className="space-y-6">
                
                {/* Requester Details Card */}
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-3">Requester Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block text-xs font-medium mb-0.5">Name</span>
                      <span className="font-bold text-gray-900">{editingRequest.requester.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs font-medium mb-0.5">Email</span>
                      <span className="font-medium text-gray-800">{editingRequest.requester.email}</span>
                    </div>
                    {editingRequest.requester.department && (
                      <div className="col-span-2">
                        <span className="text-gray-500 block text-xs font-medium mb-0.5">Department</span>
                        <span className="font-medium text-gray-800">{editingRequest.requester.department}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                    <input name="title" defaultValue={editingRequest.title} required className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea name="description" defaultValue={editingRequest.description} rows={3} required className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Budget (₹)</label>
                    <input name="budget" type="number" defaultValue={editingRequest.budget} required className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <select name="category" defaultValue={editingRequest.category} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-white">
                      <option value="ELECTRONICS">Electronics</option>
                      <option value="BOOKS">Books & Materials</option>
                      <option value="FURNITURE">Furniture</option>
                      <option value="CLOTHING">Clothing</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                    <select name="status" defaultValue={editingRequest.status} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-white">
                      <option value="ACTIVE">ACTIVE (Published)</option>
                      <option value="REVOKED">REVOKED (Hidden)</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                type="button" 
                onClick={() => setEditingRequest(null)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="editRequestForm"
                disabled={isSaving}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
