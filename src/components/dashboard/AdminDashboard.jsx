import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { 
    Search, Edit, Trash2, Eye, Plus, Shield, ShieldOff, Check, X, 
    LayoutDashboard, Package, Users, Tags, Menu, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const API = 'http://localhost:5000';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    // Data states
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const [viewProduct, setViewProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('dateDesc');
    const [newCategoryName, setNewCategoryName] = useState('');

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
            setCategories(data);
        } catch (err) {}
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
    
    // --- Category Handlers ---
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if(!newCategoryName.trim()) return;
        try {
            const res = await fetch(`${API}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: newCategoryName })
            });
            if (res.ok) {
                setNewCategoryName('');
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
                <form onSubmit={handleAddCategory} className="flex gap-4">
                    <input 
                        type="text" 
                        value={newCategoryName} 
                        onChange={e => setNewCategoryName(e.target.value)} 
                        placeholder="Category Name (e.g. Daily Essentials)"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-medium transition">
                        Add Category
                    </button>
                </form>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Category Name</th>
                            <th className="px-6 py-4 font-semibold">Slug</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {categories.map(cat => (
                            <tr key={cat._id} className="hover:bg-gray-50/50 transition">
                                <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                                <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDeleteCategory(cat._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-500">No categories found.</td></tr>
                        )}
                    </tbody>
                </table>
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
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex mt-20">
            {/* SIDEBAR */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 fixed bottom-0 top-20 z-10 flex flex-col`}>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    {sidebarOpen && <span className="font-bold tracking-wider text-sm text-gray-500 uppercase">Menu</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg mx-auto md:mx-0">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
                
                <nav className="flex-1 py-4 space-y-1 px-3">
                    {[
                        { id: 'products', icon: Package, label: 'Products' },
                        { id: 'categories', icon: Tags, label: 'Categories' },
                        { id: 'roles', icon: Shield, label: 'Roles & Permissions' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
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
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-6 md:p-8 relative`}>
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')} manager</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your eCommerce store's {activeTab}</p>
                    </div>

                    {activeTab === 'products' && renderProducts()}
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
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative max-h-[90vh] flex flex-col">
                        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
                            <button type="button" onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600 p-2"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="overflow-y-auto p-6 flex-1">
                            <form id="edit-form" onSubmit={handleUpdateProduct} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                                    <input required type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (৳)</label>
                                        <input required type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock available</label>
                                        <input required type="number" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
                                    <input type="text" value={editingProduct.thumbnail || ''} onChange={e => setEditingProduct({...editingProduct, thumbnail: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition" placeholder="https://" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                    <textarea rows={3} value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition" />
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                            <button type="button" onClick={() => setEditingProduct(null)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition">Cancel</button>
                            <button type="submit" form="edit-form" className="px-5 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 shadow-md shadow-orange-200 transition">Save Changes</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
