import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();

  const updateQuantity = (item, delta) => {
    addToCart(item, delta, true);
  };

  const removeItem = (id) => {
    removeFromCart(id);
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const priceToUse = item.discountPrice || item.price;
    return sum + (priceToUse * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-matte-sandal pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl md:text-4xl text-sindoor-red mb-8">আপনার শপিং কার্ট</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="font-bengali text-2xl text-gray-600 mb-4">আপনার কার্ট খালি</h2>
            <Link to="/" className="inline-block px-8 py-3 bg-gradient-to-r from-sindoor-red to-golden-orange text-white rounded-full font-bengali cursor-none shadow-md">
              কেনাকাটা শুরু করুন
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-grow space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-soft-gold/30 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 relative"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img src={item.thumbnail || "https://placehold.co/400x300?text=No+Image"} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-100" />
                    <div className="flex-grow sm:flex-grow-0">
                      <h3 className="font-heading text-lg sm:text-xl text-gray-800">{item.name}</h3>
                      <p className="font-bengali text-sindoor-red font-bold text-lg">
                        ৳{Math.round(item.discountPrice || item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex-grow hidden sm:block"></div>

                  <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="flex items-center gap-3 bg-matte-sandal rounded-full px-3 py-1.5 sm:py-1 border border-gray-200">
                      <button onClick={() => updateQuantity(item, -1)} className="text-gray-500 hover:text-sindoor-red transition-colors p-1">
                        <Minus size={16} />
                      </button>
                      <span className="font-bengali font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item, 1)} className="mr-4 text-gray-500 hover:text-green-600 transition-colors p-1">
                        <Plus size={16} />
                      </button>
                    </div>

                    <button onClick={() => removeItem(item._id)} className="p-2 text-gray-400 hover:text-sindoor-red transition-colors sm:absolute sm:top-auto sm:right-4 bg-gray-50 sm:bg-transparent rounded-full sm:rounded-none">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearCart}
                  className="text-red-500 font-bengali text-sm hover:underline flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} /> পুরো কার্ট মুছে ফেলুন
                </button>
              </div>
            </div>

            {/* Order Summary sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-80 shrink-0"
            >
              <div className="bg-sindoor-red/5 p-6 rounded-2xl border border-sindoor-red/20 sticky top-24">
                <h2 className="font-bengali text-xl font-semibold text-sindoor-red mb-6 border-b border-sindoor-red/10 pb-4">অর্ডারের সারসংক্ষেপ</h2>

                <div className="space-y-3 mb-6 font-bengali text-gray-700">
                  <div className="flex justify-between">
                    <span>মোট আইটেম</span>
                    <span>{cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} টি</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-sindoor-red/10">
                    <span>সাবটোটাল</span>
                    <span className="text-sindoor-red">৳{Math.round(subtotal)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="w-full py-4 bg-gradient-to-r from-sindoor-red to-golden-orange text-white rounded-xl font-bengali font-semibold text-lg flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(178,34,34,0.3)] hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-none group">
                  চেকআউট করুন
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="font-bengali text-xs text-gray-500 text-center mt-4">
                  ডেলিভারি চার্জ চেকআউট পেজে হিসাব করা হবে
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
