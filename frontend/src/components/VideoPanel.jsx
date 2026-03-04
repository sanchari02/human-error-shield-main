import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Maximize2 } from 'lucide-react';

export default function VideoPanel() {
  const [error, setError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  
  // This must match your FastAPI backend URL
  const STREAM_URL = "http://127.0.0.1:8000/video/stream";

  const handleRetry = () => {
    setError(false);
    // Force browser to reload image by appending a timestamp
    const img = document.getElementById('security-feed');
    if (img) img.src = `${STREAM_URL}?t=${Date.now()}`;
  };

  return (
    <div className={`relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col group ${fullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      
      {/* --- Main Video Area --- */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-900">
        {!error ? (
          <img 
            id="security-feed"
            src={STREAM_URL}
            alt="Live Safety Stream" 
            className="w-full h-full object-contain"
            onError={() => setError(true)}
          />
        ) : (
          /* Error State UI */
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Signal Lost</h3>
            <p className="text-gray-400 max-w-sm mb-6 text-sm">
              Cannot connect to the camera feed at <span className="font-mono text-brand-primary">{STREAM_URL}</span>. 
              Ensure the backend server is running.
            </p>
            <button 
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition border border-gray-600 text-sm"
            >
              <RefreshCw size={16} />
              Retry Connection
            </button>
          </div>
        )}

        {/* Overlay: Camera Metadata (Only visible on hover) */}
        {!error && (
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-mono border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            CAM_01 • LIVE • 30FPS
          </div>
        )}
      </div>

      {/* --- Bottom Controls Bar --- */}
      <div className="h-12 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {error ? 'OFFLINE' : 'Real-time Inference'}
          </span>
        </div>

        <button 
          onClick={() => setFullscreen(!fullscreen)}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
          title="Toggle Fullscreen"
        >
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
}