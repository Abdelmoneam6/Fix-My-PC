import React from 'react';
import { AppMode } from '../types';
import { Cpu, Wrench, Search, Camera, Activity } from 'lucide-react';

interface HeaderProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { mode: AppMode.HOME, icon: <Activity size={20} />, label: 'Dashboard' },
    { mode: AppMode.TROUBLESHOOT, icon: <Wrench size={20} />, label: 'Diagnose' },
    { mode: AppMode.INSPECT, icon: <Camera size={20} />, label: 'Visual Inspector' },
    { mode: AppMode.RESOURCES, icon: <Search size={20} />, label: 'Find Drivers' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setMode(AppMode.HOME)}
          >
            <div className="bg-gradient-to-br from-cyber-primary to-cyber-secondary p-2 rounded-lg">
              <Cpu className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-primary to-cyber-secondary">
              FixMyRig
            </span>
          </div>

          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <button
                key={item.mode}
                onClick={() => setMode(item.mode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentMode === item.mode
                    ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/50 shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button (Simplified for this example) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMode(AppMode.TROUBLESHOOT)}
              className="p-2 text-cyber-primary"
            >
              <Wrench />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-cyber-900 border-t border-gray-800 flex justify-around py-3 pb-safe safe-area-inset-bottom z-50">
         {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`flex flex-col items-center gap-1 ${currentMode === item.mode ? 'text-cyber-primary' : 'text-gray-500'}`}
            >
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
            </button>
         ))}
      </div>
    </header>
  );
};

export default Header;
