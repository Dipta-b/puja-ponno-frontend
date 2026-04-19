import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, Tag } from 'lucide-react';
import { blogs } from '../../data/mockDb';

export default function BlogPreview() {
  // Show the latest 3 blogs in the preview
  const latestBlogs = blogs.slice(0, 3);

  return (
    <section id="blog" className="py-24 relative bg-matte-sandal overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-soft-gold/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-golden-orange/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-sindoor-red/5 text-sindoor-red text-base font-bengali font-bold mb-6 border border-sindoor-red/10"
          >
            <Tag size={16} />
            পবিত্র ব্লগ সংবাদ
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-5xl md:text-7xl text-sindoor-red mb-8"
          >
            ধর্ম ও দর্শন সংবাদ
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-bengali text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            পূজার নিয়ম, শাস্ত্রীয় মাহাত্ম্য এবং নিত্য উপাচার সম্পর্কে জানুন যা আপনার আধ্যাত্মিক জীবনকে সমৃদ্ধ করবে
          </motion.p>
        </div>
        
        {/* Larger Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {latestBlogs.map((blog, i) => (
            <motion.div 
              key={blog._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group bg-white rounded-[3rem] overflow-hidden border border-soft-gold/10 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_70px_-15px_rgba(178,34,34,0.15)] transition-all duration-500 flex flex-col cursor-none"
            >
              {/* Image Container - Larger height */}
              <div className="relative h-80 overflow-hidden">
                <motion.img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-5 py-2 rounded-full text-sindoor-red text-sm font-bengali font-bold shadow-sm border border-soft-gold/20">
                  {blog.category}
                </div>
              </div>

              {/* Content Container - More padding and larger text */}
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-5 text-sm font-bengali text-gray-400 mb-8">
                  <div className="flex items-center gap-2 bg-matte-sandal px-4 py-1.5 rounded-full border border-soft-gold/10 font-medium">
                    <Calendar size={14} className="text-golden-orange" />
                    {blog.date}
                  </div>
                  <div className="flex items-center gap-2 bg-matte-sandal px-4 py-1.5 rounded-full border border-soft-gold/10 font-medium">
                    <Clock size={14} className="text-golden-orange" />
                    {blog.readTime} পড়া
                  </div>
                </div>
                
                <h3 className="font-heading text-3xl text-gray-800 mb-6 leading-[1.3] line-clamp-2 group-hover:text-sindoor-red transition-colors duration-300">
                  {blog.title}
                </h3>
                
                <p className="font-bengali text-gray-600 mb-10 leading-relaxed line-clamp-3 text-lg">
                  {blog.excerpt}
                </p>
                
                <div className="mt-auto pt-8 border-t border-gray-50">
                  <Link 
                    to={`/blog/${blog._id}`} 
                    className="group/btn font-bengali text-golden-orange font-bold flex items-center gap-3 hover:text-sindoor-red transition-all duration-300 w-max text-lg"
                  >
                    বিস্তারিত পড়ুন 
                    <ArrowRight size={22} className="transition-transform duration-300 group-hover/btn:translate-x-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/blogs" 
              className="group relative font-bengali font-bold text-xl px-12 py-5 bg-white text-sindoor-red border-2 border-sindoor-red/20 rounded-full hover:bg-sindoor-red hover:text-white transition-all duration-300 cursor-none overflow-hidden shadow-xl shadow-sindoor-red/5 flex items-center gap-4"
            >
              সবগুলো ব্লগ দেখুন
              <ArrowRight size={24} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
