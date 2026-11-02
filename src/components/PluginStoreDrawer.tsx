import React, { useState, useMemo } from 'react';
import { FeatureItem } from '../types';
import { X, Search, Play, Layers, Sparkles, Filter } from 'lucide-react';

interface PluginStoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allFeatures: FeatureItem[];
  onRunPlugin: (cmd: string, cat: string) => void;
}

export const PluginStoreDrawer: React.FC<PluginStoreDrawerProps> = ({
  isOpen,
  onClose,
  allFeatures,
  onRunPlugin
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allFeatures.map(f => f.cat)));
    return ['ALL', ...cats];
  }, [allFeatures]);

  const filteredFeatures = useMemo(() => {
    return allFeatures.filter(f => {
      const matchCat = selectedCategory === 'ALL' || f.cat === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchCat;
      const matchText =
        f.name.toLowerCase().includes(term) ||
        f.cmd.toLowerCase().includes(term) ||
        f.cat.toLowerCase().includes(term) ||
        f.id.toString().includes(term);
      return matchCat && matchText;
    });
  }, [allFeatures, selectedCategory, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#030906] border-2 border-[#00f5a0] rounded-2xl shadow-[0_0_35px_rgba(0,245,160,0.3)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f5a0]/30 bg-[#00140c]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00f5a0]" />
            <div>
              <h2 className="text-base font-orbitron font-bold tracking-wider text-[#00f5a0]">
                PLUGIN STORE // 900 AUTONOMOUS EXTENSIONS
              </h2>
              <div className="text-[11px] text-[#00e5ff] font-mono">
                Total Registry: 1000 Features Armed • Filtered: {filteredFeatures.length} Available
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

        {/* Search & Category Filter */}
        <div className="p-3 border-b border-[#00f5a0]/20 bg-black/60 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#00f5a0]" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 1000 features by ID, command or keyword (e.g. 'car racing', 'chess', 'image gen', 'btc')..."
              className="w-full pl-9 pr-4 py-2 bg-black border border-[#00f5a0]/40 rounded-xl text-xs text-[#00f5a0] placeholder-gray-500 font-mono focus:outline-none focus:border-[#00f5a0] shadow-[inset_0_0_10px_rgba(0,245,160,0.1)]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono no-scrollbar">
            <span className="text-gray-400 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-[#00f5a0]" /> Cat:
            </span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  selectedCategory === c
                    ? 'bg-[#00f5a0] text-black border-[#00f5a0] shadow-[0_0_8px_rgba(0,245,160,0.4)]'
                    : 'bg-black/40 text-gray-300 border-[#00f5a0]/30 hover:border-[#00f5a0] hover:text-[#00f5a0]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Grid / List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredFeatures.slice(0, 150).map((f) => (
              <div
                key={f.id}
                className="p-3 bg-black/60 border border-[#00f5a0]/25 rounded-xl flex items-center justify-between hover:border-[#00f5a0] hover:shadow-[0_0_12px_rgba(0,245,160,0.15)] transition-all group"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#00f5a0]/15 text-[#00f5a0] border border-[#00f5a0]/30">
                      #{f.id}
                    </span>
                    <span className="text-xs font-bold text-white truncate group-hover:text-[#00f5a0] transition-colors">
                      {f.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                    <span className="text-[#00e5ff]">{f.cat}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400 truncate">"{f.cmd}"</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onRunPlugin(f.cmd, f.cat);
                  }}
                  className="shrink-0 px-3 py-1.5 bg-[#00f5a0] text-black font-bold text-xs rounded-lg flex items-center gap-1 hover:bg-[#00d282] active:scale-95 transition-all shadow-[0_0_10px_rgba(0,245,160,0.3)]"
                >
                  <Play className="w-3 h-3 fill-current" /> RUN
                </button>
              </div>
            ))}
          </div>

          {filteredFeatures.length > 150 && (
            <div className="text-center py-3 text-xs font-mono text-gray-500">
              Showing first 150 results. Use the search bar above to narrow down specific commands.
            </div>
          )}

          {filteredFeatures.length === 0 && (
            <div className="text-center py-12 text-gray-400 font-mono text-xs">
              <Sparkles className="w-8 h-8 text-[#00f5a0] mx-auto mb-2 opacity-50" />
              No plugins match your search query. Use "Factory — Create New Feature" to forge it live!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
