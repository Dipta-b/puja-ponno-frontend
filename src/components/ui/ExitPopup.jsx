import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ExitPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  return (
    <AnimatePresence>
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-none"
            onClick={() => setShowPopup(false)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-matte-sandal border border-soft-gold/30 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center overflow-hidden z-10"
          >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-golden-orange/40 rounded-tl-xl opacity-50 m-2" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-golden-orange/40 rounded-tr-xl opacity-50 m-2" />
            
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-sindoor-red transition-colors"
            >
              <X size={20} />
            </button>
            
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", ease: "easeInOut" }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-soft-gold to-golden-orange rounded-full flex items-center justify-center mb-6 shadow-lg shadow-soft-gold/20"
            >
              <span className="text-3xl">🪔</span>
            </motion.div>
            
            <h3 className="font-heading text-3xl text-sindoor-red mb-3">
              একটু থামুন!
            </h3>
            <p className="font-bengali text-lg text-gray-700 mb-8 leading-relaxed">
              আপনার নিত্য পূজার ডালি কি সাজানো হয়েছে?
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowPopup(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors cursor-none"
              >
                পরে আসবো
              </button>
              <button 
                onClick={() => setShowPopup(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sindoor-red to-golden-orange text-white font-medium shadow-[0_4px_15px_rgba(178,34,34,0.3)] hover:shadow-[0_6px_20px_rgba(178,34,34,0.4)] transition-all cursor-none"
              >
                কেনাকাটা করি
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
