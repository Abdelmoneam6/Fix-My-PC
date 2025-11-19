import React, { useState } from 'react';
import Header from './components/Header';
import Troubleshooter from './components/Troubleshooter';
import VisualInspector from './components/VisualInspector';
import ResourceFinder from './components/ResourceFinder';
import { AppMode } from './types';
import { Wrench, Zap, Camera, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  const renderContent = () => {
    switch (mode) {
      case AppMode.TROUBLESHOOT:
        return <Troubleshooter />;
      case AppMode.INSPECT:
        return <VisualInspector />;
      case AppMode.RESOURCES:
        return <ResourceFinder />;
      case AppMode.HOME:
      default:
        return <HomeView setMode={setMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-900 text-gray-200 selection:bg-cyber-primary selection:text-black pb-20 md:pb-0">
      <Header currentMode={mode} setMode={setMode} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

const HomeView: React.FC<{ setMode: (mode: AppMode) => void }> = ({ setMode }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center py-12 lg:py-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyber-primary to-cyber-secondary">
          FIX YOUR RIG
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          The ultimate AI-powered toolkit for PC hardware diagnostics. 
          Identify broken parts, find drivers, and get real-time repair advice.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <button 
             onClick={() => setMode(AppMode.TROUBLESHOOT)}
             className="px-8 py-4 bg-cyber-primary hover:bg-white text-black font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,242,255,0.3)] flex items-center justify-center gap-2"
           >
             <Wrench size={20} />
             Start Diagnostics
           </button>
           <button 
             onClick={() => setMode(AppMode.INSPECT)}
             className="px-8 py-4 bg-transparent border border-gray-600 hover:border-white text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 hover:bg-white/5"
           >
             <Camera size={20} />
             Scan Hardware
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <FeatureCard 
          icon={<Zap className="text-yellow-400" size={32} />}
          title="AI Troubleshooter"
          description="Interactive chat bot that helps you isolate issues like No POST, crashes, or overheating using step-by-step logic."
          onClick={() => setMode(AppMode.TROUBLESHOOT)}
        />
        <FeatureCard 
          icon={<Camera className="text-cyber-secondary" size={32} />}
          title="Visual Inspection"
          description="Upload photos of your motherboard or GPU. Our AI looks for burnt capacitors, bent pins, and other physical damage."
          onClick={() => setMode(AppMode.INSPECT)}
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-green-400" size={32} />}
          title="Part & Driver Finder"
          description="Need a manual or a specific driver? We search the web for the most up-to-date official sources for your specific model."
          onClick={() => setMode(AppMode.RESOURCES)}
        />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, onClick: () => void }> = ({ icon, title, description, onClick }) => (
  <div 
    onClick={onClick}
    className="group glass-panel p-8 rounded-3xl cursor-pointer hover:border-cyber-primary/50 transition-all duration-300 hover:-translate-y-1"
  >
    <div className="mb-4 bg-gray-800/50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-gray-700 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyber-primary transition-colors">{title}</h3>
    <p className="text-gray-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export default App;
