import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Wallet, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const [deliveryArea, setDeliveryArea] = useState('inside');
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const deliveryCharge = deliveryArea === 'inside' ? 60 : 120;
  
  // Dummy subtotal
  const subtotal = 750;
  const total = subtotal + deliveryCharge;

  return (
    <div className="min-h-screen bg-matte-sandal pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl md:text-4xl text-sindoor-red mb-8 text-center">নিরাপদ চেকআউট</h1>
        
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* User Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-soft-gold/30"
          >
            <h2 className="font-bengali text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">ডেলিভারি তথ্য</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="আপনার নাম" className="w-full p-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:border-golden-orange font-bengali cursor-none" required />
                <input type="tel" placeholder="মোবাইল নাম্বার" className="w-full p-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:border-golden-orange font-bengali cursor-none" required />
              </div>
              <textarea placeholder="সম্পূর্ণ ঠিকানা" rows="3" className="w-full p-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:border-golden-orange font-bengali cursor-none resize-none" required></textarea>
              
              <div className="pt-2">
                <label className="font-bengali text-gray-700 block mb-2 font-medium">ডেলিভারি এরিয়া</label>
                <div className="flex gap-4">
                  <label className={`flex-1 p-3 rounded-xl border flex items-center gap-2 cursor-none transition-colors ${deliveryArea === 'inside' ? 'border-sindoor-red bg-sindoor-red/5' : 'border-gray-200 bg-white/50'}`}>
                    <input type="radio" name="area" checked={deliveryArea === 'inside'} onChange={() => setDeliveryArea('inside')} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${deliveryArea === 'inside' ? 'border-sindoor-red' : 'border-gray-400'}`}>
                      {deliveryArea === 'inside' && <div className="w-2 h-2 rounded-full bg-sindoor-red" />}
                    </div>
                    <span className="font-bengali">ঢাকার ভেতরে (৳৬০)</span>
                  </label>
                  <label className={`flex-1 p-3 rounded-xl border flex items-center gap-2 cursor-none transition-colors ${deliveryArea === 'outside' ? 'border-sindoor-red bg-sindoor-red/5' : 'border-gray-200 bg-white/50'}`}>
                    <input type="radio" name="area" checked={deliveryArea === 'outside'} onChange={() => setDeliveryArea('outside')} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${deliveryArea === 'outside' ? 'border-sindoor-red' : 'border-gray-400'}`}>
                      {deliveryArea === 'outside' && <div className="w-2 h-2 rounded-full bg-sindoor-red" />}
                    </div>
                    <span className="font-bengali">ঢাকার বাইরে (৳১২০)</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Special Instructions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-soft-gold/30"
          >
            <h2 className="font-bengali text-xl font-semibold text-gray-800 mb-2">বিশেষ নির্দেশনা</h2>
            <p className="font-bengali text-sm text-gray-500 mb-4">যেকোনো বিশেষ নির্দেশ থাকলে এখানে লিখুন (যেমন: "তেলটা যেন কাঁচের বোতলে হয়")</p>
            <textarea placeholder="আপনার নির্দেশনা..." rows="2" className="w-full p-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:border-golden-orange font-bengali cursor-none resize-none"></textarea>
          </motion.div>

          {/* Payment Method */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-soft-gold/30"
          >
            <h2 className="font-bengali text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">পেমেন্ট মেথড</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'bkash', label: 'bKash', icon: Wallet },
                { id: 'nagad', label: 'Nagad', icon: Wallet },
                { id: 'card', label: 'Card/SSL', icon: CreditCard },
                { id: 'cod', label: 'Cash on Delivery', icon: Truck },
              ].map(method => (
                <label key={method.id} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-none transition-all ${paymentMethod === method.id ? 'border-golden-orange bg-golden-orange/5 shadow-inner' : 'border-gray-200 bg-white/50 opacity-70 hover:opacity-100'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="hidden" />
                  <method.icon size={24} className={paymentMethod === method.id ? 'text-golden-orange' : 'text-gray-400'} />
                  <span className="font-bengali text-sm font-medium text-center">{method.label}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-sindoor-red/5 p-6 rounded-2xl border border-sindoor-red/20"
          >
            <h2 className="font-bengali text-xl font-semibold text-sindoor-red mb-4">অর্ডার সারসংক্ষেপ</h2>
            <div className="space-y-2 mb-4 font-bengali text-gray-700">
              <div className="flex justify-between">
                <span>সাবটোটাল</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ</span>
                <span>৳{deliveryCharge}</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-sindoor-red/20 pt-4 font-bengali font-bold text-xl text-gray-900 mb-6">
              <span>সর্বমোট</span>
              <span className="text-sindoor-red">৳{total}</span>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-sindoor-red to-golden-orange text-white rounded-xl font-bengali font-semibold text-lg flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(178,34,34,0.3)] cursor-none"
            >
              <CheckCircle size={20} />
              অর্ডার কনফার্ম করুন
            </motion.button>
          </motion.div>

        </form>
      </div>
    </div>
  );
}
