import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Search,
  Filter,
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPayments() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

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
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Download size={18} /> রিফ্রেশ করুন
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
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Step</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading logs...</td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No logs found</td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{log.data?.customer_name || log.data?.cus_name || 'System'}</span>
                          <span className="text-xs text-gray-500">{log.data?.customer_email || log.data?.cus_email || 'n/a'}</span>
                        </div>
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
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => console.log(log)}
                          className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition-all"
                          title="View Data"
                        >
                          <Eye size={18} />
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
    </div>
  );
}
