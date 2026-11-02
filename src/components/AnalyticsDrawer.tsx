import React from 'react';
import { X, BarChart3, Activity, Cpu, Zap, CheckCircle2 } from 'lucide-react';
import { PluginExecutionStats } from '../types';
import { CATEGORIES } from '../registry/categories';

interface AnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PluginExecutionStats;
  totalExecutions: number;
  recentRuns: Array<{ prompt: string; cat: string; time: string }>;
}

export const AnalyticsDrawer: React.FC<AnalyticsDrawerProps> = ({
  isOpen,
  onClose,
  stats,
  totalExecutions,
  recentRuns
}) => {
  if (!isOpen) return null;

  // Compute maximum count for relative bar graph
  const maxCategoryExec = Math.max(1, ...Object.values(stats));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-[#030906] border-2 border-[#00f5a0] rounded-2xl shadow-[0_0_35px_rgba(0,245,160,0.3)] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f5a0]/30 bg-[#00140c]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00f5a0]" />
            <div>
              <h2 className="text-base font-orbitron font-bold tracking-wider text-[#00f5a0]">
                ANALYTICS // 1000 FEATURES USAGE TELEMETRY
              </h2>
              <div className="text-[11px] text-[#00e5ff] font-mono">
                Real-Time Quantum Execution Metrics & Category Graphs
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-black/60 border border-[#00f5a0]/30 rounded-xl">
              <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#00f5a0]" /> TOTAL RUNS
              </div>
              <div className="text-xl font-bold font-orbitron text-[#00f5a0] mt-1">
                {totalExecutions}
              </div>
            </div>

            <div className="p-3 bg-black/60 border border-[#00e5ff]/30 rounded-xl">
              <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#00e5ff]" /> LOADED REGISTRY
              </div>
              <div className="text-xl font-bold font-orbitron text-[#00e5ff] mt-1">
                1,000
              </div>
            </div>

            <div className="p-3 bg-black/60 border border-[#f59e0b]/30 rounded-xl">
              <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#f59e0b]" /> CORE MATRIX
              </div>
              <div className="text-xl font-bold font-orbitron text-[#f59e0b] mt-1">
                100 Core
              </div>
            </div>

            <div className="p-3 bg-black/60 border border-[#10b981]/30 rounded-xl">
              <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#10b981]" /> DYNAMIC PLUGINS
              </div>
              <div className="text-xl font-bold font-orbitron text-[#10b981] mt-1">
                900 Factory
              </div>
            </div>
          </div>

          {/* Graph Section: Usage by Category */}
          <div className="p-4 bg-[#06150f] border border-[#00f5a0]/30 rounded-xl">
            <div className="text-xs font-mono font-bold text-[#00f5a0] mb-3 flex items-center justify-between">
              <span>CATEGORY USAGE DISTRIBUTION GRAPH</span>
              <span className="text-[10px] text-gray-400">Scale 0 - {maxCategoryExec} runs</span>
            </div>

            <div className="space-y-2.5">
              {CATEGORIES.map((catObj) => {
                const count = stats[catObj.cat] || 0;
                const percentage = Math.round((count / maxCategoryExec) * 100);
                return (
                  <div key={catObj.cat} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-gray-200">{catObj.cat} <span className="text-gray-500">({catObj.count} plugins)</span></span>
                      <span className="text-[#00f5a0] font-bold">{count} runs</span>
                    </div>
                    <div className="w-full bg-black/80 h-2 rounded-full overflow-hidden border border-[#00f5a0]/20">
                      <div
                        className="h-full bg-gradient-to-r from-[#00e5ff] to-[#00f5a0] transition-all duration-500"
                        style={{ width: `${Math.max(count > 0 ? 5 : 0, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Real-Time Runs */}
          <div className="p-4 bg-black/60 border border-[#00f5a0]/20 rounded-xl">
            <div className="text-xs font-mono font-bold text-[#00e5ff] mb-2">
              RECENT EXECUTION TRACE LOG
            </div>
            {recentRuns.length === 0 ? (
              <div className="text-xs font-mono text-gray-500">No recent executions recorded yet. Trigger any feature to log.</div>
            ) : (
              <div className="space-y-1.5">
                {recentRuns.slice(0, 8).map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-mono py-1 border-b border-gray-800">
                    <span className="text-white truncate max-w-[220px]">⚡ {r.prompt}</span>
                    <span className="text-[#00f5a0] text-[10px] px-2 py-0.5 rounded bg-[#00f5a0]/10 border border-[#00f5a0]/30">{r.cat}</span>
                    <span className="text-gray-500 text-[10px]">{r.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
