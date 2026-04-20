import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, ArrowLeft, Info, X, CheckCircle2 } from 'lucide-react';

import { useCart } from '../context/CartContext';

const API = 'http://localhost:5000';

export default function CategoryPage() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const { addToCart, cartItems, removeFromCart } = useCart(); // 🔥 CART

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedProduct, setSelectedProduct] = useState(null);


    useEffect(() => {
        window.scrollTo(0, 0);

        fetch(`${API}/categories`)
            .then(res => res.json())
            .then(data => {
                const predefinedCategories = [
                    { _id: "pre-1", name: "Puja Packages", nameBn: "পূজা প্যাকেজ", slug: "puja-packages" },
                    { _id: "pre-2", name: "Daily Puja Items", nameBn: "নিত্য পূজার সামগ্রী", slug: "daily-puja-items" },
                    { _id: "pre-3", name: "Festival Special", nameBn: "উৎসব স্পেশাল", slug: "festival-special" },
                    { _id: "pre-4", name: "Puja Accessories", nameBn: "পূজার অনুষঙ্গ", slug: "puja-accessories" },
                    { _id: "pre-5", name: "Prasad & Items", nameBn: "প্রসাদ ইত্যাদি", slug: "prasad-items" },
                    { _id: "pre-6", name: "Gift Hampers", nameBn: "উপহার সামগ্রী", slug: "gift-hampers" }
                ];

                const predefinedNames = predefinedCategories.map(p => p.name);
                const fetchedCats = Array.isArray(data) ? data : [];
                const uniqueFetched = fetchedCats.filter(d => !predefinedNames.includes(d.name));
                const allCats = [...predefinedCategories, ...uniqueFetched];

                setCategories(allCats);
            });

        fetch(`${API}/products`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const catProducts = data.filter(p => p.categorySlug === slug);
                    setProducts(catProducts);

                    if (catProducts.length > 0) {
                        setCategoryName(catProducts[0].category || slug);
                    } else {
                        setCategoryName(slug);
                    }
                }
            });

    }, [slug]);

    const filteredProducts = products
        .filter(p =>
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'priceAsc') return a.price - b.price;
            if (sortBy === 'priceDesc') return b.price - a.price;

            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();

            if (sortBy === 'newest') return dateB - dateA;
            if (sortBy === 'oldest') return dateA - dateB;

            return 0;
        });

    // 🔥 helper: cart quantity
    const getQty = (id) => {
        const item = cartItems?.find(i => i._id === id);
        return item?.quantity || 0;
    };

    return (
        <div className="min-h-screen bg-white/40 pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <button onClick={() => navigate(-1)} className="flex items-center font-bengali text-gray-500 hover:text-sindoor-red transition mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> ফিরে যান
                </button>

                {/* PRODUCTS */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <p className="text-gray-500 text-lg font-bengali">
                            কোনো পণ্য পাওয়া যায়নি
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                        {filteredProducts.map((product, index) => {
                            const qty = getQty(product._id);

                            return (
                                <motion.div
                                    key={product._id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                                >

                                    {/* IMAGE */}
                                    <div className="h-56 bg-gray-50">
                                        <img
                                            src={product.thumbnail}
                                            className="w-full h-full object-cover"
                                            alt=""
                                        />
                                    </div>

                                    {/* BODY */}
                                    <div className="p-5 flex flex-col flex-grow">

                                        <h3 className="font-heading text-lg mb-2">
                                            {product.name}
                                        </h3>

                                        {/* 🔥 PRICE FIX (NO DECIMALS) */}
                                        <p className="text-sindoor-red font-bold text-xl">
                                            ৳{Math.round(product.discountPrice || product.price)}
                                        </p>

                                        {/* CART CONTROLS */}
                                        <div className="mt-4 flex items-center justify-between gap-2">
                                            <button
                                                onClick={() => setSelectedProduct(product)}
                                                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:text-sindoor-red hover:border-sindoor-red transition-colors px-4 py-2 rounded-full text-sm"
                                            >
                                                <Info size={16} />
                                                Details
                                            </button>
                                            <button
                                                onClick={() => addToCart(product, 1, true)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-black text-white hover:bg-sindoor-red transition-colors px-4 py-2 rounded-full text-sm"
                                            >
                                                <ShoppingCart size={16} />
                                                Add
                                            </button>
                                        </div>

                                    </div>
                                </motion.div>
                            );
                        })}

                    </div>
                )}
            </div>

            {/* --- PRODUCT DETAIL MODAL --- */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-gray-100 text-gray-600 transition-all z-20"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-50 relative">
                            <img
                                src={selectedProduct.thumbnail || "https://placehold.co/600x800?text=No+Image"}
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2 p-8 overflow-y-auto flex flex-col">
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                        {selectedProduct.category || 'ক্যাটাগরি'}
                                    </span>
                                    {selectedProduct.isFeatured && (
                                        <span className="bg-sindoor-red/10 text-sindoor-red text-[10px] font-bold px-3 py-1 rounded-full border border-sindoor-red/20">
                                            ফিচার্ড
                                        </span>
                                    )}
                                    {selectedProduct.isBestSeller && (
                                        <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-200">
                                            সেরা বিক্রিত
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-3xl font-heading text-gray-900 leading-tight">
                                    {selectedProduct.name}
                                </h3>
                                <p className="text-[10px] font-mono text-gray-400 mt-2 uppercase tracking-tighter">
                                    Product ID: {selectedProduct._id}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-baseline gap-3">
                                    {selectedProduct.discountPrice ? (
                                        <>
                                            <span className="text-3xl font-black text-sindoor-red">৳{selectedProduct.discountPrice}</span>
                                            <span className="text-lg text-gray-400 line-through">৳{selectedProduct.price}</span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-black text-sindoor-red">৳{selectedProduct.price}</span>
                                    )}
                                </div>
                                
                                <div className="h-8 w-px bg-gray-100" />

                                <div>
                                    <p className={`text-xs font-bold uppercase tracking-widest ${selectedProduct.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {selectedProduct.stock > 0 ? `স্টক আছে: ${selectedProduct.stock}` : 'স্টক আউট'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6 flex-grow">
                                {/* Trust Badges */}
                                <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-100 mb-2">
                                    <div className="text-center">
                                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-1">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <p className="text-[9px] font-bold text-gray-500 uppercase">দ্রুত ডেলিভারি</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-1">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <p className="text-[9px] font-bold text-gray-500 uppercase">১০০% বিশুদ্ধ</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-1">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <p className="text-[9px] font-bold text-gray-500 uppercase">নিরাপদ পেমেন্ট</p>
                                    </div>
                                </div>

                                <div className="prose prose-sm text-gray-600 font-bengali leading-relaxed">
                                    <p>{selectedProduct.description || 'এই পণ্যটির কোনো বিস্তারিত বিবরণ এখনো পাওয়া যায়নি। তবে এটি আমাদের শ্রেষ্ঠ সংগ্রহের অংশ।'}</p>
                                </div>

                                {/* Items Included Section */}
                                {(selectedProduct.itemsIncluded?.length > 0 || selectedProduct.items?.length > 0) && (
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">
                                            যা যা থাকছে এই প্যাকেজে
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {(selectedProduct.itemsIncluded || selectedProduct.items).map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 font-bengali">
                                                    <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                                                    <span className="font-bold">{item.name}</span>
                                                    <span className="text-gray-400">({item.quantity})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedProduct.purityNote && (
                                    <p className="text-xs text-golden-orange font-medium italic border-l-2 border-golden-orange pl-3">
                                        * {selectedProduct.purityNote}
                                    </p>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                                <button
                                    onClick={() => { addToCart(selectedProduct, 1, true); setSelectedProduct(null); }}
                                    className="flex-1 bg-black text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-sindoor-red transition-all flex items-center justify-center gap-3"
                                >
                                    <ShoppingCart size={20} /> কার্টে যুক্ত করুন
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>

    );
}