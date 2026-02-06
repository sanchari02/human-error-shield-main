import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Settings, Sliders, ShieldAlert, ToggleLeft, ToggleRight, Save, Loader2 } from 'lucide-react';

// You might need to update this URL if your config is different
const API_URL = 'http://127.0.0.1:8000'; 

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confidence, setConfidence] = useState(50);
  const [iou, setIou] = useState(45);
  const [classes, setClasses] = useState({
    helmet: true, vest: true, gloves: true, goggles: true, boots: true
  });

  // 1. Fetch settings on load
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Add a timeout of 2000ms (2 seconds)
      const { data } = await axios.get(`${API_URL}/settings/`, { timeout: 2000 });
      setConfidence(data.confidence);
      setIou(data.iou);
      setClasses(data.classes);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load settings", err);
      // STOP LOADING even if error
      setLoading(false);
      // Optional: Show an alert or toast here
    }
  };

  // 2. Save settings to backend
  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`${API_URL}/settings/`, {
        confidence: parseInt(confidence),
        iou: parseInt(iou),
        classes: classes
      });
      alert('Settings saved successfully!');
    } catch (err) {
      console.error("Failed to save settings", err);
      alert('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  const toggleClass = (key) => setClasses(prev => ({ ...prev, [key]: !prev[key] }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Settings className="text-brand-primary" /> 
              System Configuration
            </h1>
            <p className="text-gray-400 mt-2">Manage AI detection parameters.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-brand-primary hover:bg-blue-600 text-white rounded-xl font-semibold transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
              <Sliders className="text-blue-400" size={20} />
              <h2 className="text-xl font-semibold text-white">Detection Thresholds</h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Confidence Score</label>
                  <span className="text-brand-primary font-bold">{confidence}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={confidence} 
                  onChange={(e) => setConfidence(e.target.value)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">IoU Threshold</label>
                  <span className="text-brand-primary font-bold">{iou}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={iou} 
                  onChange={(e) => setIou(e.target.value)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
              <ShieldAlert className="text-orange-400" size={20} />
              <h2 className="text-xl font-semibold text-white">Active PPE Classes</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(classes).map(([key, isActive]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                  <div className="capitalize font-medium text-gray-200">{key} Detection</div>
                  <button onClick={() => toggleClass(key)} className={isActive ? 'text-brand-primary' : 'text-gray-600'}>
                    {isActive ? <ToggleRight size={40} className="fill-current" /> : <ToggleLeft size={40} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}