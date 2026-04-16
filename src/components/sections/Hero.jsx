import React from 'react';
import { motion } from 'framer-motion';
import TithiWidget from '../ui/TithiWidget';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Soft Breathing Background Effect */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-soft-gold/20 via-transparent to-transparent -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center">
        <div className="mb-10">
          <TithiWidget />
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl text-sindoor-red mb-6 drop-shadow-sm"
        >
          বিশুদ্ধতার ছোঁয়ায়<br />
          <span className="text-golden-orange">আপনার পূজা</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-bengali text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          শাস্ত্রীয় নিয়মে প্রস্তুত ১০০% প্রাকৃতিক উপাদানে সাজান আপনার নিত্য পূজার ডালি। 
          আমরা পৌঁছে দিচ্ছি ভক্তি ও আস্থার নিশ্চয়তা।
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px 2px rgba(255,140,0,0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="font-bengali font-semibold text-lg px-8 py-4 bg-gradient-to-r from-sindoor-red to-golden-orange text-white rounded-full shadow-[0_4px_15px_rgba(178,34,34,0.3)] cursor-none transition-all"
        >
          পূজার সামগ্রী দেখুন
        </motion.button>

        {/* Decorative Floating Elements */}
        <motion.div
           animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/4 left-[10%] md:left-[20%] text-4xl opacity-60 blur-[1px]"
        >
          🌺
        </motion.div>
        
        <motion.div
           animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 10, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/3 right-[10%] md:right-[20%] text-5xl opacity-50 blur-[1px]"
        >
          🪷
        </motion.div>
      </div>
    </section>
  );
}
