import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Info, X, CheckCircle2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const API = 'http://localhost:5000';

const predefinedCategories = [
    { _id: "pre-1", name: "Puja Packages", nameBn: "পূজা প্যাকেজ", slug: "puja-packages" },
    { _id: "pre-2", name: "Daily Puja Items", nameBn: "নিত্য পূজার সামগ্রী", slug: "daily-puja-items" },
    { _id: "pre-3", name: "Festival Special", nameBn: "উৎসব স্পেশাল", slug: "festival-special" },
    { _id: "pre-4", name: "Puja Accessories", nameBn: "পূজার অনুষঙ্গ", slug: "puja-accessories" },
    { _id: "pre-5", name: "Prasad & Items", nameBn: "প্রসাদ ইত্যাদি", slug: "prasad-items" },
    { _id: "pre-6", name: "Gift Hampers", nameBn: "উপহার সামগ্রী", slug: "gift-hampers" }
];

export default function ProductGrid() {
    const [categories, setCategories] = useState(predefinedCategories);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const { addToCart, cartItems } = useCart();
    
    // helper: cart quantity
    const getQty = (id) => {
        const item = cartItems?.find(i => i._id === id);
        return item?.quantity || 0;
    };

    const [activeCategorySlug, setActiveCategorySlug] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);


    useEffect(() => {
        fetch(`${API}/categories`)
            .then(res => res.json())
            .then(data => {
                const predefinedNames = predefinedCategories.map(p => p.name);
                const fetchedCats = Array.isArray(data) ? data : [];

                // ✅ ensure nameBn always exists
                const uniqueFetched = fetchedCats
                    .filter(d => !predefinedNames.includes(d.name))
                    .map(cat => ({
                        ...cat,
                        nameBn: cat.nameBn || ""
                    }));

                const allCats = [...predefinedCategories, ...uniqueFetched];
                setCategories(allCats);

                if (allCats.length > 0) {
                    setActiveCategorySlug(
                        allCats[0].slug || allCats[0].name.toLowerCase().replace(/ /g, '-')
                    );
                }
            });

        fetch(`${API}/products`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProducts(data);
            });
    }, []);

    const activeCategoryProducts = products.filter(
        p => p.categorySlug === activeCategorySlug
    );

    // ✅ FIX: single reliable category reference
    const activeCategory = categories.find(
        c => (c.slug || c.name.toLowerCase().replace(/ /g, '-')) === activeCategorySlug
    );

    return (
        <section id="পূজার সামগ্রী" className="py-20 bg-white/40 backdrop-blur-sm">

            <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-10">
                    <h2 className="font-heading text-4xl text-sindoor-red mb-4">পবিত্র সামগ্রী</h2>
                    <p className="font-bengali text-gray-600">প্রতিটি উপাদান নির্বাচিত হয়েছে পরম যত্নে</p>
                </div>

                {/* CATEGORY TABS */}
                <div className="flex overflow-x-auto hide-scrollbar gap-5 mb-12 pb-6 justify-start lg:justify-center items-center px-2 snap-x">
                    {categories.map(category => {
                        const catSlug =
                            category.slug || category.name.toLowerCase().replace(/ /g, '-');

                        const isActive = activeCategorySlug === catSlug;

                        return (
                            <button
                                key={category._id}
                                onClick={() => setActiveCategorySlug(catSlug)}
                                className={`snap-center group relative flex flex-col items-center justify-center min-w-[150px] sm:min-w-[160px] px-6 py-4 rounded-2xl transition-all duration-300 border-2 ${isActive
                                    ? 'bg-gradient-to-r from-sindoor-red to-golden-orange border-transparent text-white shadow-xl scale-105'
                                    : 'bg-white/80 backdrop-blur-md border-soft-gold/30 text-gray-600 hover:border-golden-orange/50 hover:bg-white hover:shadow-lg hover:-translate-y-1'
                                    }`}
                            >
                                <span className={`font-bengali font-bold text-lg sm:text-xl mb-1 leading-tight transition-colors ${isActive ? 'text-white' : 'text-gray-800 group-hover:text-sindoor-red'}`}>
                                    {category.nameBn || category.name}
                                </span>
                                {category.nameBn && (
                                    <span className={`text-[10px] sm:text-[11px] font-medium tracking-widest uppercase transition-colors ${isActive ? 'text-white/90' : 'text-gray-400 group-hover:text-golden-orange'}`}>
                                        {category.name}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* PRODUCTS */}
                <div className="mb-8">

                    <div className="flex justify-between items-end mb-6">
                        <h3 className="font-heading text-2xl text-gray-800 hidden md:block">
                            {activeCategory?.nameBn || activeCategory?.name}
                        </h3>

                        <button
                            onClick={() => navigate(`/category/${activeCategorySlug}`)}
                            className="font-bengali text-sindoor-red hover:text-golden-orange transition-colors font-medium border-b border-transparent hover:border-golden-orange ml-auto"
                        >
                            সকল পণ্য দেখুন
                        </button>
                    </div>

                    {activeCategoryProducts.length === 0 ? (
                        <div className="text-center py-16 bg-white/50 rounded-2xl border border-gray-100">
                            <p className="text-gray-500 font-bengali">
                                এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।
                            </p>
                        </div>
                    ) : (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 xl:gap-8">
                            {activeCategoryProducts.slice(0, 5).map((product, index) => {
                                const qty = getQty(product._id);

                                const badges = [];
                                if (product.isFeatured) badges.push("ফিচার্ড");
                                if (product.isBestSeller) badges.push("জনপ্রিয়");
                                if (product.discountPrice) badges.push("সেল");

                                return (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ y: -10 }}
                                        className="bg-white/70 backdrop-blur-lg rounded-2xl border border-soft-gold/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(255,215,0,0.15)] transition-all overflow-hidden flex flex-col cursor-pointer group"
                                    >

                                        <div className="relative h-48 overflow-hidden bg-gray-100">
                                            <motion.img
                                                src={product.thumbnail || "https://placehold.co/400x300?text=No+Image"}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />

                                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                {badges.map(badge => (
                                                    <span key={badge} className="bg-sindoor-red/90 text-white font-bengali text-[11px] px-2.5 py-0.5 rounded-full shadow-sm">
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-5 flex-grow flex flex-col">
                                            <p className="text-xs text-golden-orange font-medium mb-1 uppercase tracking-wider font-bengali">
                                                {activeCategory?.nameBn || activeCategory?.name}
                                            </p>

                                            <h3 className="font-heading text-lg xl:text-xl text-gray-800 mb-2 truncate" title={product.name}>
                                                {product.name}
                                            </h3>

                                            <p className="font-bengali text-sm text-gray-500 mb-4 flex-grow line-clamp-2">
                                                {product.description || 'কোনো বিবরণ পাওয়া যায়নি।'}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex flex-col">
                                                    {product.discountPrice ? (
                                                        <>
                                                            <span className="font-bengali font-bold text-lg xl:text-xl text-sindoor-red">
                                                                ৳{product.discountPrice}
                                                            </span>
                                                            <span className="text-xs text-gray-400 line-through">
                                                                ৳{product.price}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bengali font-bold text-lg xl:text-xl text-sindoor-red">
                                                            ৳{Math.round(product.discountPrice || product.price)}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                                                        className="bg-white border border-gray-200 text-gray-500 hover:text-sindoor-red hover:border-sindoor-red p-2.5 rounded-full transition-all cursor-pointer shadow-sm hover:shadow-md"
                                                        title="View Details"
                                                    >
                                                        <Info size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); addToCart(product, 1, true); }}
                                                        className="bg-matte-sandal border border-golden-orange text-golden-orange hover:bg-gradient-to-r hover:from-sindoor-red hover:to-golden-orange hover:text-white hover:border-transparent p-2.5 rounded-full transition-all cursor-pointer shadow-sm hover:shadow-md"
                                                        title="Add to Cart"
                                                    >
                                                        <ShoppingCart size={18} />
                                                    </button>
                                                </div>

                                            </div>
                                        </div>

                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

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
                                    className="flex-1 bg-gradient-to-r from-sindoor-red to-golden-orange text-white py-4 rounded-2xl font-bold shadow-xl shadow-sindoor-red/10 hover:shadow-sindoor-red/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                                >
                                    <ShoppingCart size={20} /> কার্টে যুক্ত করুন
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </section>

    );
}