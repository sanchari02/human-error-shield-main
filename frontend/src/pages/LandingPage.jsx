import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Video, ArrowRight, Activity, Users } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import workerSafety from "../assets/bg1.avif";
import f1 from "../assets/f1.avif";
import f2 from "../assets/f2.avif";
import f3 from "../assets/f3.avif";


const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openLogin = () => { setAuthMode('login'); setIsAuthOpen(true); };
  const openSignup = () => { setAuthMode('signup'); setIsAuthOpen(true); };

  return (
    <div className="min-h-screen font-sans bg-gray-900 text-gray-100">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} />

      {/* --- Navbar --- */}
      <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-brand-primary/20 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-brand-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Human Error Shield
              </span>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={openLogin}
                className="hidden sm:block text-gray-300 hover:text-white font-medium transition"
              >
                Sign In
              </button>
              <button 
                onClick={openSignup} 
                className="bg-brand-primary hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 text-blue-400 font-semibold text-sm mb-6 border border-blue-800">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
              </span>
              System Active: AI Monitoring Live
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Safety Intelligence for <br />
              <span className="bg-clip-text bg-linear-to-r from-brand-primary text-blue-400">
                The Modern Workforce
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Detect PPE violations instantly. Protect your team with computer vision that works with your existing cameras.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button 
                onClick={openSignup}
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-blue-400 transition shadow-xl flex items-center justify-center gap-2"
              >
                Start Monitoring <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-transparent border border-gray-700 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-primary" />
                <span>10k+ Workers Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-primary" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto lg:ml-auto w-full max-w-lg lg:max-w-full">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-800">
               <img 
                 src={workerSafety} 
                 alt="Worker Safety" 
                 className="w-full h-auto object-cover transform hover:scale-105 transition duration-700 opacity-90"
               />
               
               {/* Floating Badge overlay */}
               <div className="absolute bottom-6 left-6 bg-gray-900/95 backdrop-blur px-4 py-3 rounded-xl shadow-lg border border-gray-700 flex items-center gap-3">
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                 <div>
                   <p className="text-xs text-gray-400 uppercase font-semibold">Status</p>
                   <p className="text-sm font-bold text-white">Safe • PPE Detected</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Features Grid --- */}
      <section className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Complete Safety Ecosystem</h2>
            <p className="text-gray-400">Everything you need to maintain 100% compliance automatically.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Video className="w-6 h-6 text-white" />}
              color="bg-blue-600"
              title="Real-time Surveillance"
              desc="Seamlessly integrates with your existing CCTV infrastructure to provide 24/7 automated monitoring."
              image={f1}
            />
            <FeatureCard 
              icon={<AlertTriangle className="w-6 h-6 text-white" />}
              color="bg-orange-600"
              title="Instant Risk Alerts"
              desc="Detects missing helmets, vests, or goggles instantly and triggers on-site alarms or admin notifications."
              image={f2}
            />
            <FeatureCard 
              icon={<CheckCircle className="w-6 h-6 text-white" />}
              color="bg-green-600"
              title="Automated Compliance"
              desc="Generate daily safety reports and overlap checks to ensure every worker on site is fully protected."
              image={f3}
            />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-black text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-brand-primary" />
            <span className="text-white font-bold text-lg">Human Error Shield</span>
          </div>
          <p className="mb-4 text-sm">© 2024 Safety AI Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, color, title, desc, image }) => (
  <div className="rounded-2xl border border-gray-700 bg-gray-900 overflow-hidden hover:shadow-xl hover:shadow-blue-900/10 transition duration-300 group flex flex-col h-full">
    {/* Card Image */}
    <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-transparent transition z-10" />
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <div className={`absolute top-4 left-4 w-10 h-10 rounded-lg ${color} flex items-center justify-center shadow-lg z-20`}>
            {icon}
        </div>
    </div>
    
    <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm flex-1">{desc}</p>
        
        <div className="mt-4 pt-4 border-t border-gray-800 flex items-center text-brand-primary font-medium text-sm group-hover:gap-2 transition-all cursor-pointer">
            Learn more <ArrowRight className="w-4 h-4" />
        </div>
    </div>
  </div>
);

export default LandingPage;