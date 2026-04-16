import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { products } from '../../data/mockDb';

export default function ProductGrid() {
  return (
    <section id="পূজার সামগ্রী" className="py-20 bg-white/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl text-sindoor-red mb-4">পবিত্র সামগ্রী</h2>
          <p className="font-bengali text-gray-600">প্রতিটি উপাদান নির্বাচিত হয়েছে পরম যত্নে</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl border border-soft-gold/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(255,215,0,0.15)] transition-all overflow-hidden flex flex-col cursor-none group"
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img 
                  src={product.images[0]} 
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.badges.map(badge => (
                    <span key={badge} className="bg-sindoor-red/90 text-white text-[10px] font-bengali px-2 py-0.5 rounded-full shadow-sm">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col">
                <p className="text-xs text-golden-orange font-medium mb-1 uppercase tracking-wider">{product.category}</p>
                <h3 className="font-heading text-2xl text-gray-800 mb-2">{product.title}</h3>
                <p className="font-bengali text-sm text-gray-500 mb-4 flex-grow line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bengali font-bold text-xl text-sindoor-red">
                    ৳{product.price}
                  </span>
                  <button className="bg-matte-sandal border border-golden-orange text-golden-orange hover:bg-gradient-to-r hover:from-sindoor-red hover:to-golden-orange hover:text-white hover:border-transparent p-2 rounded-full transition-all cursor-none group/btn">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
