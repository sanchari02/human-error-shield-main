import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Camera, Image as ImageIcon, Video, UploadCloud, Loader2 } from 'lucide-react';
import { PREDICT_URL, VIDEO_PROCESS_URL } from '../config';

export default function Controls({ onScreenshot, onStatus }) {
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file) => {
    if (!file) return;
    setLoading(true);
    onStatus?.('Uploading image analysis...');
    
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await axios.post(PREDICT_URL, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onStatus?.(`Image Risk Level: ${data.risk}`);
    } catch (error) {
      console.error(error);
      onStatus?.('Error analyzing image.');
    } finally {
      setLoading(false);
    }
  };

  const uploadVideo = async (file) => {
    if (!file) return;
    setLoading(true);
    onStatus?.('Processing video footage...');

    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await axios.post(VIDEO_PROCESS_URL, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onStatus?.(`Video processed. Total frames: ${data.frames}`);
    } catch (error) {
      console.error(error);
      onStatus?.('Error processing video.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger hidden inputs
  const handleImageClick = () => fileRef.current?.click();
  const handleVideoClick = () => videoRef.current?.click();

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Label */}
        <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
          <UploadCloud size={18} className="text-brand-primary" />
          <span>Input Controls</span>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-3">
          
          {/* 1. Live Capture Button */}
          <button 
            onClick={onScreenshot} 
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-blue-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera size={18} />
            <span>Capture Frame</span>
          </button>

          <div className="w-px h-8 bg-gray-700 mx-1"></div>

          {/* 2. Upload Image Button */}
          <button 
            onClick={handleImageClick}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
            <span className="hidden sm:inline">Upload Image</span>
          </button>

          {/* 3. Upload Video Button */}
          <button 
            onClick={handleVideoClick}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Video size={18} />}
            <span className="hidden sm:inline">Upload Video</span>
          </button>
        </div>
      </div>

      {/* Hidden Inputs */}
      <input 
        type="file" 
        ref={fileRef} 
        onChange={(e) => uploadImage(e.target.files[0])} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={videoRef} 
        onChange={(e) => uploadVideo(e.target.files[0])} 
        accept="video/*" 
        className="hidden" 
      />
    </div>
  );
}