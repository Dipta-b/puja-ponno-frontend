import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { reviews } from '../../data/mockDb';

export default function TrustAndReviews() {
  return (
    <section className="py-24 relative bg-sindoor-red/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Packaging Video Layout */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-sindoor-red leading-tight">
              নিরাপদ ও প্রিমিয়াম <br /> প্যাকেজিং
            </h2>
            <p className="font-bengali text-lg text-gray-600 leading-relaxed max-w-md">
              আমরা জানি পূজার সামগ্রীর পবিত্রতা কতটা গুরুত্বপূর্ণ। তাই প্রতিটি বক্স অত্যন্ত পরম যত্নে প্যাক করা হয় যাতে আপনার হাতে নিরাপদে পৌঁছায়।
            </p>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="mt-4 relative aspect-video bg-gradient-to-tr from-matte-sandal to-soft-gold/30 rounded-3xl border-2 border-golden-orange/20 overflow-hidden shadow-[0_10px_40px_rgba(255,140,0,0.1)] flex items-center justify-center cursor-none group"
            >
              {/* Dummy Image Layer */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
              <img 
                src="https://images.unsplash.com/photo-1616012480717-fd9867059ca0?auto=format&fit=crop&q=80&w=800" 
                alt="Packaging Process" 
                className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
              />
              
              <div className="relative z-20 flex flex-col items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 bg-white/30 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center text-white shadow-lg"
                >
                  <Play size={24} className="ml-1" fill="currentColor" />
                </motion.div>
                <p className="font-bengali text-white text-sm font-medium tracking-wide shadow-black drop-shadow-md">
                  প্যাকেজিং ভিডিও দেখুন
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Feedback Section */}
          <div className="flex flex-col gap-6">
            <h2 className="font-heading text-4xl text-golden-orange mb-4 text-center lg:text-left">গ্রাহকের বিশ্বাস</h2>
            
            <div className="flex flex-col gap-6">
              {reviews.map((review, i) => (
                <motion.div 
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-soft-gold/30 shadow-sm cursor-none"
                >
                  <div className="flex gap-1 text-golden-orange mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  
                  <p className="font-bengali text-gray-700 italic leading-relaxed mb-6">
                    "{review.text}"
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sindoor-red to-golden-orange text-white flex items-center justify-center font-bengali text-xl font-bold">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bengali font-bold text-gray-900">{review.author}</h4>
                      <span className="font-bengali text-sm text-gray-500">{review.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
