"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function AnimatedProductCard({ product }: { product: any }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-full flex flex-col"
    >
      <Link href={`/products/${product.id}`} className="block h-full">
        <div className="dark-glass rounded-2xl overflow-hidden h-full flex flex-col relative">
          
          {/* Subtle glowing border effect on hover */}
          <div className="absolute inset-0 border-[2px] border-neon-green/0 group-hover:border-neon-green/50 rounded-2xl transition-all duration-300 z-20 pointer-events-none"></div>
          
          {/* Top Image Section */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111111]">
            <img 
              src={product.images || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.title)}&background=111111&color=39FF14&size=400`}
              alt={product.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100"
            />
            {/* Dark overlay at bottom of image for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
          </div>
          
          {/* Content Section */}
          <div className="p-4 sm:p-5 flex flex-col flex-grow relative z-10 -mt-8">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base sm:text-lg font-black text-white line-clamp-1 group-hover:text-neon-green transition-colors drop-shadow-md">
                {product.title}
              </h3>
            </div>
            
            <p className="text-xl sm:text-2xl font-black text-neon-yellow mb-4 tracking-tight drop-shadow-md">
              ₹{product.price.toLocaleString()}
            </p>
            
            <div className="mt-auto flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#1a1a1a] text-gray-400 border border-white/5 uppercase tracking-wider">
                {product.category}
              </span>
              
              <div className="flex items-center gap-1.5 opacity-60">
                <div className={`w-2 h-2 rounded-full ${
                  product.condition === 'Like New' ? 'bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.8)]' : 
                  product.condition === 'Good' ? 'bg-neon-yellow shadow-[0_0_8px_rgba(255,255,0,0.8)]' : 
                  'bg-orange-500'
                }`}></div>
                <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">{product.condition}</span>
              </div>
            </div>
          </div>
          
          {/* "View Details" overlay on hover */}
          <div className="absolute top-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-30">
            <div className="bg-neon-green text-black w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.4)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

        </div>
      </Link>
      
      {/* Hover Glow Effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-green-400 to-yellow-400 rounded-[1.7rem] blur opacity-0 group-hover:opacity-20 transition duration-500 -z-10`}></div>
    </motion.div>
  )
}
