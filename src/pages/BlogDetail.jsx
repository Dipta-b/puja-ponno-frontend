import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Tag, Share2, Link as LinkIcon } from 'lucide-react';
import { blogs } from '../data/mockDb';

// Custom Brand Icons (since Facebook/Twitter are removed in newer Lucide versions)
const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function BlogDetail() {
  const { id } = useParams();
  const blog = blogs.find(b => b._id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bengali">
        <div className="text-center">
          <h2 className="text-4xl text-sindoor-red mb-4">দুঃখিত, ব্লগটি পাওয়া যায়নি!</h2>
          <Link to="/blogs" className="text-golden-orange font-bold flex items-center justify-center gap-2">
            <ArrowLeft size={20} /> সব ব্লগ দেখুন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-matte-sandal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sindoor-red font-bengali font-bold mb-10 hover:gap-3 transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          সবগুলো ব্লগ
        </Link>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[30rem] rounded-[3rem] overflow-hidden shadow-2xl mb-12"
        >
          <img 
            src={blog.image} 
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-4 text-white/90 text-sm font-bengali mb-4">
              <span className="bg-sindoor-red px-4 py-1.5 rounded-full font-bold">
                {blog.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {blog.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {blog.readTime} পড়া
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl text-white leading-tight">
              {blog.title}
            </h1>
          </div>
        </motion.div>

        {/* Content */}
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl relative -mt-32 z-10 mx-4 md:mx-0">
          <div className="prose prose-lg max-w-none font-bengali">
            <p className="text-2xl text-gray-700 leading-relaxed mb-10 first-letter:text-5xl first-letter:font-heading first-letter:text-sindoor-red first-letter:mr-3 first-letter:float-left">
              {blog.excerpt}
            </p>
            
            <div className="space-y-6 text-xl text-gray-600 leading-loose">
              <p>
                সনাতন ধর্মের গভীরে নিহিত রয়েছে জীবনের প্রকৃত অর্থ। আমাদের এই ব্লগের মাধ্যমে আমরা চেষ্টা করছি সেই সব শাস্ত্রীয় জ্ঞানকে সহজভাবে আপনাদের সামনে তুলে ধরতে। 
              </p>
              <p>
                নিয়মিত পূজা এবং জপ আমাদের মনের অস্থিরতা দূর করে। যখন আমরা শুদ্ধ চিত্তে ঈশ্বরের আরাধনা করি, তখন আমাদের চারপাশের পরিবেশেও এক ইতিবাচক স্পন্দন তৈরি হয়। এটি কেবল ধর্মীয় বিশ্বাস নয়, এর পেছনে রয়েছে হাজার বছরের অভিজ্ঞতা এবং বৈজ্ঞানিক ভিত্তি।
              </p>
              <div className="bg-matte-sandal p-8 rounded-3xl border-l-[6px] border-sindoor-red my-12 italic text-2xl font-heading text-sindoor-red/80">
                "অহিংসা পরম ধর্ম, ধর্ম হিংসা তথৈব চ।"
              </div>
              <p>
                আশা করি আমাদের এই আয়োজন আপনার আধ্যাত্মিক যাত্রায় সহায়ক হবে। নিত্য পূজার সামগ্রী এবং শুদ্ধ উপাচারের জন্য আমাদের ওয়েবসাইটটি নিয়মিত ভিজিট করুন। আপনার কোনো প্রশ্ন থাকলে আমাদের কমেন্ট বক্সে বা সরাসরি যোগাযোগ করে জানাতে পারেন।
              </p>
            </div>
          </div>

          <hr className="my-12 border-gray-100" />

          {/* Social Share */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="font-bengali font-bold text-gray-500">শেয়ার করুন:</span>
              <div className="flex gap-3">
                <button className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                  <FacebookIcon size={20} />
                </button>
                <button className="p-3 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white transition-all">
                  <TwitterIcon size={20} />
                </button>
                <button className="p-3 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-600 hover:text-white transition-all">
                  <LinkIcon size={20} />
                </button>
              </div>
            </div>
            <Link to="/blogs" className="font-bengali font-bold text-sindoor-red px-8 py-3 rounded-full border-2 border-sindoor-red/10 hover:bg-sindoor-red/5 transition-all">
              অন্যান্য ব্লগ পড়ুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
