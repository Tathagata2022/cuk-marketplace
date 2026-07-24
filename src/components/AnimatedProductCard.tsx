"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

interface AnimatedProductCardProps {
  product: any
  actionButton?: React.ReactNode
  orderStatus?: string
}

export default function AnimatedProductCard({ product, actionButton, orderStatus }: AnimatedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  let displayImage = product.images;
  try {
    if (product.images && product.images.startsWith('[')) {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        displayImage = parsed[0];
      }
    }
  } catch(e) {}


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group h-full"
    >
      <Link href={`/products/${product.id}`} className="block h-full">
        <div className="clean-card rounded-[24px] overflow-hidden flex flex-col h-full bg-white transition-all duration-300 group-hover:shadow-xl relative">
          
          {/* Image Container */}
          <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden border-b border-gray-100">
            {displayImage ? (
              <img
                src={displayImage}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider">No Image</span>
              </div>
            )}
            
            {/* Condition Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-white/90 backdrop-blur-md border border-gray-200 text-gray-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                {product.condition}
              </span>
            </div>

            {/* Action Button (Delete/Remove Interest) */}
            {actionButton && (
              <div className="absolute top-4 right-4 z-20" onClick={(e) => e.preventDefault()}>
                {actionButton}
              </div>
            )}

            {/* View Details Overlay */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              className="absolute bottom-4 right-4 z-10"
            >
              <div className="bg-blue-600 text-white font-bold px-4 py-2 rounded-full shadow-lg shadow-blue-600/30 flex items-center gap-1">
                <span className="text-sm">View</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                {product.category}
              </span>
              <span className="text-[11px] font-medium text-gray-400">
                {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
            
            <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">{product.description}</p>
            
            {orderStatus && (
              <div className="mb-4">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                  orderStatus === "DELIVERED" ? "bg-emerald-100 text-emerald-800" :
                  orderStatus === "CANCELLED" ? "bg-red-100 text-red-800" :
                  "bg-amber-100 text-amber-800"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    orderStatus === "DELIVERED" ? "bg-emerald-500" :
                    orderStatus === "CANCELLED" ? "bg-red-500" :
                    "bg-amber-500 animate-pulse"
                  }`}></div>
                  {orderStatus === "INTERESTED" ? "PENDING ADMIN REVIEW" : orderStatus}
                </div>
              </div>
            )}

            <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-100">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-gray-900 leading-none">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Seller</p>
                  <p className="text-xs font-bold text-gray-700 truncate max-w-[80px]">
                    Anonymous
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
