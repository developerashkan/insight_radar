
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import SignalCard from './components/SignalCard';
import PulseRadar from './components/PulseRadar';
import { AppView, VerificationResult, WatchTopic } from './types';
import { verifySignal, getTrendingSignals } from './services/geminiService';
// Added Radio and LayoutDashboard to imports to fix "Cannot find name" errors
import { Search, Loader2, Plus, Trash2, RefreshCcw, Bell, AlertTriangle, Radio, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [trends, setTrends] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<WatchTopic[]>([
    { id: '1', topic: 'AI Regulation Act 2025', lastUpdated: new Date().toISOString(), status: 'monitoring' },
    { id: '2', topic: 'Sustainable Aviation Fuel breakthroughs', lastUpdated: new Date().toISOString(), status: 'idle' }
  ]);

  // Load trends on mount
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const t = await getTrendingSignals();
        setTrends(t);
      } catch (e) {
        console.error("Failed to load trends");
      }
    };
    fetchTrends();
  }, []);

  const handleVerify = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    setIsLoading(true);
    try {
      const result = await verifySignal(finalQuery);
      setResults(prev => [result, ...prev]);
      setQuery('');
      setView(AppView.VERIFY);
    } catch (error) {
      alert("Verification failed. Please check your API key and network.");
    } finally {
      setIsLoading(false);
    }
  };

  const addToWatchlist = (topic: string) => {
    if (!topic.trim()) return;
    const newTopic: WatchTopic = {
      id: Math.random().toString(36).substr(2, 9),
      topic,
      lastUpdated: new Date().toISOString(),
      status: 'monitoring'
    };
    setWatchlist(prev => [newTopic, ...prev]);
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist(prev => prev.filter(t => t.id !== id));
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 space-y-6 w-full">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Insight Radar</h2>
            <p className="text-gray-400">Continuous monitoring of global information vectors.</p>
          </div>
          
          <PulseRadar />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Bell size={14} className="text-emerald-500" />
                Active Alerts
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-sm text-gray-300">System calibrated to latest search trends.</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-800 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                  <span className="text-sm text-gray-400">Watching 2 high-volatility topics.</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <RefreshCcw size={14} className="text-emerald-500" />
                Trending Signals
              </h4>
              <ul className="space-y-2">
                {trends.map((t, i) => (
                  <li 
                    key={i} 
                    className="text-sm text-gray-300 hover:text-emerald-400 cursor-pointer flex items-center gap-2 transition-colors group"
                    onClick={() => { setQuery(t); setView(AppView.VERIFY); }}
                  >
                    <span className="w-1 h-1 bg-gray-700 group-hover:bg-emerald-500 rounded-full"></span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-6">
           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <AlertTriangle size={64} className="text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-emerald-400 mb-2">Claim Verification</h3>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                LiveSignal uses Gemini 3 Flash to cross-reference real-time search results and identify misinformation patterns.
              </p>
              <button 
                onClick={() => setView(AppView.VERIFY)}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                Start Verification
              </button>
           </div>

           <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Verification Feed</h3>
              <div className="space-y-4">
                {results.length > 0 ? results.slice(0, 3).map(res => (
                  <div key={res.id} className="border-l-2 border-emerald-500/50 pl-3 py-1">
                    <p className="text-sm font-medium text-white truncate">{res.query}</p>
                    <p className="text-[10px] text-emerald-500 uppercase font-bold mt-1">{res.verdict}</p>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic">No recent scans performed.</p>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderVerify = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Signal Analysis</h2>
          <p className="text-gray-400">Input any claim, headline, or topic for real-time verification.</p>
        </div>

        <form onSubmit={handleVerify} className="relative group">
          <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-2xl group-focus-within:bg-emerald-500/20 transition-all"></div>
          <div className="relative flex items-center bg-gray-900 border-2 border-gray-800 rounded-2xl p-2 focus-within:border-emerald-500/50 transition-all">
            <Search className="ml-4 text-gray-500" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Is the rumor about the Mars mission delay true?"
              className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4 py-3 placeholder:text-gray-600 text-lg"
            />
            <button 
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-gray-900 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Analyze'}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-800 border-t-emerald-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Radio className="text-emerald-500 w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-emerald-500 font-mono text-sm font-bold animate-pulse">Scanning Global Search Context...</p>
              <p className="text-gray-500 text-xs max-w-xs leading-relaxed italic">"Observing trends, cross-checking narratives, and identifying contradictions..."</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {results.map(res => (
            <SignalCard key={res.id} result={res} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderWatchlist = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Watchlist</h2>
          <p className="text-gray-400">Agents are continuously monitoring these signals for updates.</p>
        </div>
        <div className="flex gap-2">
          <input 
            id="watch-input"
            type="text" 
            placeholder="Topic to watch..."
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white focus:border-emerald-500/50 transition-all outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const el = e.target as HTMLInputElement;
                addToWatchlist(el.value);
                el.value = '';
              }
            }}
          />
          <button 
             onClick={() => {
               const el = document.getElementById('watch-input') as HTMLInputElement;
               addToWatchlist(el.value);
               el.value = '';
             }}
             className="bg-emerald-500 hover:bg-emerald-400 p-2 rounded-xl text-gray-900 transition-all"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {watchlist.map(item => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-between group">
            <div className="flex items-center gap-6">
              <div className={`p-3 rounded-2xl ${item.status === 'monitoring' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-800 text-gray-500'}`}>
                <Radio size={24} className={item.status === 'monitoring' ? 'animate-pulse' : ''} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{item.topic}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'monitoring' ? 'text-emerald-500' : 'text-gray-500'}`}>
                    {item.status}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono">Last pulse: {new Date(item.lastUpdated).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={() => handleVerify(undefined, item.topic)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Manual Refresh"
               >
                 <RefreshCcw size={20} />
               </button>
               <button 
                onClick={() => removeFromWatchlist(item.id)}
                className="p-2 text-gray-400 hover:text-rose-400 transition-colors"
               >
                 <Trash2 size={20} />
               </button>
            </div>
          </div>
        ))}
        {watchlist.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl">
            <p className="text-gray-500">Your watchlist is empty. Add topics to monitor them autonomously.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-black overflow-hidden selection:bg-emerald-500/30">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800 px-8 py-4 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <Radio className="text-emerald-500" />
            <h1 className="text-xl font-bold text-white">LiveSignal</h1>
          </div>
          <button className="text-gray-400" onClick={() => setView(AppView.DASHBOARD)}>
            <LayoutDashboard />
          </button>
        </header>

        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 pb-24">
          {view === AppView.DASHBOARD && renderDashboard()}
          {view === AppView.VERIFY && renderVerify()}
          {view === AppView.WATCHLIST && renderWatchlist()}
          {view === AppView.HISTORY && (
             <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white">Signal History</h2>
                  <button onClick={() => setResults([])} className="text-sm text-gray-500 hover:text-rose-400 transition-colors flex items-center gap-2">
                    <Trash2 size={16} /> Clear Logs
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {results.map(res => (
                     <SignalCard key={res.id} result={res} />
                   ))}
                   {results.length === 0 && (
                     <div className="col-span-full py-20 text-center bg-gray-900/50 rounded-3xl border border-gray-800 border-dashed">
                        <p className="text-gray-500">No signals have been recorded yet.</p>
                     </div>
                   )}
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Floating Action for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button 
          onClick={() => setView(AppView.VERIFY)}
          className="bg-emerald-500 text-gray-900 p-4 rounded-full shadow-2xl shadow-emerald-500/50"
        >
          <Search size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;
