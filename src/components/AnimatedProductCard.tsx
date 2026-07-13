"use client"

import { motion, Variants } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "tween", duration: 0.2 } }
}

export default function AnimatedProductCard({ product }: { product: any }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div 
      variants={itemVariants} 
      className="h-full bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100/50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="flex flex-col h-full overflow-hidden">
        
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full bg-[#f8f9fa] p-4 flex items-center justify-center">
          <img 
            src={product.images || 'https://via.placeholder.com/300x300?text=No+Image'} 
            alt={product.title} 
            className={`object-contain w-full h-full transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />
          {/* Discount / Category Tag */}
          <div className="absolute top-0 left-0 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-br-lg text-[10px] font-bold uppercase tracking-wide">
            {product.category}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Delivery time simulation */}
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 w-fit px-1.5 py-0.5 rounded mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            10 MINS
          </div>

          <h3 className="text-[13px] font-semibold text-gray-800 leading-tight line-clamp-2 mb-1" title={product.title}>
            {product.title}
          </h3>
          
          <p className="text-[11px] text-gray-500 mb-2 truncate">
            {product.condition} • {product.seller.name}
          </p>
          
          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 line-through">₹{Math.floor(product.price * 1.2)}</span>
              <span className="text-[15px] font-extrabold text-gray-900 leading-none">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
            
            {/* Blinkit Style ADD Button */}
            <button 
              onClick={(e) => {
                e.preventDefault()
                // In a real app, this would add to cart or open order modal
                window.location.href = `/products/${product.id}`
              }}
              className="bg-green-50 text-green-700 border border-green-600 px-4 py-1.5 rounded-lg text-xs font-extrabold hover:bg-green-600 hover:text-white transition-colors"
            >
              ADD
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
