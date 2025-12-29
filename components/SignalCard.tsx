
import React from 'react';
import { VerificationResult } from '../types';
import { ShieldCheck, ShieldAlert, ShieldQuestion, ExternalLink, Clock, TrendingUp } from 'lucide-react';

interface SignalCardProps {
  result: VerificationResult;
}

const SignalCard: React.FC<SignalCardProps> = ({ result }) => {
  const getVerdictStyles = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'true': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: ShieldCheck };
      case 'false': return { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', icon: ShieldAlert };
      case 'misleading': return { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', icon: ShieldAlert };
      case 'developing': return { color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20', icon: TrendingUp };
      default: return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: ShieldQuestion };
    }
  };

  const styles = getVerdictStyles(result.verdict);
  const Icon = styles.icon;

  return (
    <div className={`rounded-2xl border ${styles.border} bg-gray-900 overflow-hidden shadow-2xl transition-all hover:shadow-emerald-500/5`}>
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
               <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded uppercase">{result.category}</span>
               <span className="text-xs text-gray-500 flex items-center gap-1">
                 <Clock size={12} />
                 {new Date(result.timestamp).toLocaleTimeString()}
               </span>
            </div>
            <h3 className="text-xl font-semibold text-white leading-tight">{result.query}</h3>
          </div>
          
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm ${styles.bg} ${styles.color}`}>
              <Icon size={18} />
              {result.verdict}
            </div>
            <div className="mt-2 flex flex-col items-end">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Confidence</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
                <span className="text-sm font-mono text-emerald-500 font-bold">{result.confidence}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-gray-300 mb-8 whitespace-pre-wrap text-sm leading-relaxed border-l-2 border-gray-800 pl-4 py-2">
          {result.analysis.replace(/VERDICT:.*\n|CONFIDENCE:.*\n/g, '')}
        </div>

        <div className="border-t border-gray-800 pt-6">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            Verifiable Sources ({result.sources.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors group border border-gray-700/50"
              >
                <div className="p-2 rounded-lg bg-gray-900 group-hover:bg-emerald-500/10 text-gray-400 group-hover:text-emerald-400 transition-colors">
                  <ExternalLink size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-300 truncate group-hover:text-white">{source.title}</p>
                  <p className="text-[10px] text-gray-500 truncate">{new URL(source.uri).hostname}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalCard;
