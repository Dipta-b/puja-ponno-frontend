import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, Tag, ChevronLeft } from 'lucide-react';
import { blogs } from '../data/mockDb';

export default function Blogs() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-matte-sandal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sindoor-red font-bengali font-bold mb-8 hover:gap-3 transition-all">
            <ChevronLeft size={20} />
            হোমে ফিরে যান
          </Link>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-heading text-5xl md:text-7xl text-sindoor-red mb-6"
          >
            সনাতন ধর্ম ও দর্শন
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-bengali text-2xl text-gray-600 max-w-3xl leading-relaxed"
          >
            আমাদের সমৃদ্ধ সংস্কৃতির নানা দিক, পূজার নিয়ম এবং শাস্ত্রীয় আলোচনার এক পবিত্র সংগ্রহশালা।
          </motion.p>
        </div>

        {/* Blogs Grid - Larger Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {blogs.map((blog, i) => (
            <motion.div 
              key={blog._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-[3rem] overflow-hidden border border-soft-gold/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_-15px_rgba(178,34,34,0.15)] transition-all duration-700 flex flex-col md:flex-row h-full"
            >
              {/* Image Section */}
              <div className="md:w-2/5 relative h-72 md:h-auto overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sindoor-red text-sm font-bengali font-bold shadow-sm border border-soft-gold/20">
                  {blog.category}
                </div>
              </div>

              {/* Content Section */}
              <div className="md:w-3/5 p-10 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm font-bengali text-gray-400 mb-6 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-golden-orange" />
                    {blog.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-golden-orange" />
                    {blog.readTime} পড়া
                  </div>
                </div>
                
                <h2 className="font-heading text-3xl md:text-4xl text-gray-800 mb-6 leading-[1.3] group-hover:text-sindoor-red transition-colors duration-300">
                  {blog.title}
                </h2>
                
                <p className="font-bengali text-gray-500 mb-8 leading-relaxed text-lg line-clamp-3">
                  {blog.excerpt}
                </p>
                
                <Link 
                  to={`/blog/${blog._id}`} 
                  className="group/btn font-bengali text-golden-orange font-bold flex items-center gap-2 hover:text-sindoor-red transition-all duration-300 w-max text-lg"
                >
                  বিস্তারিত পড়ুন 
                  <ArrowRight size={22} className="transition-transform duration-300 group-hover/btn:translate-x-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
