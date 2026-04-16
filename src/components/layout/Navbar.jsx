import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useCo

  const navLinks = ['পূজার সামগ্রী', 'প্যাকেজ', 'শুদ্ধতার গল্প'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-matte-sandal/80 backdrop-blur-md border-b border-soft-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 mr-2 md:hidden text-gray-600 hover:text-sindoor-red transition-colors cursor-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="flex items-center gap-2 cursor-none">
              <motion.div
                initial={{ rotate: -15 }}
                animate={{ rotate: 15 }}
                transition={{ repeat: Infinity, duration: 2.5, repeatType: "reverse", ease: "easeInOut" }}
                className="text-3xl"
              >
                🪔
              </motion.div>
              <span className="font-heading text-3xl text-sindoor-red tracking-wide relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-soft-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
                নিত্য পূজা
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <a key={item} href={`#${item}`} className="font-bengali font-medium text-gray-700 hover:text-golden-orange transition-colors cursor-none">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/register" className="hidden md:flex items-center gap-2 font-bengali text-gray-700 hover:text-sindoor-red transition-colors cursor-none">
              <UserCircle size={20} />
              <span className="font-medium text-sm">রেজিস্টার করুন</span>
            </Link>
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-sindoor-red transition-colors cursor-none">
              <ShoppingBag size={24} />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 w-5 h-5 bg-golden-orange text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-matte-sandal"
              >
                2
              </motion.span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-soft-gold/20 shadow-lg overflow-hidden flex flex-col"
            >
              <div className="flex flex-col px-6 py-6 gap-6">
                {navLinks.map((item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-bengali text-lg font-medium text-gray-800 hover:text-golden-orange transition-colors border-b border-gray-100 pb-2 cursor-none"
                  >
                    {item}
                  </a>
                ))}

                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 font-bengali text-lg font-medium text-sindoor-red hover:text-golden-orange transition-colors mt-2 cursor-none"
                >
                  <UserCircle size={24} />
                  <span>রেজিস্টার করুন</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
