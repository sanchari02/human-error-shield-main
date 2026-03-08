import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Calendar, Filter, Download, Search, AlertTriangle, CheckCircle, Eye, X } from 'lucide-react';

export default function History() {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // State for the evidence modal

  // Your FastAPI backend URL
  const BACKEND_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    // Fetch real data from backend
    fetch(`${BACKEND_URL}/api/history`)
      .then(res => res.json())
      .then(data => {
        setHistoryLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch history:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* --- Header --- */}
        <header className="px-8 py-6 bg-gray-900 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="text-brand-primary" size={24} />
              Incident History
            </h1>
            <p className="text-gray-400 text-sm mt-1">Review past detections and safety compliance logs.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="bg-gray-800 border border-gray-700 text-sm rounded-xl pl-9 pr-4 py-2 text-white focus:outline-none focus:border-brand-primary w-64 transition"
              />
            </div>
            
            <button className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition">
              <Filter size={20} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-blue-600 text-white rounded-xl font-medium text-sm transition shadow-lg shadow-blue-500/20">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </header>

        {/* --- Table Section --- */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b border-gray-700">Timestamp</th>
                  <th className="px-6 py-4 border-b border-gray-700">Camera Source</th>
                  <th className="px-6 py-4 border-b border-gray-700">Status</th>
                  <th className="px-6 py-4 border-b border-gray-700">Details</th>
                  <th className="px-6 py-4 border-b border-gray-700 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading history...</td></tr>
                ) : historyLogs.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">No incidents recorded yet.</td></tr>
                ) : (
                  historyLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-700/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{log.time}</div>
                        <div className="text-gray-500 text-xs">{log.date}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {log.camera}
                      </td>
                      <td className="px-6 py-4">
                        <RiskBadge status={log.risk} />
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {log.details}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {log.image && (
                          <button 
                            onClick={() => setSelectedImage(`${BACKEND_URL}/incidents/${log.image}`)}
                            className="text-brand-primary hover:text-white text-sm font-medium hover:underline flex items-center justify-end gap-1 opacity-80 hover:opacity-100 transition ml-auto"
                          >
                            View Evidence <Eye size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Evidence Modal --- */}
        {selectedImage && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8">
            <div className="bg-gray-900 border border-gray-700 p-4 rounded-2xl shadow-2xl max-w-4xl w-full relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Incident Evidence</h3>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>
              <img 
                src={selectedImage} 
                alt="Incident Evidence" 
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg border border-gray-800"
              />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// Helper Component for Status Badges
const RiskBadge = ({ status }) => {
  const styles = {
    High: 'bg-red-500/10 text-red-400 border-red-500/20',
    Warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Safe: 'bg-green-500/10 text-green-400 border-green-500/20'
  };

  const icons = {
    High: <AlertTriangle size={14} />,
    Warning: <AlertTriangle size={14} />,
    Safe: <CheckCircle size={14} />
  };

  // Capitalize first letter just in case
  const safeStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[safeStatus] || styles.Safe}`}>
      {icons[safeStatus] || icons.Safe}
      {safeStatus} Risk
    </span>
  );
};