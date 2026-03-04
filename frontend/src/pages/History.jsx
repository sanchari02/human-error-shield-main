import React from 'react';
import Sidebar from '../components/Sidebar';
import { Calendar, Filter, Download, Search, AlertTriangle, CheckCircle, Eye } from 'lucide-react';

export default function History() {
  // Mock Data for demonstration
  const historyLogs = [
    { id: 1, time: '10:42 AM', date: 'Oct 24, 2024', camera: 'Cam-01 (Main Gate)', risk: 'High', details: 'Missing Helmet Detected', image: 'preview1.jpg' },
    { id: 2, time: '10:38 AM', date: 'Oct 24, 2024', camera: 'Cam-03 (Warehouse)', risk: 'Safe', details: 'Full PPE Compliance', image: 'preview2.jpg' },
    { id: 3, time: '09:15 AM', date: 'Oct 24, 2024', camera: 'Cam-02 (Assembly)', risk: 'Warning', details: 'Vest not fully secured', image: 'preview3.jpg' },
    { id: 4, time: '08:55 AM', date: 'Oct 24, 2024', camera: 'Cam-01 (Main Gate)', risk: 'High', details: 'Unauthorized zone entry', image: 'preview4.jpg' },
    { id: 5, time: '04:30 PM', date: 'Oct 23, 2024', camera: 'Cam-04 (Loading)', risk: 'Safe', details: 'Routine Check', image: 'preview5.jpg' },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      <Sidebar />
      
      {/* Main Scrollable Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
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
            {/* Search Bar */}
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
                {historyLogs.map((log) => (
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
                      <button className="text-brand-primary hover:text-white text-sm font-medium hover:underline flex items-center justify-end gap-1 opacity-80 hover:opacity-100 transition">
                        View Evidence <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/30 flex items-center justify-between">
              <span className="text-sm text-gray-500">Showing 1-5 of 128 incidents</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white text-sm transition">Previous</button>
                <button className="px-3 py-1 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white text-sm transition">Next</button>
              </div>
            </div>
          </div>
        </div>

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

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.Safe}`}>
      {icons[status]}
      {status} Risk
    </span>
  );
};