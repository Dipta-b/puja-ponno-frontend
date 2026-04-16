import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const navLinks = ["পূজার সামগ্রী", "প্যাকেজ", "শুদ্ধতার গল্প"];


  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUser(null);
        setIsMobileMenuOpen(false);
        setShowLogoutModal(true);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-matte-sandal/80 backdrop-blur-md border-b border-soft-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">

          {/* LOGO + MENU */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden text-gray-600 hover:text-sindoor-red"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl">🪔</span>
              <span className="font-heading text-2xl text-sindoor-red">
                নিত্য পূজা
              </span>
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="text-gray-700 hover:text-orange-500"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600"
              >
                <UserCircle size={20} />
                <span>লগআউট করুন</span>
              </button>
            ) : (
              <Link
                to="/register"
                className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600"
              >
                <UserCircle size={20} />
                <span>রেজিস্টার করুন</span>
              </Link>
            )}

            <Link to="/cart" className="relative">
              <ShoppingBag size={24} />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full px-1">
                2
              </span>
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600"
              >
                ড্যাশবোর্ড
              </Link>
            )}

          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white shadow-lg overflow-hidden"
            >
              <div className="flex flex-col px-6 py-6 gap-6">
                {navLinks.map((item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg text-gray-800"
                  >
                    {item}
                  </a>
                ))}

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-red-600 text-lg"
                  >
                    <UserCircle size={24} />
                    <span>ড্যাশবোর্ড</span>
                  </Link>
                )}

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-600 text-lg"
                  >
                    <UserCircle size={24} />
                    <span>লগআউট করুন</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-red-600 text-lg"
                  >
                    <UserCircle size={24} />
                    <span>লগইন করুন</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-xl text-center shadow-xl">
            <h2 className="text-xl font-bold text-green-600">
              লগআউট সফল হয়েছে
            </h2>

            <p className="text-gray-600 mt-2">
              আপনি সফলভাবে সিস্টেম থেকে বের হয়েছেন
            </p>

            <button
              onClick={() => setShowLogoutModal(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </header>
  );
}