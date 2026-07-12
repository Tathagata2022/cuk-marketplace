"use client"

import { motion, Variants } from "framer-motion"
import Link from "next/link"

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function AnimatedProductCard({ product }: { product: any }) {
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }} className="h-full">
      <Link href={`/products/${product.id}`} className="group flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all">
        <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
          <img 
            src={product.images} 
            alt={product.title} 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700 uppercase tracking-wider">
            {product.category}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-gray-900 truncate mb-1" title={product.title}>
            {product.title}
          </h3>
          <p className="text-xl font-bold text-gray-900 mb-2">₹{product.price.toLocaleString('en-IN')}</p>
          
          <div className="mt-auto flex items-center pt-3 border-t border-gray-50">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-2 overflow-hidden">
              {product.seller.image ? (
                <img src={product.seller.image} alt="Seller" className="w-full h-full object-cover" />
              ) : (
                product.seller.name?.charAt(0) || "U"
              )}
            </div>
            <span className="text-xs text-gray-500 truncate">{product.seller.name}</span>
            <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {product.condition}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
