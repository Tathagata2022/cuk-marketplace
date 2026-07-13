"use client"

import { useState, useEffect } from "react"
import { deleteProduct, updateProductPrice } from "../../actions/product"

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product? All related orders will be deleted too.")) return
    
    const res = await deleteProduct(id)
    if (res.success) {
      setProducts(products.filter(p => p.id !== id))
    } else {
      alert(res.error)
    }
  }

  async function handlePriceUpdate(id: string, currentPrice: number) {
    const newPriceStr = prompt(`Enter new price (Current: ₹${currentPrice})`, currentPrice.toString())
    if (!newPriceStr) return
    
    const newPrice = parseFloat(newPriceStr)
    if (isNaN(newPrice) || newPrice < 0) {
      alert("Invalid price")
      return
    }

    const res = await updateProductPrice(id, newPrice)
    if (res.success) {
      setProducts(products.map(p => p.id === id ? { ...p, price: newPrice } : p))
    } else {
      alert(res.error)
    }
  }

  if (loading) return <div>Loading products...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      
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
                <td className="p-4 font-mono text-xs text-gray-500">{product.id}</td>
                <td className="p-4 font-medium">{product.title}</td>
                <td className="p-4">{product.seller.name || product.seller.email}</td>
                <td className="p-4 font-bold">₹{product.price}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                    {product.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button 
                    onClick={() => handlePriceUpdate(product.id, product.price)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
                  >
                    Edit Price
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium"
                  >
                    Revoke
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
    </div>
  )
}
