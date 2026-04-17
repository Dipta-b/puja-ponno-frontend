import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, ArrowLeft } from 'lucide-react';

const API = 'http://localhost:5000';

export default function CategoryPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    
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
                    { _id: "pre-1", name: "Puja Packages", slug: "puja-packages" },
                    { _id: "pre-2", name: "Daily Puja Items", slug: "daily-puja-items" },
                    { _id: "pre-3", name: "Festival Special", slug: "festival-special" },
                    { _id: "pre-4", name: "Puja Accessories", slug: "puja-accessories" },
                    { _id: "pre-5", name: "Prasad & Items", slug: "prasad-items" },
                    { _id: "pre-6", name: "Gift Hampers", slug: "gift-hampers" }
                ];
                const predefinedNames = predefinedCategories.map(p => p.name);
                const fetchedCats = Array.isArray(data) ? data : [];
                const uniqueFetched = fetchedCats.filter(d => !predefinedNames.includes(d.name));
                const allCats = [...predefinedCategories, ...uniqueFetched];
                setCategories(allCats);
            })
            .catch(err => console.error(err));

        fetch(`${API}/products`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const catProducts = data.filter(p => p.categorySlug === slug);
                    setProducts(catProducts);
                    if (catProducts.length > 0) {
                        setCategoryName(catProducts[0].category || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
                    } else {
                        setCategoryName(slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
                    }
                }
            })
            .catch(err => console.error(err));
            
    }, [slug]);

    // Filter and Sort
    const filteredProducts = products.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        if (sortBy === 'newest') return dateB - dateA;
        if (sortBy === 'oldest') return dateA - dateB;
        return 0;
    });

    return (
        <div className="min-h-screen bg-white/40 pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <button onClick={() => navigate(-1)} className="flex items-center font-bengali text-gray-500 hover:text-sindoor-red transition mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> ফিরে যান
                </button>

                {/* Category Tabs */}
                <div className="flex overflow-x-auto hide-scrollbar gap-4 mb-10 pb-4 justify-start items-center">
                    {categories.map(category => {
                        const catSlug = category.slug || category.name.toLowerCase().replace(/ /g, '-');
                        const isActive = slug === catSlug;
                        return (
                            <button
                                key={category._id}
                                onClick={() => navigate(`/category/${catSlug}`)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bengali font-medium transition-all ${
                                    isActive 
                                    ? 'bg-sindoor-red text-white shadow-md' 
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-golden-orange hover:text-golden-orange'
                                }`}
                            >
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="font-heading text-4xl text-sindoor-red mb-2">{categoryName}</h1>
                        <p className="font-bengali text-gray-600">সর্বমোট {filteredProducts.length} টি ফলাফল দেখানো হচ্ছে</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 flex-grow sm:flex-grow-0 sm:w-64 focus-within:border-golden-orange transition-colors">
                            <Search className="w-4 h-4 text-gray-400 mr-2" />
                            <input 
                                type="text"
                                placeholder="পণ্য খুঁজুন..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent outline-none w-full text-sm font-bengali"
                            />
                        </div>

                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-bengali outline-none focus:border-golden-orange transition-colors"
                        >
                            <option value="newest">নতুনত্ব অনুসারে</option>
                            <option value="oldest">পুরাতন অনুসারে</option>
                            <option value="priceAsc">দাম: কম থেকে বেশি</option>
                            <option value="priceDesc">দাম: বেশি থেকে কম</option>
                        </select>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <p className="text-gray-500 text-lg font-bengali">আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পণ্য পাওয়া যায়নি।</p>
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-sindoor-red hover:underline font-medium font-bengali"
                        >
                            অনুসন্ধান মুছুন
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product, index) => {
                            const badges = [];
                            if (product.isFeatured) badges.push("ফিচার্ড");
                            if (product.isBestSeller) badges.push("জনপ্রিয়");
                            if (product.discountPrice) badges.push("সেল");

                            return (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col cursor-pointer group"
                                >
                                    <div className="relative h-56 overflow-hidden bg-gray-50 object-cover">
                                        <img 
                                            src={product.thumbnail || "https://placehold.co/400x300?text=No+Image"} 
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                            {badges.map(badge => (
                                                <span key={badge} className="bg-sindoor-red text-white text-[11px] font-bold font-bengali px-2.5 py-1 rounded-full shadow-sm">
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-5 flex-grow flex flex-col">
                                        <p className="text-xs text-golden-orange font-bold mb-1.5 uppercase tracking-wider">{categoryName}</p>
                                        <h3 className="font-heading text-lg text-gray-900 mb-2 leading-tight" title={product.name}>{product.name}</h3>
                                        <p className="font-bengali text-sm text-gray-500 mb-4 flex-grow line-clamp-2">
                                            {product.description || 'কোনো বিবরণ পাওয়া যায়নি।'}
                                        </p>
                                        
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                            <div className="flex flex-col">
                                                {product.discountPrice ? (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="font-bengali font-bold text-xl text-sindoor-red">৳{product.discountPrice}</span>
                                                        <span className="text-xs text-gray-400 line-through">৳{product.price}</span>
                                                    </div>
                                                ) : (
                                                    <span className="font-bengali font-bold text-xl text-sindoor-red">৳{product.price}</span>
                                                )}
                                            </div>
                                            <button className="bg-orange-50 text-golden-orange hover:bg-sindoor-red hover:text-white p-2.5 rounded-full transition-colors cursor-pointer">
                                                <ShoppingCart size={18} />
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
