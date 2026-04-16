import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { packages } from '../../data/mockDb';

export default function PackageSection() {
  return (
    <section id="প্যাকেজ" className="py-24 relative overflow-hidden">
      {/* Background glow mapping */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-golden-orange/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sindoor-red/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl text-sindoor-red mb-4">পূজা প্যাকেজ</h2>
          <p className="font-bengali text-lg text-gray-600">সব চিন্তা দূরে রেখে, নিশ্চিন্তে হোক আরাধনা</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border ${index === 1 ? 'border-golden-orange shadow-[0_10px_40px_rgba(255,140,0,0.15)] scale-105 z-10' : 'border-soft-gold/30 shadow-lg scale-100'} flex flex-col cursor-none group hover:-translate-y-2 transition-transform`}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sindoor-red to-golden-orange text-white font-bengali text-xs px-4 py-1 rounded-full shadow-md">
                  জনপ্রিয়
                </div>
              )}
              
              <h3 className="font-heading text-2xl text-gray-800 text-center mb-2">{pkg.title}</h3>
              <div className="text-center mb-6 border-b border-gray-100 pb-6">
                <span className="font-bengali text-4xl font-bold text-sindoor-red">৳{pkg.price}</span>
                <p className="text-sm text-green-600 font-bengali mt-2 bg-green-50 w-max mx-auto px-3 py-1 rounded-full">
                  সাশ্রয় ৳{pkg.savings}
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {pkg.inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-600 font-bengali text-sm md:text-base">
                    <CheckCircle2 size={18} className="text-golden-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-xl font-bengali font-semibold text-lg flex items-center justify-center gap-2 cursor-none transition-all ${index === 1 ? 'bg-gradient-to-r from-sindoor-red to-golden-orange text-white shadow-md hover:shadow-lg' : 'bg-matte-sandal text-sindoor-red border border-soft-gold hover:bg-soft-gold/20'}`}>
                <ShoppingBag size={20} />
                প্যাকেজটি কিনুন
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
