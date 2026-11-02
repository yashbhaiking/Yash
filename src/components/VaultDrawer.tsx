import React, { useState } from 'react';
import { VaultKey, VaultNote, VaultMemory } from '../types';
import { 
  Key, 
  Gamepad2, 
  StickyNote, 
  BrainCircuit, 
  X, 
  Plus, 
  Trash2, 
  Copy, 
  Play, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { voiceEngine } from '../voice/voiceEngine';

interface VaultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  keys: VaultKey[];
  onAddKey: (name: string, key: string, service: string) => void;
  onDeleteKey: (id: string) => void;
  notes: VaultNote[];
  onAddNote: (title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  memories: VaultMemory[];
  onAddMemory: (key: string, value: string) => void;
  onDeleteMemory: (id: string) => void;
  onLaunchGame: (cmd: string) => void;
}

export const VaultDrawer: React.FC<VaultDrawerProps> = ({
  isOpen,
  onClose,
  keys,
  onAddKey,
  onDeleteKey,
  notes,
  onAddNote,
  onDeleteNote,
  memories,
  onAddMemory,
  onDeleteMemory,
  onLaunchGame
}) => {
  const [activeTab, setActiveTab] = useState<'keys' | 'games' | 'notes' | 'memories'>('keys');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Key form
  const [keyName, setKeyName] = useState('');
  const [keyValue, setKeyValue] = useState('');
  const [keyService, setKeyService] = useState('Google Gemini');

  // Note form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Memory form
  const [memKey, setMemKey] = useState('');
  const [memValue, setMemValue] = useState('');

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    voiceEngine.playSound('beep');
    setTimeout(() => setCopiedId(null), 1500);
  };

  const QUICK_GAMES = [
    { name: "Cyber Racer 2099", cmd: "car racing 3d", cat: "Racing" },
    { name: "Cyber Chess Engine", cmd: "chess game", cat: "Strategy" },
    { name: "Matrix Snake 2099", cmd: "snake game", cat: "Arcade" },
    { name: "Neon Retro Pong", cmd: "pong game", cat: "Arcade" },
    { name: "Space Invaders 3D", cmd: "space defense", cat: "Shooter" },
    { name: "PUBG Cyber Arena", cmd: "pubg clone 1", cat: "Action" },
    { name: "Quantum Reflex Test", cmd: "reaction game", cat: "Reflex" },
    { name: "Cricket Tactical Sim", cmd: "cricket game", cat: "Sports" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#030906] border-2 border-[#00f5a0] rounded-2xl shadow-[0_0_35px_rgba(0,245,160,0.3)] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00f5a0]/30 bg-[#00140c]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00f5a0]" />
            <h2 className="text-base font-orbitron font-bold tracking-wider text-[#00f5a0]">
              STARK VAULT // ENCRYPTED STORAGE
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-4 p-2 gap-2 border-b border-[#00f5a0]/20 bg-black/50 text-xs font-mono">
          <button
            onClick={() => setActiveTab('keys')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold transition-all ${
              activeTab === 'keys'
                ? 'bg-[#00f5a0] text-black shadow-[0_0_12px_rgba(0,245,160,0.5)]'
                : 'text-gray-400 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>KEYS ({keys.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold transition-all ${
              activeTab === 'games'
                ? 'bg-[#00f5a0] text-black shadow-[0_0_12px_rgba(0,245,160,0.5)]'
                : 'text-gray-400 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>GAMES (100)</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold transition-all ${
              activeTab === 'notes'
                ? 'bg-[#00f5a0] text-black shadow-[0_0_12px_rgba(0,245,160,0.5)]'
                : 'text-gray-400 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10'
            }`}
          >
            <StickyNote className="w-4 h-4" />
            <span>NOTES ({notes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('memories')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold transition-all ${
              activeTab === 'memories'
                ? 'bg-[#00f5a0] text-black shadow-[0_0_12px_rgba(0,245,160,0.5)]'
                : 'text-gray-400 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>MEMORIES ({memories.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: KEYS */}
          {activeTab === 'keys' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#06150f] border border-[#00f5a0]/30 rounded-xl space-y-2">
                <div className="text-xs font-mono text-[#00f5a0] flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> ADD NEW ENCRYPTED API KEY
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="Key Identifier (e.g. Gemini)"
                    className="p-2 bg-black border border-[#00f5a0]/40 rounded-lg text-xs text-[#00f5a0] placeholder-gray-500 font-mono focus:outline-none focus:border-[#00f5a0]"
                  />
                  <input
                    value={keyService}
                    onChange={(e) => setKeyService(e.target.value)}
                    placeholder="Service (e.g. Google AI)"
                    className="p-2 bg-black border border-[#00f5a0]/40 rounded-lg text-xs text-[#00f5a0] placeholder-gray-500 font-mono focus:outline-none focus:border-[#00f5a0]"
                  />
                  <input
                    value={keyValue}
                    onChange={(e) => setKeyValue(e.target.value)}
                    placeholder="API Key Secret"
                    type="password"
                    className="p-2 bg-black border border-[#00f5a0]/40 rounded-lg text-xs text-[#00f5a0] placeholder-gray-500 font-mono focus:outline-none focus:border-[#00f5a0]"
                  />
                </div>
                <button
                  onClick={() => {
                    if (keyName && keyValue) {
                      onAddKey(keyName, keyValue, keyService);
                      setKeyName('');
                      setKeyValue('');
                      voiceEngine.playSound('success');
                    }
                  }}
                  className="w-full py-1.5 bg-[#00f5a0] text-black font-bold text-xs rounded-lg hover:bg-[#00d282] transition-colors"
                >
                  SAVE KEY TO FIREBASE & VAULT
                </button>
              </div>

              <div className="space-y-2">
                {keys.map((k) => (
                  <div
                    key={k.id}
                    className="flex items-center justify-between p-3 bg-black/60 border border-[#00f5a0]/20 rounded-xl hover:border-[#00f5a0]/50 transition-all"
                  >
                    <div>
                      <div className="font-bold text-xs text-white">{k.name}</div>
                      <div className="text-[10px] text-[#00e5ff] font-mono">{k.service} • {k.dateAdded}</div>
                      <div className="text-[11px] text-gray-400 font-mono">••••••••••••••••••••••••</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(k.id, k.key)}
                        className="p-1.5 bg-[#00f5a0]/10 text-[#00f5a0] border border-[#00f5a0]/30 rounded-lg hover:bg-[#00f5a0]/20 text-xs"
                      >
                        {copiedId === k.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => onDeleteKey(k.id)}
                        className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: GAMES */}
          {activeTab === 'games' && (
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#00f5a0]">QUICK LAUNCH ARCADE & SIMULATORS (100 TOTAL)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QUICK_GAMES.map((g, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-black/60 border border-[#00f5a0]/30 rounded-xl flex items-center justify-between hover:border-[#00f5a0] hover:shadow-[0_0_15px_rgba(0,245,160,0.2)] transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{g.name}</div>
                      <div className="text-[10px] text-[#00e5ff] font-mono">{g.cat} • Canvas Engine</div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onLaunchGame(g.cmd);
                      }}
                      className="px-3 py-1.5 bg-[#00f5a0] text-black font-bold text-xs rounded-lg flex items-center gap-1 hover:bg-[#00d282] active:scale-95 transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" /> PLAY
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#06150f] border border-[#00f5a0]/30 rounded-xl space-y-2">
                <input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note Title"
                  className="w-full p-2 bg-black border border-[#00f5a0]/40 rounded-lg text-xs text-[#00f5a0] placeholder-gray-500 font-mono focus:outline-none"
                />
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter JARVIS mission directive, notes or encrypted code snippet..."
                  rows={3}
                  className="w-full p-2 bg-black border border-[#00f5a0]/40 rounded-lg text-xs text-[#00f5a0] placeholder-gray-500 font-mono focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (noteTitle && noteContent) {
                      onAddNote(noteTitle, noteContent);
                      setNoteTitle('');
                      setNoteContent('');
                      voiceEngine.playSound('success');
                    }
                  }}
                  className="w-full py-1.5 bg-[#00f5a0] text-black font-bold text-xs rounded-lg hover:bg-[#00d282]"
                >
                  SAVE NOTE TO VAULT
                </button>
              </div>

              <div className="space-y-2">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-black/60 border border-[#00f5a0]/20 rounded-xl hover:border-[#00f5a0]/50"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-bold text-xs text-white">{n.title}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 font-mono">{n.timestamp}</span>
                        <button
                          onClick={() => onDeleteNote(n.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{n.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MEMORIES */}
          {activeTab === 'memories' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#06150f] border border-[#00f5a0]/30 rounded-xl space-y-2">
                <div className="text-xs font-mono text-[#00f5a0]">LEARN NEW USER MEMORY / RULE</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    value={memKey}
                    onChange={(e) => setMemKey(e.target.value)}
                    placeholder="Memory Key (e.g. Master Title)"
                    className="p-2 bg-black border border-[#00f5a0]/40 rounded-lg text-xs text-[#00f5a0] placeholder-gray-500 font-mono focus:outline-none"
                  />
                  <input
                    value={memValue}
                    onChange={(e) => setMemValue(e.target.value)}
                    placeholder="Memory Value (e.g. Adarsh Sir)"
                    className="p-2 bg-black border border-[#00f5a0]/40 rounded-lg text-xs text-[#00f5a0] placeholder-gray-500 font-mono focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    if (memKey && memValue) {
                      onAddMemory(memKey, memValue);
                      setMemKey('');
                      setMemValue('');
                      voiceEngine.playSound('success');
                    }
                  }}
                  className="w-full py-1.5 bg-[#00f5a0] text-black font-bold text-xs rounded-lg hover:bg-[#00d282]"
                >
                  IMPRINT TO NEURAL MATRIX
                </button>
              </div>

              <div className="space-y-2">
                {memories.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 bg-black/60 border border-[#00f5a0]/20 rounded-xl"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#00f5a0] font-mono">{m.key}</div>
                      <div className="text-xs text-white">{m.value}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{m.timestamp}</div>
                    </div>
                    <button
                      onClick={() => onDeleteMemory(m.id)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
