import React from 'react';
import { motion } from 'framer-motion';

export default function StorySection() {
  return (
    <section id="শুদ্ধতার গল্প" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative inline-block mb-8"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-golden-orange z-10 relative px-6 py-2">
            শুদ্ধতার গল্প
          </h2>
          {/* Background gold foil effect stroke */}
          <div className="absolute inset-0 border border-soft-gold/40 rounded-full -rotate-2 scale-110 z-0"></div>
          <div className="absolute inset-0 border border-soft-gold/30 rounded-full rotate-2 scale-105 z-0"></div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-bengali text-xl md:text-2xl leading-loose font-light text-gray-600"
        >
          “ভোরবেলার শান্ত আলোয় শঙ্খধ্বনি আর ধূপের ঘ্রাণে শুরু হোক আপনার প্রতিটি দিন। 
          শুদ্ধ ভক্তি আর পরম শান্তির এই আয়োজনে আমরা বিশ্বাস করি প্রতিটি উপাদান হওয়া চাই প্রাকৃতিক ও পবিত্র। 
          আমাদের প্রতিটি সামগ্রী সেই পরম আস্থার কথা মাথায় রেখেই সযত্নে প্রস্তুত।”
        </motion.p>
      </div>
    </section>
  );
}
