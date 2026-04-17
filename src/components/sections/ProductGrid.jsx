import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000';

const predefinedCategories = [
    { _id: "pre-1", name: "Puja Packages", slug: "puja-packages" },
    { _id: "pre-2", name: "Daily Puja Items", slug: "daily-puja-items" },
    { _id: "pre-3", name: "Festival Special", slug: "festival-special" },
    { _id: "pre-4", name: "Puja Accessories", slug: "puja-accessories" },
    { _id: "pre-5", name: "Prasad & Items", slug: "prasad-items" },
    { _id: "pre-6", name: "Gift Hampers", slug: "gift-hampers" }
];

export default function ProductGrid() {
  const [categories, setCategories] = useState(predefinedCategories);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [activeCategorySlug, setActiveCategorySlug] = useState('all');

  useEffect(() => {
    fetch(`${API}/categories`)
      .then(res => res.json())
      .then(data => {
        const predefinedNames = predefinedCategories.map(p => p.name);
        const fetchedCats = Array.isArray(data) ? data : [];
        const uniqueFetched = fetchedCats.filter(d => !predefinedNames.includes(d.name));
        const allCats = [...predefinedCategories, ...uniqueFetched];
        setCategories(allCats);
        if (allCats.length > 0) setActiveCategorySlug(allCats[0].slug || allCats[0].name.toLowerCase().replace(/ /g, '-'));
      })
      .catch(err => console.error("Error fetching categories", err));
      
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(err => console.error("Error fetching products", err));
  }, []);

  const activeCategoryProducts = products.filter(p => p.categorySlug === activeCategorySlug);

  return (
    <section id="পূজার সামগ্রী" className="py-20 bg-white/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading text-4xl text-sindoor-red mb-4">পবিত্র সামগ্রী</h2>
          <p className="font-bengali text-gray-600">প্রতিটি উপাদান নির্বাচিত হয়েছে পরম যত্নে</p>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-4 mb-10 pb-4 justify-start md:justify-center items-center">
            {categories.map(category => {
                const catSlug = category.slug || category.name.toLowerCase().replace(/ /g, '-');
                const isActive = activeCategorySlug === catSlug;
                return (
                    <button
                        key={category._id}
                        onClick={() => setActiveCategorySlug(catSlug)}
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

        {/* Active Category Products */}
        <div className="mb-8">
            <div className="flex justify-between items-end mb-6">
                <h3 className="font-heading text-2xl text-gray-800 hidden md:block">
                    {categories.find(c => (c.slug || c.name.toLowerCase().replace(/ /g, '-')) === activeCategorySlug)?.name}
                </h3>
                <button 
                  onClick={() => navigate(`/category/${activeCategorySlug}`)}
                  className="font-bengali text-sindoor-red hover:text-golden-orange transition-colors font-medium border-b border-transparent hover:border-golden-orange ml-auto"
                >
                  View All Products
                </button>
            </div>

            {activeCategoryProducts.length === 0 ? (
                <div className="text-center py-16 bg-white/50 rounded-2xl border border-gray-100">
                    <p className="text-gray-500 font-bengali">This category currently has no products.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {activeCategoryProducts.slice(0, 4).map((product, index) => {
                        const badges = [];
                        if (product.isFeatured) badges.push("Featured");
                        if (product.isBestSeller) badges.push("Best Seller");
                        if (product.discountPrice) badges.push("Sale");

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
                                            <span key={badge} className="bg-sindoor-red/90 text-white text-[10px] uppercase px-2 py-0.5 rounded-full shadow-sm">
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-5 flex-grow flex flex-col">
                                    <p className="text-xs text-golden-orange font-medium mb-1 uppercase tracking-wider">
                                        {categories.find(c => (c.slug || c.name.toLowerCase().replace(/ /g, '-')) === activeCategorySlug)?.name}
                                    </p>
                                    <h3 className="font-heading text-xl text-gray-800 mb-2 truncate" title={product.name}>{product.name}</h3>
                                    <p className="font-bengali text-sm text-gray-500 mb-4 flex-grow line-clamp-2">
                                        {product.description || 'No description available'}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex flex-col">
                                            {product.discountPrice ? (
                                                <>
                                                    <span className="font-bengali font-bold text-xl text-sindoor-red">৳{product.discountPrice}</span>
                                                    <span className="text-xs text-gray-400 line-through">৳{product.price}</span>
                                                </>
                                            ) : (
                                                <span className="font-bengali font-bold text-xl text-sindoor-red">৳{product.price}</span>
                                            )}
                                        </div>
                                        <button className="bg-matte-sandal border border-golden-orange text-golden-orange hover:bg-gradient-to-r hover:from-sindoor-red hover:to-golden-orange hover:text-white hover:border-transparent p-2 rounded-full transition-all cursor-pointer group/btn">
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
    </section>
  );
}
