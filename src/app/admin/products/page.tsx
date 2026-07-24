"use client"

import { useState, useEffect } from "react"
import { deleteProduct, updateProductStatus, updateProductDetails, toggleProductVerification } from "../../actions/product"
import Link from "next/link"

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [viewingSeller, setViewingSeller] = useState<any>(null)

  async function fetchProducts() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/products")
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  async function handleToggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "PUBLISHED" ? "REVOKED" : "PUBLISHED"
    const res = await updateProductStatus(id, newStatus)
    if (res.success) {
      setProducts(products.map(p => p.id === id ? { ...p, status: newStatus } : p))
    } else {
      alert(res.error)
    }
  }

  async function handleToggleVerify(id: string, currentVerify: boolean) {
    const res = await toggleProductVerification(id)
    if (res.success) {
      setProducts(products.map(p => p.id === id ? { ...p, isVerified: !currentVerify } : p))
    } else {
      alert(res.error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("WARNING: Are you sure you want to permanently delete this product? All related orders will be deleted too. This cannot be undone.")) return
    
    const res = await deleteProduct(id)
    if (res.success) {
      setProducts(products.filter(p => p.id !== id))
    } else {
      alert(res.error)
    }
  }

  async function handleSaveDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category"),
      condition: formData.get("condition")
    }

    const res = await updateProductDetails(editingProduct.id, data)
    if (res.success) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...data } : p))
      setEditingProduct(null)
    } else {
      alert(res.error)
    }
  }

  if (loading) return <div>Loading products...</div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link 
          href="/sell" 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Product
        </Link>
      </div>
      
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-sm">
            <tr>
              <th className="p-4">Product ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Seller</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-100">
                <td className="p-4 font-mono text-xs font-bold text-gray-700 bg-gray-50">
                  PRD-{product.id.split('-')[0].toUpperCase()}
                </td>
                <td className="p-4 font-medium">{product.title}</td>
                <td className="p-4">
                  <button onClick={() => setViewingSeller(product.seller)} className="text-blue-600 hover:underline font-bold">
                    {product.seller.name || product.seller.email}
                  </button>
                </td>
                <td className="p-4 font-bold">₹{product.price}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded w-fit ${product.status === "PUBLISHED" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
                      {product.status}
                    </span>
                    {product.isVerified && (
                      <span className="px-2 py-1 text-[10px] font-bold rounded w-fit bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        VERIFIED
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 flex flex-wrap gap-2">
                  <button 
                    onClick={() => setEditingProduct(product)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
                  >
                    Edit Details
                  </button>
                  {product.status === "PUBLISHED" ? (
                    <button 
                      onClick={() => handleToggleStatus(product.id, product.status)}
                      className="px-3 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 font-medium"
                    >
                      Revoke
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleToggleStatus(product.id, product.status)}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 font-medium"
                    >
                      Publish
                    </button>
                  )}
                  <button 
                    onClick={() => handleToggleVerify(product.id, product.isVerified)}
                    className={`px-3 py-1 rounded font-medium ${product.isVerified ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                  >
                    {product.isVerified ? "Unverify" : "Verify"}
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Edit Details Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Product Details</h2>
            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                <input name="title" defaultValue={editingProduct.title} required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea name="description" defaultValue={editingProduct.description} required rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (₹)</label>
                <input name="price" type="number" defaultValue={editingProduct.price} required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                <input name="category" defaultValue={editingProduct.category} required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Condition</label>
                <input name="condition" defaultValue={editingProduct.condition} required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seller Details Modal */}
      {viewingSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">
              {viewingSeller.name?.charAt(0) || "U"}
            </div>
            <h2 className="text-xl font-bold mb-1">{viewingSeller.name}</h2>
            <p className="text-sm text-gray-500 mb-6">{viewingSeller.email}</p>
            
            <div className="text-left space-y-3 bg-gray-50 p-4 rounded-xl mb-6">
              <div>
                <span className="block text-[10px] uppercase font-bold text-gray-400">Phone Number</span>
                <span className="font-medium text-gray-900">{viewingSeller.phoneNumber || "Not provided"}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-gray-400">Department</span>
                <span className="font-medium text-gray-900">{viewingSeller.department || "Not provided"}</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Course</span>
                  <span className="font-medium text-gray-900">{viewingSeller.course || "-"}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Semester</span>
                  <span className="font-medium text-gray-900">{viewingSeller.semester || "-"}</span>
                </div>
              </div>
            </div>

            <button onClick={() => setViewingSeller(null)} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold">
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
