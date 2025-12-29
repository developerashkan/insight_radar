
import React, { useEffect, useState } from 'react';
import { Activity, Radio } from 'lucide-react';

const PulseRadar: React.FC = () => {
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-80 bg-gray-900/50 rounded-3xl border border-gray-800 overflow-hidden flex items-center justify-center">
      {/* Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-24 h-24 border border-emerald-500 rounded-full"></div>
        <div className="w-48 h-48 border border-emerald-500/50 rounded-full absolute"></div>
        <div className="w-72 h-72 border border-emerald-500/20 rounded-full absolute"></div>
        <div className="w-96 h-96 border border-emerald-500/10 rounded-full absolute"></div>
        <div className="w-[500px] h-[500px] border border-emerald-500/5 rounded-full absolute"></div>
      </div>

      {/* Sweeping Line */}
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full origin-center animate-[spin_4s_linear_infinite] pointer-events-none"></div>

      {/* Center Icon */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-40 animate-pulse"></div>
          <div className="w-16 h-16 bg-gray-900 border border-emerald-500/50 rounded-full flex items-center justify-center relative">
            <Radio className="text-emerald-500 w-8 h-8" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-emerald-500 font-mono text-sm font-bold tracking-[0.2em] uppercase">Global Scanning</p>
          <div className="flex items-center gap-2 mt-1">
             <Activity className="text-emerald-500/50 w-3 h-3" />
             <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Buffer: Online</span>
          </div>
        </div>
      </div>

      {/* Detected Blips */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-ping [animation-delay:1s]"></div>
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
    </div>
  );
};

export default PulseRadar;
