import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Edit, Trash2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const API = 'http://localhost:5000';

export default function TrustAndReviews() {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);

  // Form State
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API}/comments`);
      const data = await res.json();
      if (Array.isArray(data)) setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to post a review!");

    try {
      if (editingId) {
        const res = await fetch(`${API}/comments/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ rating, description })
        });
        if (res.ok) {
          setEditingId(null);
          setRating(5);
          setDescription("");
          fetchComments();
        }
      } else {
        const res = await fetch(`${API}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ productId: "homepage", rating, description })
        });
        if (res.ok) {
          setRating(5);
          setDescription("");
          fetchComments();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setRating(comment.rating);
    setDescription(comment.description);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      const res = await fetch(`${API}/comments/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) fetchComments();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <section className="py-24 relative bg-sindoor-red/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Packaging Video Layout */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-sindoor-red leading-tight">
              নিরাপদ ও প্রিমিয়াম <br /> প্যাকেজিং
            </h2>
            <p className="font-bengali text-lg text-gray-600 leading-relaxed max-w-md">
              আমরা জানি পূজার সামগ্রীর পবিত্রতা কতটা গুরুত্বপূর্ণ। তাই প্রতিটি বক্স অত্যন্ত পরম যত্নে প্যাক করা হয় যাতে আপনার হাতে নিরাপদে পৌঁছায়।
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-4 relative aspect-video bg-gradient-to-tr from-matte-sandal to-soft-gold/30 rounded-3xl border-2 border-golden-orange/20 overflow-hidden shadow-[0_10px_40px_rgba(255,140,0,0.1)] flex items-center justify-center cursor-none group"
            >
              {/* Dummy Image Layer */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
              <img
                src="https://images.unsplash.com/photo-1616012480717-fd9867059ca0?auto=format&fit=crop&q=80&w=800"
                alt="Packaging Process"
                className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
              />

              <div className="relative z-20 flex flex-col items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 bg-white/30 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center text-white shadow-lg"
                >
                  <Play size={24} className="ml-1" fill="currentColor" />
                </motion.div>
                <p className="font-bengali text-white text-sm font-medium tracking-wide shadow-black drop-shadow-md">
                  প্যাকেজিং ভিডিও দেখুন
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Feedback Section */}
          <div className="flex flex-col gap-6">
            <h2 className="font-heading text-4xl text-golden-orange mb-4 text-center lg:text-left">গ্রাহকের বিশ্বাস</h2>

            <div className="flex flex-col gap-6 max-h-[500px] overflow-y-auto pr-2 hide-scrollbar">
              {comments.length > 0 ? comments.slice(0, 10).map((review, i) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-soft-gold/30 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-1 text-golden-orange">
                      {[...Array(review.rating || 5)].map((_, idx) => (
                        <Star key={idx} size={16} fill="currentColor" />
                      ))}
                    </div>
                    {(user && (user.id === review.userId || user._id === review.userId || user.role === 'admin')) && (
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(review)} className="text-gray-400 hover:text-orange-500 transition"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(review._id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
                      </div>
                    )}
                  </div>

                  <p className="font-bengali text-gray-700 italic leading-relaxed mb-6 whitespace-pre-wrap">
                    "{review.description}"
                  </p>

                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sindoor-red to-golden-orange text-white flex items-center justify-center font-bengali text-xl font-bold shrink-0">
                      {(review.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bengali font-bold text-gray-900">{user?.name}</h4>
                      <span className="font-bengali text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <p className="text-gray-500 text-center italic font-bengali py-10">এখনো কোনো মতামত নেই।</p>
              )}
            </div>

            {/* Comment Form */}
            {user ? (
              <div className="mt-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-soft-gold/30 shadow-sm shrink-0">
                <h3 className="font-heading text-xl text-gray-800 mb-4">{editingId ? 'মতামত পরিবর্তন করুন' : 'আপনার মতামত দিন'}</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bengali text-gray-600">রেটিং:</span>
                    {[1, 2, 3, 4, 5].map(num => (
                      <Star
                        key={num}
                        size={20}
                        className={`cursor-pointer transition-colors ${rating >= num ? 'text-golden-orange' : 'text-gray-300'}`}
                        fill={rating >= num ? "currentColor" : "none"}
                        onClick={() => setRating(num)}
                      />
                    ))}
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="আপনার মতামত লিখুন..."
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-golden-orange outline-none font-bengali resize-none h-24"
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 px-6 py-2 bg-gradient-to-r from-sindoor-red to-golden-orange hover:shadow-lg text-white font-bengali font-bold tracking-wide rounded-xl transition">
                      {editingId ? 'আপডেট করুন' : 'পোস্ট করুন'}
                    </button>
                    {editingId && (
                      <button type="button" onClick={() => { setEditingId(null); setDescription(''); setRating(5); }} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bengali font-bold rounded-xl transition">
                        বাতিল
                      </button>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="mt-4 text-center bg-white/50 p-6 rounded-2xl border border-gray-100 shrink-0">
                <p className="font-bengali text-gray-600">মতামত জানাতে <a href="/login" className="text-sindoor-red font-bold hover:underline">লগিন</a> করুন</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
