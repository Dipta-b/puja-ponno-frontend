import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { blogs } from '../../data/mockDb';

export default function BlogPreview() {
  return (
    <section id="blog" className="py-24 relative bg-matte-sandal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl text-sindoor-red mb-4"
          >
            ধর্ম ও দর্শন সংবাদ
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-bengali text-lg text-gray-600"
          >
            পূজার নিয়ম, মাহাত্ম্য এবং উপাচার সম্পর্কে জানুন
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog, i) => (
            <motion.div 
              key={blog._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-3xl border border-soft-gold/20 overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(255,140,0,0.1)] transition-shadow group flex flex-col cursor-none"
            >
              <div className="p-8 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center gap-4 text-xs font-bengali text-gray-400 mb-6 font-medium">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                      <Calendar size={12} className="text-golden-orange" />
                      {blog.date}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                      <Clock size={12} className="text-golden-orange" />
                      {blog.readTime} পড়া
                    </div>
                  </div>
                  
                  <h3 className="font-heading text-2xl text-gray-800 mb-4 leading-normal group-hover:text-sindoor-red transition-colors">
                    {blog.title}
                  </h3>
                  <p className="font-bengali text-gray-500 mb-8 leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>
                
                <a href="#readmore" className="font-bengali text-golden-orange font-semibold flex items-center gap-2 group-hover:gap-3 transition-all mt-auto w-max text-sm">
                  বিস্তারিত পড়ুন <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <motion.a 
            href="#all-blogs" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-bengali font-semibold text-lg px-8 py-3 bg-white text-sindoor-red border-2 border-sindoor-red/20 rounded-full hover:bg-sindoor-red/5 transition-colors cursor-none"
          >
            সবগুলো ব্লগ দেখুন
          </motion.a>
        </div>
      </div>
    </section>
  );
}
