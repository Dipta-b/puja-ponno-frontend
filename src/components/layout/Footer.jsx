import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-transparent to-[#fdf5e6] pt-16 pb-8 border-t border-soft-gold/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="font-heading text-4xl text-sindoor-red block mb-4">নিত্য পূজা</span>
          <p className="font-bengali text-gray-600 max-w-md mx-auto">
            আপনার দৈনন্দিন পূজার জন্য শুদ্ধ ও প্রাকৃতিক উপাদানের এক বিশ্বস্ত ঠিকানা।
          </p>
        </motion.div>
        
        <div className="flex justify-center gap-6 mb-8">
          <p className="text-sm font-bengali text-gray-500">শর্তাবলী</p>
          <p className="text-sm font-bengali text-gray-500">গোপনীয়তা নীতি</p>
          <p className="text-sm font-bengali text-gray-500">রিফান্ড পলিসি</p>
        </div>
        
        <div className="text-gray-400 text-sm font-bengali">
          © {new Date().getFullYear()} Nitya Puja. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
