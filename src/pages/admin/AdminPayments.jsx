import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  X,
  Copy,
  ChevronRight,
  Package,
  User,
  MapPin,
  Clock,
  ExternalLink,
  RefreshCw,
  Trash2
} from 'lucide-react';



import toast from 'react-hot-toast';

export default function AdminPayments() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // New States for Drill-down
  const [selectedLog, setSelectedLog] = useState(null);
  const [associatedOrder, setAssociatedOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);


  const API = "http://localhost:5000";

  useEffect(() => {
    fetchStats();
    fetchLogs();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/admin/analytics/stats/revenue`, { credentials: "include" });
      const data = await res.json();
      setStats(data.overview);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API}/admin/analytics/logs/payments`, { credentials: "include" });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (tranId) => {
    if (!tranId) return;
    setOrderLoading(true);
    setAssociatedOrder(null);
    try {
      const res = await fetch(`${API}/orders/tran/${tranId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAssociatedOrder(data);
      }
    } catch (err) {
      console.error("Order fetch error:", err);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    fetchOrderDetails(log.tran_id);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Transaction ID copied!");
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;
    try {
      const res = await fetch(`${API}/admin/analytics/logs/payments/${id}`, {
        method: 'DELETE',
        credentials: "include"
      });
      if (res.ok) {
        toast.success("Log deleted");
        fetchLogs();
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ DANGER: Are you sure you want to delete ALL logs? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API}/admin/analytics/logs/payments/all`, {
        method: 'DELETE',
        credentials: "include"
      });
      if (res.ok) {
        toast.success("All logs cleared");
        fetchLogs();
      }
    } catch (err) {
      toast.error("Failed to clear logs");
    }
  };



  const filteredLogs = logs.filter(log =>
    log.tran_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.step?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading">পেমেন্ট অডিট প্যানেল</h1>
            <p className="text-gray-500 mt-1">SSLCommerz ট্রানজ্যাকশন এবং লাইভ লগ মনিটরিং</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchLogs}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
              title="রিলেটেড ডাটা এবং নতুন পেমেন্ট চেক করতে রিফ্রেশ করুন"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> রিফ্রেশ করুন
            </button>
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg flex items-center gap-2 hover:bg-red-100 transition-colors font-bold"
            >
              <Trash2 size={18} /> সব মুছে ফেলুন
            </button>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">মোট রেভিনিউ</p>
                <p className="text-2xl font-bold">৳{stats.totalRevenue?.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">মোট সফল অর্ডার</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">গড় অর্ডার ভ্যালু</p>
                <p className="text-2xl font-bold">৳{Math.round(stats.avgOrderValue || 0)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="ট্রানজ্যাকশন আইডি দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Step</th>
                  <th className="px-6 py-4">Event Data</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>

              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">Loading logs...</td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">No logs found</td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {log.customer?.name || log.data?.customer_name || log.data?.cus_name || 'System Log'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {log.customer?.email || log.data?.customer_email || log.data?.cus_email || 'n/a'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700">
                          {log.customer?.phone || log.data?.cus_phone || '—'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {log.tran_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${log.step === 'ERROR' ? 'bg-red-100 text-red-600' :
                            log.step === 'VALIDATION_RESPONSE' ? 'bg-green-100 text-green-600' :
                              'bg-blue-100 text-blue-600'
                          }`}>
                          {log.step}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-500 max-w-xs truncate">
                          {JSON.stringify(log.data)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition-all"
                          title="View Data"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteLog(log._id)}
                          className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-all"
                          title="Delete Log"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>


      </div>

      {/* --- PAYMENT DETAILS MODAL --- */}
      {selectedLog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${selectedLog.step === 'ERROR' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">ট্রানজ্যাকশন ডিটেইলস</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-sm text-gray-500">{selectedLog.tran_id}</span>
                    <button onClick={() => copyToClipboard(selectedLog.tran_id)} className="text-gray-400 hover:text-orange-500 transition-colors">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 hover:bg-gray-200 text-gray-400 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section 1: Customer & Logistics */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <User size={14} /> কাস্টমার ইনফো
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">নাম</span>
                        <span className="font-semibold text-gray-900">{selectedLog.customer?.name || selectedLog.data?.customer_name || selectedLog.data?.cus_name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">ইমেইল</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLog.customer?.email || selectedLog.data?.customer_email || selectedLog.data?.cus_email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">ফোন</span>
                        <span className="text-sm font-black text-orange-600">{selectedLog.customer?.phone || selectedLog.data?.cus_phone || 'N/A'}</span>
                      </div>


                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <MapPin size={14} /> ডেলিভারি অ্যাড্রেস
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedLog.data?.cus_add1 || 'No address provided in this log step.'}
                        {selectedLog.data?.cus_city && `, ${selectedLog.data.cus_city}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Audit & Status */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <Clock size={14} /> অডিট ট্রেইল
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">লগ স্টেপ</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          selectedLog.step === 'ERROR' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {selectedLog.step}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">সময়</span>
                        <span className="text-sm font-medium text-gray-900">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                      </div>
                      {selectedLog.data?.bank_tran_id && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Bank Tran ID</span>
                          <span className="font-mono text-xs font-bold text-gray-700">{selectedLog.data.bank_tran_id}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing Info if available */}
                  {(selectedLog.data?.amount || selectedLog.data?.total_amount) && (
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard size={64} />
                      </div>
                      <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">টোটাল অ্যামাউন্ট</p>
                      <p className="text-3xl font-black text-orange-900">৳{selectedLog.data?.amount || selectedLog.data?.total_amount}</p>
                      <p className="text-xs text-orange-400 mt-2 font-medium">Currency: {selectedLog.data?.currency || 'BDT'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* --- ASSOCIATED ORDER SECTION --- */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Package size={14} /> অর্ডার আইটেমস
                  </h3>
                  {orderLoading && (
                    <div className="flex items-center gap-2 text-xs text-orange-500 font-medium animate-pulse">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      অর্ডার ডিটেইলস লোড হচ্ছে...
                    </div>
                  )}
                </div>

                {!orderLoading && associatedOrder ? (
                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4">প্রোডাক্ট</th>
                          <th className="px-6 py-4 text-center">পরিমাণ</th>
                          <th className="px-6 py-4 text-right">দাম</th>
                          <th className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {associatedOrder.items?.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {item.thumbnail && <img src={item.thumbnail} className="w-10 h-10 rounded-lg object-cover bg-gray-100" alt="" />}
                                <div>
                                  <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                                  <p className="text-[10px] text-gray-400 font-mono">ID: {item.productId || item._id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center text-sm font-semibold text-gray-700">× {item.quantity}</td>
                            <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">৳{item.price * item.quantity}</td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => setSelectedProduct(item)}
                                className="p-2 hover:bg-orange-50 text-orange-500 rounded-lg transition-colors"
                              >
                                <ChevronRight size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : !orderLoading && !associatedOrder && selectedLog.step !== 'ERROR' ? (
                  <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400 font-medium">এই ট্রানজ্যাকশনের জন্য কোনো অর্ডার পাওয়া যায়নি।</p>
                  </div>
                ) : null}
              </div>

              {/* --- RAW JSON VIEW --- */}
              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="text-xs font-bold text-gray-400 flex items-center gap-2 hover:text-gray-600 transition-colors"
                >
                  {showRawJson ? 'Hide Raw Audit Data' : 'Show Raw Audit Data'}
                  <ChevronRight size={14} className={`transform transition-transform ${showRawJson ? 'rotate-90' : ''}`} />
                </button>
                
                {showRawJson && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 bg-gray-900 rounded-2xl p-6 font-mono text-[11px] leading-relaxed text-emerald-400 overflow-x-auto relative"
                  >
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(selectedLog.data, null, 2))}
                      className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                    <pre>{JSON.stringify(selectedLog.data, null, 2)}</pre>
                  </motion.div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}

      {/* --- NESTED PRODUCT DETAIL MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative"
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-gray-100 text-gray-600 shadow-sm z-10"
            >
              <X size={18} />
            </button>
            
            {selectedProduct.thumbnail && (
              <img src={selectedProduct.thumbnail} className="w-full h-48 object-cover" alt="" />
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 leading-tight">{selectedProduct.name}</h4>
                  <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-wider">Product ID: {selectedProduct.productId || selectedProduct._id}</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit Price</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">৳{selectedProduct.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity</p>
                  <p className="text-2xl font-black text-orange-500 mt-1">{selectedProduct.quantity}</p>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-full mt-6 py-3.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

