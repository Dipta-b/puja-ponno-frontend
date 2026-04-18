import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, ArrowLeft } from 'lucide-react';
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
                                        <div className="mt-4 flex items-center justify-between">

                                            <button
                                                onClick={() => addToCart(product, 1, true)}
                                                className="flex items-center gap-2 bg-black text-white hover:bg-sindoor-red transition-colors px-4 py-2 rounded-full"
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
        </div>
    );
}