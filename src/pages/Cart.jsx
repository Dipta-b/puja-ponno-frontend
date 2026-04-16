import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/mockDb';

export default function Cart() {
  // Mock cart items based on the first two products
  const [cartItems, setCartItems] = useState([
    { ...products[0], quantity: 2 },
    { ...products[3], quantity: 1 }
  ]);

  const updateQuantity = (id, delta) => {
    setCartItems(items => 
      items.map(item => 
        item._id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item._id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
                  className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-soft-gold/30 shadow-sm flex items-center gap-4 cursor-none relative"
                >
                  <img src={item.images[0]} alt={item.title} className="w-24 h-24 object-cover rounded-xl border border-gray-100" />
                  
                  <div className="flex-grow">
                    <h3 className="font-heading text-xl text-gray-800">{item.title}</h3>
                    <p className="font-bengali text-sindoor-red font-bold text-lg">৳{item.price}</p>
                  </div>

                  <div className="flex items-center gap-3 bg-matte-sandal rounded-full px-3 py-1 border border-gray-200">
                    <button onClick={() => updateQuantity(item._id, -1)} className="text-gray-500 hover:text-sindoor-red transition-colors">
                      <Minus size={16} />
                    </button>
                    <span className="font-bengali font-bold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, 1)} className="text-gray-500 hover:text-green-600 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>

                  <button onClick={() => removeItem(item._id)} className="p-2 text-gray-400 hover:text-sindoor-red transition-colors absolute top-4 right-4 lg:relative lg:top-auto lg:right-auto">
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
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
                    <span className="text-sindoor-red">৳{subtotal}</span>
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
