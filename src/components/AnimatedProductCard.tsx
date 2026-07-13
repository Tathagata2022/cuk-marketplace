"use client"

import { motion, Variants } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function AnimatedProductCard({ product }: { product: any }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div 
      variants={itemVariants} 
      className="h-full glass-card rounded-[1.5rem] relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="flex flex-col h-full overflow-hidden rounded-[1.5rem] z-10 relative bg-white/40 backdrop-blur-lg">
        
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full bg-white/50 p-6 flex items-center justify-center overflow-hidden">
          <motion.img 
            src={product.images || 'https://via.placeholder.com/300x300?text=No+Image'} 
            alt={product.title} 
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="object-contain w-full h-full mix-blend-multiply drop-shadow-sm"
          />
          {/* Category Tag */}
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md text-gray-800 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm border border-white/50">
            {product.category}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Delivery time simulation */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            10 MINS
          </div>

          <h3 className="text-[15px] font-bold text-gray-900 leading-tight line-clamp-2 mb-1 group-hover:text-green-700 transition-colors" title={product.title}>
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-4 mt-1">
            <img 
              src={product.seller?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.seller?.name || 'U')}&background=random`} 
              className="w-5 h-5 rounded-full"
            />
            <p className="text-xs text-gray-500 font-medium truncate">
              {product.seller?.name} • {product.condition}
            </p>
          </div>
          
          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium line-through mb-0.5">₹{Math.floor(product.price * 1.2)}</span>
              <span className="text-lg font-extrabold text-gray-900 leading-none tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
            
            {/* Interactive ADD Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault()
                window.location.href = `/products/${product.id}`
              }}
              className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-shadow"
            >
              ADD
            </motion.button>
          </div>
        </div>
      </Link>
      
      {/* Hover Glow Effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-green-400 to-yellow-400 rounded-[1.7rem] blur opacity-0 group-hover:opacity-20 transition duration-500 -z-10`}></div>
    </motion.div>
  )
}
