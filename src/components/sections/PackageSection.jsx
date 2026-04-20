import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ShoppingCart, Info, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';


const API = 'http://localhost:5000';

export default function PackageSection() {
  const [packages, setPackages] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();


  useEffect(() => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Packages are those either in "puja-packages" category or with a defined duration > 0
          const pkgs = data.filter(p => p.categorySlug === 'puja-packages' || p.duration);
          setPackages(pkgs);
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (packages.length === 0) return null;
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
          {packages.map((pkg, index) => {
            const isPopular = index === 1; // Or check pkg.isBestSeller if you prefer
            return (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border ${isPopular ? 'border-golden-orange shadow-[0_10px_40px_rgba(255,140,0,0.15)] scale-105 z-10' : 'border-soft-gold/30 shadow-lg scale-100'} flex flex-col cursor-none group hover:-translate-y-2 transition-transform`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sindoor-red to-golden-orange text-white font-bengali text-xs px-4 py-1 rounded-full shadow-md z-20">
                    জনপ্রিয়
                  </div>
                )}

                {/* Info Button */}
                <button
                  onClick={() => setSelectedProduct(pkg)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-sindoor-red transition-colors z-20"
                  title="বিস্তারিত দেখুন"
                >
                  <Info size={20} />
                </button>

                
                <h3 className="font-heading text-2xl text-gray-800 text-center mb-2">{pkg.name || pkg.title}</h3>
                <div className="text-center mb-6 border-b border-gray-100 pb-6">
                  <span className="font-bengali text-4xl font-bold text-sindoor-red">৳{pkg.price}</span>
                  {pkg.discount > 0 && (
                    <p className="text-sm text-green-600 font-bengali mt-2 bg-green-50 w-max mx-auto px-3 py-1 rounded-full">
                      সাশ্রয় ৳{pkg.discount}
                    </p>
                  )}
                  {pkg.duration > 0 && (
                     <p className="text-xs text-gray-500 mt-2 font-bengali uppercase tracking-widest">{pkg.duration} দিনের প্ল্যান</p>
                  )}
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {(pkg.items || pkg.itemsIncluded || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600 font-bengali text-sm md:text-base">
                      <CheckCircle2 size={18} className="text-golden-orange shrink-0 mt-0.5" />
                      <span>{item.name || item} {item.quantity ? `(${item.quantity})` : ''}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => addToCart(pkg, 1, true)}
                  className={`w-full py-4 rounded-2xl font-bengali font-semibold text-lg flex items-center justify-center gap-3 transition-all ${isPopular ? 'bg-gradient-to-r from-sindoor-red to-golden-orange text-white shadow-xl shadow-sindoor-red/10 hover:shadow-sindoor-red/30' : 'bg-black text-white hover:bg-sindoor-red shadow-lg'}`}
                >
                  <ShoppingCart size={20} />
                  প্যাকেজটি নির্বাচন করুন
                </button>

              </motion.div>
            );
          })}
        </div>
      </div>

      {/* --- PACKAGE DETAIL MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-gray-100 text-gray-600 transition-all z-20"
            >
              <X size={20} />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-50 relative">
              <img
                src={selectedProduct.thumbnail || "https://placehold.co/600x800?text=Package+Image"}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto flex flex-col">
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    পূজা প্যাকেজ
                  </span>
                  {selectedProduct.duration > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full">
                      {selectedProduct.duration} দিনের প্ল্যান
                    </span>
                  )}
                </div>
                <h3 className="text-3xl font-heading text-gray-900 leading-tight">
                  {selectedProduct.name}
                </h3>
                <p className="text-[10px] font-mono text-gray-400 mt-2 uppercase tracking-tighter">
                  ID: {selectedProduct._id}
                </p>
              </div>

              <div className="flex items-center gap-6 mb-8 font-bengali">
                <span className="text-3xl font-black text-sindoor-red">৳{selectedProduct.price}</span>
                <div className="h-8 w-px bg-gray-100" />
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">বুকিং ওপেন</p>
              </div>

              <div className="space-y-6 flex-grow">
                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-100 mb-2">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-1">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase">সম্পূর্ণ আয়োজন</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-1">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase">বিশুদ্ধ সামগ্রী</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-1">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase">নিরাপদ পেমেন্ট</p>
                  </div>
                </div>

                <div className="prose prose-sm text-gray-600 font-bengali leading-relaxed">
                  <p>{selectedProduct.description || 'এই প্যাকেজটির মাধ্যমে আপনি পাবেন সম্পূর্ণ ধর্মীয় আনুষ্ঠানিকতা এবং পবিত্র সামগ্রীর নিশ্চয়তা।'}</p>
                </div>

                {/* Items Included Section */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-b border-gray-200 pb-3 mb-4 font-bengali">
                    প্যাকেজের অন্তর্ভুক্ত সামগ্রী
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {(selectedProduct.items || selectedProduct.itemsIncluded || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700 font-bengali">
                        <CheckCircle2 size={14} className="text-golden-orange shrink-0" />
                        <span className="font-bold">{item.name || item}</span>
                        {item.quantity && <span className="text-gray-400">({item.quantity})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => { addToCart(selectedProduct, 1, true); setSelectedProduct(null); }}
                  className="w-full bg-gradient-to-r from-sindoor-red to-golden-orange text-white py-4 rounded-2xl font-bold shadow-xl shadow-sindoor-red/10 hover:shadow-sindoor-red/30 transition-all flex items-center justify-center gap-3 font-bengali text-lg"
                >
                  <ShoppingCart size={22} /> নির্বাচন করুন
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>

  );
}
