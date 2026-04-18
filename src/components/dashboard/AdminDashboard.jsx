import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import {
    Search, Edit, Trash2, Eye, Plus, Shield, ShieldOff, Check, X,
    LayoutDashboard, Package, Users, Tags, Menu, LogOut, CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const API = 'http://localhost:5000';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [sidebarOpen, setSidebarOpen] = useState(false); // Closed by default on mobile

    // Data states
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const predefinedCategories = [
        { _id: "pre-1", name: "Puja Packages", nameBn: "পূজা প্যাকেজ", slug: "puja-packages" },
        { _id: "pre-2", name: "Daily Puja Items", nameBn: "নিত্য পূজার সামগ্রী", slug: "daily-puja-items" },
        { _id: "pre-3", name: "Festival Special", nameBn: "উৎসব স্পেশাল", slug: "festival-special" },
        { _id: "pre-4", name: "Puja Accessories", nameBn: "পূজার অনুষঙ্গ", slug: "puja-accessories" },
        { _id: "pre-5", name: "Prasad & Items", nameBn: "প্রসাদ ইত্যাদি", slug: "prasad-items" },
        { _id: "pre-6", name: "Gift Hampers", nameBn: "উপহার সামগ্রী", slug: "gift-hampers" }
    ];

    const [categories, setCategories] = useState(predefinedCategories);

    const [viewProduct, setViewProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingPackage, setEditingPackage] = useState(null);
    const [isAddingPackage, setIsAddingPackage] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('dateDesc');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryNameBn, setNewCategoryNameBn] = useState('');
    
    // User History States
    const [userOrders, setUserOrders] = useState([]);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);

    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        if (activeTab === 'products') fetchProducts();
        if (activeTab === 'roles') fetchUsers();
        if (activeTab === 'categories') fetchCategories();
    }, [activeTab]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API}/products`);
            const data = await res.json();
            setProducts(data);
        } catch (err) { }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API}/api/auth/users`, { credentials: 'include' });
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) { }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API}/categories`);
            const data = await res.json();
            const predefinedNames = predefinedCategories.map(p => p.name);
            const uniqueFetched = data.filter(d => !predefinedNames.includes(d.name));
            setCategories([...predefinedCategories, ...uniqueFetched]);
        } catch (err) { }
    }

    // --- Product Handlers ---
    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            const res = await fetch(`${API}/products/${id}`, { method: 'DELETE', credentials: 'include' });
            if (res.ok) setProducts(products.filter(p => p._id !== id));
        } catch (err) { }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/products/${editingProduct._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editingProduct)
            });
            if (res.ok) {
                setProducts(products.map(p => p._id === editingProduct._id ? editingProduct : p));
                setEditingProduct(null);
            }
        } catch (err) { }
    };

    // --- User Handlers ---
    const updateUserRole = async (id, newRole, newStatus) => {
        try {
            const res = await fetch(`${API}/api/auth/${id}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ role: newRole, status: newStatus })
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(users.map(u => u._id === id ? { ...u, role: newRole, status: newStatus } : u));
            } else {
                alert(`Error: ${data.message || 'Update failed'}`);
            }
        } catch (err) {
            alert('Failed to connect to server: ' + err.message);
        }
    };

    const fetchUserHistory = async (userRecord) => {
        setHistoryLoading(true);
        setSelectedCustomer(userRecord);
        setIsHistoryModalOpen(true);
        try {
            const res = await fetch(`${API}/orders/user/${userRecord._id}`, { credentials: 'include' });
            const data = await res.json();
            setUserOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch history fail:", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    // --- Category Handlers ---
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            const res = await fetch(`${API}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: newCategoryName, nameBn: newCategoryNameBn })
            });
            if (res.ok) {
                setNewCategoryName('');
                setNewCategoryNameBn('');
                fetchCategories();
            }
        } catch (err) { }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            const res = await fetch(`${API}/categories/${id}`, { method: 'DELETE', credentials: 'include' });
            if (res.ok) setCategories(categories.filter(c => c._id !== id));
        } catch (err) { }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
            if (res.ok) {
                setUser(null);
                navigate("/login");
            }
        } catch (err) { }
    };

    // --- Package Handlers ---
    const handleSavePackage = async (e, pkgData, isNew) => {
        e.preventDefault();
        
        const cleanItems = (pkgData.items || []).filter(i => i.name.trim() !== "");
        
        const payload = {
            ...pkgData,
            category: "Puja Packages",
            categorySlug: "puja-packages",
            items: cleanItems,
            duration: Number(pkgData.duration) || 0,
            discount: Number(pkgData.discount) || 0,
            price: Number(pkgData.price) || 0
        };

        try {
            const url = isNew ? `${API}/products` : `${API}/products/${pkgData._id}`;
            const method = isNew ? 'POST' : 'PUT';
            
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                fetchProducts();
                setIsAddingPackage(false);
                setEditingPackage(null);
            } else {
                alert("Failed to save package");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredProducts = products.filter(p => {
        const term = searchQuery.toLowerCase();
        return p.name?.toLowerCase().includes(term) || p.categorySlug?.toLowerCase().includes(term);
    }).sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        if (sortBy === 'dateAsc') return dateA - dateB;
        if (sortBy === 'dateDesc') return dateB - dateA;
        return 0;
    });

    const admins = users.filter(u => u.role === 'admin');
    const nonAdmins = users.filter(u => u.role !== 'admin');
    
    // Filter out packages for general products view (or keep them, but let's separate to make it clear)
    const packageProducts = products.filter(p => p.categorySlug === 'puja-packages' || p.duration);

    const renderProducts = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-96 items-center">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="bg-transparent outline-none w-full text-sm"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none text-sm w-full sm:w-auto"
                    >
                        <option value="dateDesc">Newest</option>
                        <option value="dateAsc">Oldest</option>
                        <option value="priceDesc">Price: High to Low</option>
                        <option value="priceAsc">Price: Low to High</option>
                    </select>
                    <button
                        onClick={() => navigate('/admin/add-product')}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" /> Add New
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Product</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold">Stock</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map(product => (
                                <tr key={product._id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        {product.thumbnail ? (
                                            <img src={product.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                <Package className="w-6 h-6" />
                                            </div>
                                        )}
                                        <span className="font-medium text-gray-800">{product.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 capitalize">{product.categorySlug?.replace(/-/g, ' ') || 'None'}</td>
                                    <td className="px-6 py-4 font-medium text-gray-700">৳{product.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setViewProduct(product)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"><Eye className="w-4 h-4" /></button>
                                            <button onClick={() => setEditingProduct(product)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteProduct(product._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No products found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );

    const renderCategories = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Category</h3>
                <form onSubmit={handleAddCategory} className="flex gap-4 flex-col sm:flex-row">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        placeholder="Category Name (e.g. Daily Essentials)"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                        type="text"
                        value={newCategoryNameBn}
                        onChange={e => setNewCategoryNameBn(e.target.value)}
                        placeholder="Bangla Name (e.g. নিত্য প্রয়োজনীয়)"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 font-bengali"
                    />
                    <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-medium transition whitespace-nowrap">
                        Add Category
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Category Name</th>
                                <th className="px-6 py-4 font-semibold font-bengali">Bangla Name</th>
                                <th className="px-6 py-4 font-semibold">Slug</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.filter(cat => !cat._id.toString().startsWith('pre-')).map(cat => (
                                <tr key={cat._id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800 font-bengali">{cat.nameBn || "-"}</td>
                                    <td className="px-6 py-4 text-gray-500">{cat.slug || cat.name.toLowerCase().replace(/ /g, '-')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDeleteCategory(cat._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {categories.filter(cat => !cat._id.toString().startsWith('pre-')).length === 0 && (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No dynamic categories found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );

    const renderRoles = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Admins Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-4 bg-orange-50 border-b border-orange-100 flex items-center gap-3">
                        <Shield className="w-5 h-5 text-orange-600" />
                        <h3 className="font-bold text-orange-900">Current Admins</h3>
                    </div>
                    <div className="p-4 flex-1">
                        <div className="space-y-3">
                            {admins.map(admin => (
                                <div key={admin._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-orange-200 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                                            {admin.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{admin.name}</p>
                                            <p className="text-xs text-gray-500">{admin.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => updateUserRole(admin._id, 'user', 'approved')}
                                        className="text-xs font-semibold px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-md transition"
                                    >Demote</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Users Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-blue-900">Users & Pending Requests</h3>
                    </div>
                    <div className="p-4 flex-1 max-h-[600px] overflow-y-auto">
                        <div className="space-y-3">
                            {nonAdmins.map(u => (
                                <div key={u._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-blue-200 transition gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold">
                                            {u.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                                {u.name}
                                                {u.status === 'pending' && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] uppercase rounded-full tracking-wider font-bold">Pending</span>}
                                            </p>
                                            <p className="text-xs text-gray-500">{u.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => fetchUserHistory(u)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition border border-blue-100"
                                            title="View Order History"
                                        >
                                            <Package className="w-4 h-4" />
                                            History
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateUserRole(u._id, 'admin', 'approved')}
                                                className="flex-1 sm:flex-none text-xs font-semibold px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
                                            >Make Admin</button>
                                            <button
                                                onClick={() => updateUserRole(u._id, 'user', 'rejected')}
                                                className="flex-1 sm:flex-none text-xs font-semibold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
                                            >Reject</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );

    const renderPackages = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Manage Packages</h2>
                <button
                    onClick={() => setIsAddingPackage(true)}
                    className="flex items-center gap-2 bg-sindoor-red hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    <Plus className="w-5 h-5" /> Add Package
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {packageProducts.map(pkg => (
                    <div key={pkg._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
                            <button onClick={() => setEditingPackage({ ...pkg, items: pkg.items || pkg.itemsIncluded || [] })} className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteProduct(pkg._id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><Trash2 size={16} /></button>
                        </div>
                        {pkg.thumbnail && <img src={pkg.thumbnail} alt={pkg.name} className="w-full h-40 object-cover rounded-xl mb-4" />}
                        <h3 className="font-bold text-xl text-gray-800">{pkg.name}</h3>
                        <div className="flex gap-4 mt-2 mb-4 text-sm">
                            <span className="text-sindoor-red font-bold">৳{pkg.price}</span>
                            {pkg.duration && <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{pkg.duration} Days</span>}
                            {pkg.discount > 0 && <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">Save ৳{pkg.discount}</span>}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">{pkg.description}</p>
                    </div>
                ))}
                {packageProducts.length === 0 && (
                    <div className="col-span-3 py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                        No packages found. Add one!
                    </div>
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex mt-20 relative">

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 z-10 bg-black/20 backdrop-blur-sm top-20"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'} bg-white border-r border-gray-200 transition-all duration-300 fixed bottom-0 top-20 z-20 flex flex-col shadow-2xl md:shadow-none`}>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    {sidebarOpen && <span className="font-bold tracking-wider text-sm text-gray-500 uppercase">Menu</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:block p-2 text-gray-400 hover:bg-gray-100 rounded-lg mx-auto md:mx-0">
                        <Menu className="w-5 h-5" />
                    </button>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 py-4 space-y-1 px-3">
                    {[
                        { id: 'products', icon: Package, label: 'Products' },
                        { id: 'packages', icon: Check, label: 'Packages' },
                        { id: 'categories', icon: Tags, label: 'Categories' },
                        { id: 'roles', icon: Shield, label: 'Roles' },
                        { id: 'payments', icon: CreditCard, label: 'Payments' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'payments') navigate('/admin/payments');
                                else setActiveTab(item.id);
                            }}
                            className={`w-full flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center px-0'} py-3 rounded-xl transition ${activeTab === item.id ? 'bg-orange-50 text-orange-600 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            {sidebarOpen && <span className="ml-3">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className={`w-full flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center px-0'} py-3 text-red-600 hover:bg-red-50 rounded-xl transition`}>
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="ml-3 font-semibold">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0 p-4 sm:p-6 md:p-8 relative min-w-0`}>
                <div className="max-w-6xl mx-auto w-full">

                    {/* MOBILE TOP BAR */}
                    <div className="md:hidden mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h1 className="text-xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')} manager</h1>
                        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-gray-50 text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="hidden md:block mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')} manager</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your eCommerce store's {activeTab}</p>
                    </div>

                    {activeTab === 'products' && renderProducts()}
                    {activeTab === 'packages' && renderPackages()}
                    {activeTab === 'categories' && renderCategories()}
                    {activeTab === 'roles' && renderRoles()}
                </div>
            </main>

            {/* MODALS */}
            {viewProduct && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden relative">
                        <button onClick={() => setViewProduct(null)} className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-gray-100 text-gray-600 shadow-sm z-10"><X className="w-5 h-5" /></button>
                        {viewProduct.thumbnail && <img src={viewProduct.thumbnail} alt={viewProduct.name} className="w-full h-56 object-cover" />}
                        <div className="p-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2.5 py-1 rounded-md">{viewProduct.categorySlug?.replace(/-/g, ' ')}</span>
                            <h2 className="text-2xl font-bold mt-3 text-gray-800">{viewProduct.name}</h2>
                            <p className="text-gray-500 mt-2 text-sm">{viewProduct.description || 'No description provided.'}</p>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Price</p>
                                    <p className="text-2xl font-black text-gray-800 mt-1">৳{viewProduct.price}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">In Stock</p>
                                    <p className={`text-2xl font-black mt-1 ${viewProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{viewProduct.stock || 0}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {editingProduct && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative max-h-[90vh] flex flex-col"
                    >
                        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className="text-gray-400 hover:text-gray-600 p-2"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 flex-1">
                            <form id="edit-form" onSubmit={handleUpdateProduct} className="space-y-5">

                                {/* NAME */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                                    <input
                                        type="text"
                                        value={editingProduct.name || ""}
                                        onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                                    />
                                </div>

                                {/* CATEGORY */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                                    <select
                                        value={editingProduct.category || ""}
                                        onChange={e => setEditingProduct({
                                            ...editingProduct,
                                            category: e.target.value,
                                            categorySlug: e.target.value.toLowerCase().replace(/ /g, "-")
                                        })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* PRICE + STOCK */}
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={editingProduct.price || ""}
                                        onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                        className="px-4 py-2.5 bg-gray-50 border rounded-xl"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        value={editingProduct.stock || ""}
                                        onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                                        className="px-4 py-2.5 bg-gray-50 border rounded-xl"
                                    />
                                </div>

                                {/* DISCOUNT */}
                                <input
                                    type="number"
                                    placeholder="Discount Price"
                                    value={editingProduct.discountPrice || ""}
                                    onChange={e => setEditingProduct({ ...editingProduct, discountPrice: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"
                                />

                                {/* IMAGE */}
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={editingProduct.thumbnail || ""}
                                    onChange={e => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"
                                />

                                {/* ITEMS INCLUDED */}
                                <div>
                                    <h3 className="font-semibold">Items Included</h3>

                                    {(editingProduct.itemsIncluded || []).map((item, index) => (
                                        <div key={index} className="flex gap-2 mt-2">
                                            <input
                                                value={item.name}
                                                onChange={(e) => {
                                                    const updated = [...editingProduct.itemsIncluded];
                                                    updated[index].name = e.target.value;
                                                    setEditingProduct({ ...editingProduct, itemsIncluded: updated });
                                                }}
                                                className="border p-2 w-1/2"
                                            />
                                            <input
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const updated = [...editingProduct.itemsIncluded];
                                                    updated[index].quantity = e.target.value;
                                                    setEditingProduct({ ...editingProduct, itemsIncluded: updated });
                                                }}
                                                className="border p-2 w-1/2"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* CHECKBOXES */}
                                <label className="flex gap-2">
                                    <input
                                        type="checkbox"
                                        checked={editingProduct.isFeatured || false}
                                        onChange={e => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                                    />
                                    Featured
                                </label>

                                <label className="flex gap-2">
                                    <input
                                        type="checkbox"
                                        checked={editingProduct.isBestSeller || false}
                                        onChange={e => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                                    />
                                    Best Seller
                                </label>

                                {/* DESCRIPTION */}
                                <textarea
                                    value={editingProduct.description || ""}
                                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"
                                    placeholder="Description"
                                />

                                {/* PURITY */}
                                <input
                                    value={editingProduct.purityNote || ""}
                                    onChange={e => setEditingProduct({ ...editingProduct, purityNote: e.target.value })}
                                    placeholder="Purity Note"
                                    className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"
                                />

                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className="px-5 py-2.5 text-gray-600 hover:bg-gray-200 rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                form="edit-form"
                                className="px-5 py-2.5 bg-orange-500 text-white rounded-xl"
                            >
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* PACKAGE MODAL (ADD / EDIT) */}
            {(isAddingPackage || editingPackage) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative max-h-[90vh] flex flex-col"
                    >
                        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">{editingPackage ? 'Edit Package' : 'Add Package'}</h2>
                            <button type="button" onClick={() => { setIsAddingPackage(false); setEditingPackage(null); }} className="text-gray-400 hover:text-gray-600 p-2"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="overflow-y-auto p-6 flex-1">
                            <form id="package-form" onSubmit={(e) => handleSavePackage(e, editingPackage || isAddingPackage, !editingPackage)} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Package Name"
                                    required
                                    value={(editingPackage || isAddingPackage)?.name || ""}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (editingPackage) setEditingPackage({ ...editingPackage, name: val });
                                        else setIsAddingPackage({ ...isAddingPackage, name: val });
                                    }}
                                    className="w-full px-4 py-2 bg-gray-50 border rounded-xl"
                                />
                                <div className="grid grid-cols-3 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        required
                                        value={(editingPackage || isAddingPackage)?.price || ""}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (editingPackage) setEditingPackage({ ...editingPackage, price: val });
                                            else setIsAddingPackage({ ...isAddingPackage, price: val });
                                        }}
                                        className="px-4 py-2 bg-gray-50 border rounded-xl"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Discount"
                                        value={(editingPackage || isAddingPackage)?.discount || ""}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (editingPackage) setEditingPackage({ ...editingPackage, discount: val });
                                            else setIsAddingPackage({ ...isAddingPackage, discount: val });
                                        }}
                                        className="px-4 py-2 bg-gray-50 border rounded-xl"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Duration (Days)"
                                        value={(editingPackage || isAddingPackage)?.duration || ""}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (editingPackage) setEditingPackage({ ...editingPackage, duration: val });
                                            else setIsAddingPackage({ ...isAddingPackage, duration: val });
                                        }}
                                        className="px-4 py-2 bg-gray-50 border rounded-xl"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    required
                                    value={(editingPackage || isAddingPackage)?.thumbnail || ""}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (editingPackage) setEditingPackage({ ...editingPackage, thumbnail: val });
                                        else setIsAddingPackage({ ...isAddingPackage, thumbnail: val });
                                    }}
                                    className="w-full px-4 py-2 bg-gray-50 border rounded-xl"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={(editingPackage || isAddingPackage)?.description || ""}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (editingPackage) setEditingPackage({ ...editingPackage, description: val });
                                        else setIsAddingPackage({ ...isAddingPackage, description: val });
                                    }}
                                    className="w-full px-4 py-2 bg-gray-50 border rounded-xl"
                                />

                                {/* Package Items */}
                                <div>
                                    <h3 className="font-semibold text-sm mb-2 text-gray-700">Package Items</h3>
                                    {((editingPackage || isAddingPackage)?.items || []).map((item, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                placeholder="Item Name"
                                                value={item.name || ""}
                                                onChange={(e) => {
                                                    const updatedState = editingPackage ? { ...editingPackage } : { ...isAddingPackage };
                                                    updatedState.items[index].name = e.target.value;
                                                    if (editingPackage) setEditingPackage(updatedState); else setIsAddingPackage(updatedState);
                                                }}
                                                className="border p-2 w-2/3 bg-gray-50 rounded"
                                            />
                                            <input
                                                placeholder="Qty"
                                                value={item.quantity || ""}
                                                onChange={(e) => {
                                                    const updatedState = editingPackage ? { ...editingPackage } : { ...isAddingPackage };
                                                    updatedState.items[index].quantity = e.target.value;
                                                    if (editingPackage) setEditingPackage(updatedState); else setIsAddingPackage(updatedState);
                                                }}
                                                className="border p-2 w-1/3 bg-gray-50 rounded"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedState = editingPackage ? { ...editingPackage } : { ...isAddingPackage };
                                            if (!updatedState.items) updatedState.items = [];
                                            updatedState.items.push({ name: "", quantity: "" });
                                            if (editingPackage) setEditingPackage(updatedState); else setIsAddingPackage(updatedState);
                                        }}
                                        className="text-sindoor-red text-sm font-medium mt-1"
                                    >
                                        + Add Item
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button type="button" onClick={() => { setIsAddingPackage(false); setEditingPackage(null); }} className="px-5 py-2.5 text-gray-600 hover:bg-gray-200 rounded-xl">Cancel</button>
                            <button type="submit" form="package-form" className="px-5 py-2.5 bg-sindoor-red text-white rounded-xl">Save Package</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* USER ORDER HISTORY MODAL */}
            {isHistoryModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Package className="text-blue-600" />
                                    Order History
                                </h2>
                                <p className="text-sm text-gray-500">{selectedCustomer?.name} ({selectedCustomer?.email})</p>
                            </div>
                            <button onClick={() => setIsHistoryModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition"><X /></button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {historyLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-gray-500">Loading order history...</p>
                                </div>
                            ) : userOrders.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 italic">
                                    No orders found for this customer.
                                </div>
                            ) : (
                                userOrders.map(order => (
                                    <div key={order._id} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Transaction ID</span>
                                                <p className="font-mono text-sm font-bold text-gray-700">{order.tran_id}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                order.orderStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-3">
                                                       <div className="w-8 h-8 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-[10px] font-bold">x{item.quantity}</div>
                                                       <span className="text-gray-700 font-medium">{item.name}</span>
                                                    </div>
                                                    <span className="text-gray-500">৳{item.subtotal}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                                            <div className="text-xs text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Total Paid</p>
                                                <p className="text-lg font-black text-gray-900">৳{order.pricing.totalAmount}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                             <p className="text-[10px] text-gray-400 font-bold uppercase">End of History</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
