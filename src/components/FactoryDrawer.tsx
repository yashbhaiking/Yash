import React, { useState } from 'react';
import { X, Wrench, Sparkles, Code2, Play, Flame } from 'lucide-react';
import { voiceEngine } from '../voice/voiceEngine';

interface FactoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onBuildCustom: (prompt: string, category: string, customCode?: string) => void;
}

export const FactoryDrawer: React.FC<FactoryDrawerProps> = ({
  isOpen,
  onClose,
  onBuildCustom
}) => {
  const [featureName, setFeatureName] = useState('');
  const [category, setCategory] = useState('Custom Factory');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customHtml, setCustomHtml] = useState('');
  const [useCustomCode, setUseCustomCode] = useState(false);

  if (!isOpen) return null;

  const PRESET_IDEAS = [
    { title: "Cyber Space Defense 3D", cat: "Games", prompt: "space defense game 3d with lasers and asteroids" },
    { title: "Ultra AI Voice Synthesizer", cat: "AI Tools", prompt: "voice clone and neural sound generator" },
    { title: "Solana Realtime Liquidity Radar", cat: "Web3 Crypto", prompt: "solana live price and dex tracker" },
    { title: "Stark Arc Shield Diagnostics", cat: "Stark Advanced", prompt: "system diagnose and reactor overclock" },
    { title: "Minimalist Cyber Paint Canvas", cat: "Apps", prompt: "photoshop clone drawing canvas app" },
    { title: "High-Speed QR Scanner & Maker", cat: "Utilities", prompt: "qr bulk generator with encryption" }
  ];

  const handleApplyPreset = (idea: { title: string; cat: string; prompt: string }) => {
    setFeatureName(idea.title);
    setCategory(idea.cat);
    setCustomPrompt(idea.prompt);
    voiceEngine.playSound('beep');
  };

  const handleForge = () => {
    const finalPrompt = customPrompt.trim() || featureName.trim() || "Dynamic Quantum Feature";
    voiceEngine.playSound('reactor');
    onBuildCustom(finalPrompt, category, useCustomCode && customHtml.trim() ? customHtml : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#030906] border-2 border-[#00f5a0] rounded-2xl shadow-[0_0_35px_rgba(0,245,160,0.3)] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f5a0]/30 bg-[#00140c]">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#00f5a0]" />
            <div>
              <h2 className="text-base font-orbitron font-bold tracking-wider text-[#00f5a0]">
                FACTORY // FORGE NEW FEATURE ON DEMAND
              </h2>
              <div className="text-[11px] text-[#00e5ff] font-mono">
                Autonomous 1-Second Synthesis • Zero Code Required
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
          {/* Quick Presets */}
          <div>
            <div className="text-xs font-mono text-[#00f5a0] flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> QUICK FORGE TEMPLATES
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(idea)}
                  className="p-2.5 text-left bg-black/60 border border-[#00f5a0]/25 rounded-xl hover:border-[#00f5a0] hover:bg-[#00f5a0]/10 transition-all text-xs"
                >
                  <div className="font-bold text-white truncate">{idea.title}</div>
                  <div className="text-[10px] text-[#00e5ff] font-mono">{idea.cat}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="p-4 bg-[#06150f] border border-[#00f5a0]/30 rounded-xl space-y-3">
            <div>
              <label className="block text-xs font-mono text-[#00f5a0] mb-1">
                FEATURE / PLUGIN NAME
              </label>
              <input
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                placeholder="e.g. Cyber Cyberpunk Car Racing 3D"
                className="w-full p-2.5 bg-black border border-[#00f5a0]/40 rounded-lg text-xs text-[#00f5a0] font-mono focus:outline-none focus:border-[#00f5a0]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#00f5a0] mb-1">
                  CATEGORY TARGET
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-black border border-[#00f5a0]/40 rounded-lg text-xs text-[#00f5a0] font-mono focus:outline-none"
                >
                  <option value="Games">Games</option>
                  <option value="Apps">Apps</option>
                  <option value="AI Tools">AI Tools</option>
                  <option value="API Advanced">API Advanced</option>
                  <option value="Phone Hardware">Phone Hardware</option>
                  <option value="Communication">Communication</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Stark Advanced">Stark Advanced</option>
                  <option value="Web3 Crypto">Web3 Crypto</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Business">Business</option>
                  <option value="Custom Factory">Custom Factory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#00f5a0] mb-1">
                  FACTORY DIRECTIVE / KEYWORDS
                </label>
                <input
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. chess game or todo advanced"
                  className="w-full p-2.5 bg-black border border-[#00f5a0]/40 rounded-lg text-xs text-[#00f5a0] font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="codeCheck"
                checked={useCustomCode}
                onChange={(e) => setUseCustomCode(e.target.checked)}
                className="rounded accent-[#00f5a0]"
              />
              <label htmlFor="codeCheck" className="text-xs font-mono text-gray-300 flex items-center gap-1 cursor-pointer">
                <Code2 className="w-3.5 h-3.5 text-[#00f5a0]" /> Override with Custom HTML / JavaScript Code
              </label>
            </div>

            {useCustomCode && (
              <div>
                <textarea
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  placeholder="<!DOCTYPE html><html><head>...</head><body><h1>My Custom Tool</h1><script>...</script></body></html>"
                  rows={5}
                  className="w-full p-2 bg-black border border-[#00f5a0]/40 rounded-lg text-xs text-[#00f5a0] font-mono focus:outline-none"
                />
              </div>
            )}

            <button
              onClick={handleForge}
              className="w-full py-3 bg-[#00f5a0] hover:bg-[#00d282] active:scale-95 text-black font-orbitron font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,245,160,0.4)] transition-all"
            >
              <Flame className="w-4 h-4 fill-current" /> FORGE FEATURE IN 1 SECOND SIR!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
