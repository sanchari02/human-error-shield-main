import React from 'react';
import Sidebar from '../components/Sidebar';
import VideoPanel from '../components/VideoPanel';
import { Activity, Radio, Wifi } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden font-sans">
      
      {/* Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* --- Top Header Bar --- */}
        <header className="h-16 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-6 shrink-0">
          
          {/* Left: Page Title */}
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">Live Monitoring</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Active
            </p>
          </div>

          {/* Right: System Status Indicators */}
          <div className="flex items-center gap-6">
            <StatusBadge icon={<Wifi size={14} />} label="Connection" value="Stable" color="text-green-400" />
            <StatusBadge icon={<Activity size={14} />} label="Latency" value="24ms" color="text-brand-primary" />
            <div className="h-8 w-px bg-gray-800 mx-2"></div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-semibold animate-pulse">
              <Radio size={14} />
              LIVE FEED
            </div>
          </div>
        </header>

        {/* --- Content Body --- */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col relative">
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
          </div>

          {/* Video Panel Container */}
          <div className="flex-1 w-full h-full flex flex-col z-10">
            <VideoPanel />
          </div>

        </div>
      </main>
    </div>
  );
}

// Small helper component for the header stats
const StatusBadge = ({ icon, label, value, color }) => (
  <div className="flex flex-col items-end">
    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{label}</span>
    <div className={`flex items-center gap-1.5 text-sm font-medium ${color}`}>
      {icon}
      <span>{value}</span>
    </div>
  </div>
);