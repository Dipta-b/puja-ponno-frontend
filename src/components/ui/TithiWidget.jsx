import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function TithiWidget() {
  const currentTithi = "পূর্ণিমা তিথি";
  const auspiciousTime = "সকাল ৬:৩০ - ৮:৪৫";

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="bg-white/60 backdrop-blur-md border border-soft-gold/20 rounded-full px-4 py-2 flex items-center space-x-3 shadow-sm mx-auto w-max"
    >
      <Sparkles className="text-golden-orange" size={16} />
      <span className="font-bengali text-sm font-medium text-gray-700">
        আজকের তিথি: <span className="text-sindoor-red font-semibold">{currentTithi}</span>
      </span>
      <div className="w-1 h-1 rounded-full bg-gray-300" />
      <span className="font-bengali text-sm text-gray-600">
        শুভ সময়: {auspiciousTime}
      </span>
    </motion.div>
  );
}
