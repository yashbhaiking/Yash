/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mic, 
  MicOff, 
  Send, 
  Search, 
  Layers, 
  Wrench, 
  BarChart3, 
  ShieldCheck, 
  Battery, 
  BatteryCharging,
  Clock, 
  Key, 
  Gamepad2, 
  BrainCircuit, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  X, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Code
} from 'lucide-react';

import { FeatureItem, TranscriptLog, VaultKey, VaultNote, VaultMemory, PluginExecutionStats } from './types';
import { CORE_100 } from './registry/core100';
import { CATEGORIES, generate900Plugins, ALL_1000_FEATURES } from './registry/categories';
import { dynamicPlugin, buildGame, buildApp } from './factory/pluginFactory';
import { executeCore100 } from './registry/coreHandler';
import { voiceEngine } from './voice/voiceEngine';
import { OrbCanvas } from './components/OrbCanvas';
import { VaultDrawer } from './components/VaultDrawer';
import { PluginStoreDrawer } from './components/PluginStoreDrawer';
import { FactoryDrawer } from './components/FactoryDrawer';
import { AnalyticsDrawer } from './components/AnalyticsDrawer';
import { 
  getLocalVaultKeys, 
  saveVaultKey, 
  deleteVaultKey,
  getLocalVaultNotes,
  saveVaultNote,
  deleteVaultNote,
  getLocalVaultMemories,
  saveVaultMemory,
  deleteVaultMemory
} from './firebase';

export default function App() {
  // Master features registry
  const [allFeatures, setAllFeatures] = useState<FeatureItem[]>(ALL_1000_FEATURES);

  // Status & Telemetry
  const [statusText, setStatusText] = useState<string>("🏭 Factory Ready Sir — 1000 Features Armed — Awaiting Order...");
  const [orbState, setOrbState] = useState<'idle' | 'listening' | 'speaking' | 'building' | 'armed'>('armed');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Command & Search inputs
  const [commandInput, setCommandInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Transcript Activity Logs
  const [transcripts, setTranscripts] = useState<TranscriptLog[]>([
    {
      id: 't_init_1',
      sender: 'jarvis',
      text: 'Adarsh JARVIS 1000 Universe Edition online Sir! 100 Core + 900 Dynamic Plugins armed and ready.',
      timestamp: new Date().toLocaleTimeString(),
      badge: 'UNIVERSE KERNEL'
    },
    {
      id: 't_init_2',
      sender: 'factory',
      text: 'Autonomous Plugin Factory connected to Firebase project deled-87163. Say "feature banao" or type any command to synthesize live.',
      timestamp: new Date().toLocaleTimeString(),
      badge: 'FACTORY READY'
    }
  ]);

  // Preview iframe state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [previewCategory, setPreviewCategory] = useState<string>('');
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState<boolean>(false);
  const [previewRawHtml, setPreviewRawHtml] = useState<string>('');
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);

  // Drawers state
  const [activeDrawer, setActiveDrawer] = useState<'vault' | 'store' | 'factory' | 'analytics' | null>(null);

  // Vault data state
  const [vaultKeys, setVaultKeys] = useState<VaultKey[]>([]);
  const [vaultNotes, setVaultNotes] = useState<VaultNote[]>([]);
  const [vaultMemories, setVaultMemories] = useState<VaultMemory[]>([]);

  // Analytics stats
  const [executionStats, setExecutionStats] = useState<PluginExecutionStats>(() => {
    const init: PluginExecutionStats = {};
    CATEGORIES.forEach(c => { init[c.cat] = Math.floor(Math.random() * 5); });
    init["Core 100"] = 12;
    return init;
  });
  const [totalExecutions, setTotalExecutions] = useState<number>(18);
  const [recentRuns, setRecentRuns] = useState<Array<{ prompt: string; cat: string; time: string }>>([
    { prompt: "chess game 1", cat: "Games", time: "Just now" },
    { prompt: "system diagnose", cat: "Stark Advanced", time: "1m ago" },
    { prompt: "btc price", cat: "Web3 Crypto", time: "3m ago" }
  ]);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Initialize Clock & Battery
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Battery API
    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        battery.addEventListener('levelchange', () => setBatteryLevel(Math.round(battery.level * 100)));
        battery.addEventListener('chargingchange', () => setIsCharging(battery.charging));
      }).catch(() => {});
    }

    // Load Vault items
    setVaultKeys(getLocalVaultKeys());
    setVaultNotes(getLocalVaultNotes());
    setVaultMemories(getLocalVaultMemories());

    return () => clearInterval(interval);
  }, []);

  // Scroll transcript to top on new entries
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollTop = 0;
    }
  }, [transcripts]);

  // Voice wrapper
  const speakText = (text: string) => {
    if (isVoiceMuted) return;
    setOrbState('speaking');
    voiceEngine.speak(text, () => {
      setOrbState('idle');
    });
  };

  const addTranscript = (sender: 'user' | 'jarvis' | 'factory' | 'system', text: string, badge?: string, code?: string) => {
    const newLog: TranscriptLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      badge,
      code
    };
    setTranscripts(prev => [newLog, ...prev]);
  };

  const recordExecution = (prompt: string, cat: string) => {
    setTotalExecutions(prev => prev + 1);
    setExecutionStats(prev => ({
      ...prev,
      [cat]: (prev[cat] || 0) + 1
    }));
    setRecentRuns(prev => [
      { prompt, cat, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev.slice(0, 20)
    ]);
  };

  // Launch dynamic feature into iframe
  const launchDynamicPlugin = async (prompt: string, cat: string = "Dynamic Plugin", customHtmlOverride?: string) => {
    setOrbState('building');
    setStatusText(`🏭 Factory Building: ${prompt} — Category ${cat} — Plugin #${Date.now().toString().slice(-6)}`);
    speakText(`Building ${prompt} Sir — Factory Mode — 1000 Feature System!`);
    voiceEngine.playSound('reactor');

    try {
      let finalHtml = customHtmlOverride;
      let finalUrl = "";
      let id = Date.now();

      if (customHtmlOverride) {
        const blob = new Blob([customHtmlOverride], { type: "text/html" });
        finalUrl = URL.createObjectURL(blob);
      } else {
        const res = await dynamicPlugin(prompt, cat);
        finalHtml = res.html;
        finalUrl = res.url;
        id = res.id;
      }

      setPreviewUrl(finalUrl);
      setPreviewTitle(prompt.toUpperCase());
      setPreviewCategory(cat);
      setPreviewRawHtml(finalHtml || '');

      addTranscript('factory', `Factory synthesized <b>${prompt}</b> successfully! Feature active in preview sandbox.`, `PLUGIN #${id.toString().slice(-5)}`, finalHtml);
      setStatusText(`✅ Active: ${prompt} — Category ${cat} — Running in Sandbox Sir!`);
      setOrbState('idle');
      recordExecution(prompt, cat);
      speakText(`${prompt} built Sir! Plugin #${id.toString().slice(-4)} — 1000 Factory Success!`);

      // Celebrate with confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00f5a0', '#00e5ff', '#ffffff']
      });

    } catch (err) {
      console.error(err);
      setStatusText(`⚠️ Factory Error synthesizing ${prompt}`);
      setOrbState('idle');
    }
  };

  // Handle Core 100 Features
  const handleCore100 = (id: number, text: string) => {
    const res = executeCore100(id, text);
    speakText(res.speech);
    setStatusText(`⚡ Executing Core Feature #${id}: ${text}`);
    addTranscript('jarvis', res.message, `CORE #${id}`);
    recordExecution(text, res.category);

    // If it has previewable HTML (like game, diagnosis radar, api check), load into iframe
    if (res.previewHtml) {
      const blob = new Blob([res.previewHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewTitle(`CORE #${id} — ${text.toUpperCase()}`);
      setPreviewCategory(res.category);
      setPreviewRawHtml(res.previewHtml);
    } else if (id >= 31 && id <= 40) {
      // It's a Core game, build interactive game
      const html = buildGame(text);
      const blob = new Blob([html], { type: "text/html" });
      setPreviewUrl(URL.createObjectURL(blob));
      setPreviewTitle(`CORE GAME #${id} — ${text.toUpperCase()}`);
      setPreviewCategory("Games");
      setPreviewRawHtml(html);
    } else if (id === 61 || id === 67) {
      // Calculator or Markdown app
      const html = buildApp(text);
      const blob = new Blob([html], { type: "text/html" });
      setPreviewUrl(URL.createObjectURL(blob));
      setPreviewTitle(`CORE APP #${id} — ${text.toUpperCase()}`);
      setPreviewCategory("Apps");
      setPreviewRawHtml(html);
    }
  };

  // List 1000 Features command
  const list1000Features = () => {
    speakText("1000 features loaded Sir — Opening full plugin store registry!");
    setActiveDrawer('store');
    addTranscript('system', "Loaded all 1,000 features into the Plugin Store directory Sir. Filter or search any capability instantly.", "REGISTRY 1000");
  };

  // ULTIMATE BRAIN IMPLEMENTATION
  const ultimateBrain = async (rawText: string) => {
    if (!rawText.trim()) return;
    const text = rawText.trim();
    const lower = text.toLowerCase();

    addTranscript('user', text, 'COMMAND IN');
    voiceEngine.playSound('beep');

    // 1. Check for 1000 list commands
    if (lower.includes("1000") || lower.includes("saare feature") || lower.includes("all features") || lower.includes("list features")) {
      list1000Features();
      return;
    }

    // 2. Check for "feature banao" or "plugin banao" or "naya feature"
    if (lower.includes("feature banao") || lower.includes("plugin banao") || lower.includes("naya feature")) {
      const custom = text.replace(/feature banao|plugin banao|naya feature/gi, "").trim() || ("Custom Feature " + Date.now().toString().slice(-4));
      await launchDynamicPlugin(custom, "Custom Factory");
      return;
    }

    // 3. Search in 1000 registry
    const match = allFeatures.find(p => 
      lower === p.cmd.toLowerCase() ||
      lower.includes(p.cmd.toLowerCase()) || 
      lower.includes(p.name.toLowerCase()) ||
      p.cmd.toLowerCase().includes(lower)
    );

    if (match) {
      if (match.id <= 100) {
        handleCore100(match.id, text);
      } else {
        await launchDynamicPlugin(match.cmd, match.cat);
      }
      return;
    }

    // 4. Default Fallback
    speakText(`Samajh gaya Sir — ${text} — Building as new plugin #1000+ Sir!`);
    await launchDynamicPlugin(text, "Auto Factory");
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commandInput.trim()) {
      const cmd = commandInput;
      setCommandInput('');
      ultimateBrain(cmd);
    }
  };

  // Toggle voice recognition
  const toggleMic = () => {
    voiceEngine.toggleListening(
      (transcript) => {
        setIsListening(false);
        setOrbState('idle');
        ultimateBrain(transcript);
      },
      (err) => {
        setIsListening(false);
        setOrbState('idle');
        console.warn("Speech error:", err);
      },
      (listening) => {
        setIsListening(listening);
        setOrbState(listening ? 'listening' : 'idle');
        if (listening) {
          setStatusText("🎙️ Listening Sir... Speak in Hindi or English...");
        }
      }
    );
  };

  // Vault actions
  const handleAddVaultKey = async (name: string, key: string, service: string) => {
    const saved = await saveVaultKey({ name, key, service, dateAdded: 'Just now' });
    setVaultKeys(prev => [saved, ...prev]);
    addTranscript('system', `Encrypted key for <b>${name}</b> saved to Firebase & Vault.`, 'VAULT KEY');
  };

  const handleDeleteVaultKey = async (id: string) => {
    await deleteVaultKey(id);
    setVaultKeys(prev => prev.filter(k => k.id !== id));
  };

  const handleAddVaultNote = async (title: string, content: string) => {
    const saved = await saveVaultNote(title, content);
    setVaultNotes(prev => [saved, ...prev]);
    addTranscript('system', `Note <b>${title}</b> saved to encrypted vault.`, 'VAULT NOTE');
  };

  const handleDeleteVaultNote = (id: string) => {
    deleteVaultNote(id);
    setVaultNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleAddVaultMemory = async (key: string, value: string) => {
    const saved = await saveVaultMemory(key, value);
    setVaultMemories(prev => [saved, ...prev]);
    addTranscript('system', `Neural memory <b>${key} = ${value}</b> committed to core.`, 'MEMORY SYNAPSE');
  };

  const handleDeleteVaultMemory = (id: string) => {
    deleteVaultMemory(id);
    setVaultMemories(prev => prev.filter(m => m.id !== id));
  };

  // Filtered search list for the top search bar
  const searchResults = searchQuery.trim()
    ? allFeatures.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.id.toString() === searchQuery.trim()
      ).slice(0, 8)
    : [];

  return (
    <div className="min-h-screen bg-[#020202] text-[#e2e8f0] flex flex-col font-mono selection:bg-[#00f5a0] selection:text-black relative cyber-grid">
      {/* SCANLINES OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-40 scanlines opacity-50" />

      {/* TOP HEADER & TELEMETRY */}
      <header className="sticky top-0 z-30 bg-[#020202]/90 backdrop-blur-md border-b border-[#00f5a0]/30 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
        {/* Main Banner Title */}
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between border-b border-[#00f5a0]/15 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f5a0] animate-pulse shadow-[0_0_8px_#00f5a0]" />
            <h1 className="text-xs sm:text-sm font-orbitron font-extrabold tracking-wider text-white flex items-center gap-1.5">
              <span className="text-[#00f5a0] neon-glow">ADARSH JARVIS 1000</span>
              <span className="text-[#00e5ff] hidden sm:inline">— UNIVERSE</span>
              <span className="text-gray-400 font-normal hidden md:inline">— 1000 FEATURES</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00f5a0]/10 border border-[#00f5a0]/40 text-[#00f5a0] font-mono">
                BY @free_maker93
              </span>
            </h1>
          </div>

          {/* Quick HUD Triggers */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setIsVoiceMuted(!isVoiceMuted)}
              className="p-1.5 rounded-lg border border-[#00f5a0]/30 bg-black/40 text-gray-300 hover:text-[#00f5a0] hover:border-[#00f5a0] transition-colors"
              title={isVoiceMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {isVoiceMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#00f5a0]" />}
            </button>
            <button
              onClick={() => setActiveDrawer('analytics')}
              className="px-2.5 py-1 rounded-lg border border-[#00e5ff]/40 bg-[#00e5ff]/10 text-[#00e5ff] font-bold flex items-center gap-1 hover:bg-[#00e5ff]/20 transition-all text-[11px]"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ANALYTICS</span>
            </button>
            <button
              onClick={() => setActiveDrawer('vault')}
              className="px-2.5 py-1 rounded-lg border border-[#00f5a0]/40 bg-[#00f5a0]/10 text-[#00f5a0] font-bold flex items-center gap-1 hover:bg-[#00f5a0]/20 transition-all text-[11px]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VAULT</span>
            </button>
          </div>
        </div>

        {/* Live Telemetry Bar */}
        <div className="px-4 py-1.5 bg-[#00100a] text-[10px] sm:text-[11px] text-[#00f5a0]/90 flex flex-wrap items-center justify-between gap-y-1 gap-x-3 border-b border-[#00f5a0]/20">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1">
              {isCharging ? (
                <BatteryCharging className="w-3.5 h-3.5 text-[#00e5ff] animate-pulse" />
              ) : (
                <Battery className="w-3.5 h-3.5 text-[#00f5a0]" />
              )}
              <span>BATT: {batteryLevel}%</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>TIME: {currentTime || '09:20:00'}</span>
            </div>

            <div className="flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>KEYS: {vaultKeys.length}</span>
            </div>

            <div className="flex items-center gap-1">
              <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
              <span>GAMES: 100</span>
            </div>

            <div className="flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
              <span>MEMORIES: {vaultMemories.length}</span>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#00f5a0]/15 border border-[#00f5a0]/40 text-[#00f5a0] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>PLUGINS LOADED: 1000</span>
            </div>
          </div>

          <div className="text-[10px] text-[#00e5ff] hidden lg:block">
            FIREBASE: deled-87163 • KERNEL: ONLINE
          </div>
        </div>

        {/* Search Bar #search1000 */}
        <div className="p-2 sm:px-4 sm:py-2.5 bg-black/70 relative">
          <div className="relative max-w-4xl mx-auto">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#00f5a0]" />
            <input
              id="search1000"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search 1000 features by ID, command or keyword (e.g. 'car racing', 'chess', 'image gen', 'btc')..."
              className="w-full pl-10 pr-24 py-2 bg-[#050c09] border border-[#00f5a0]/40 rounded-xl text-xs text-[#00f5a0] placeholder-gray-500 font-mono focus:outline-none focus:border-[#00f5a0] shadow-[0_0_15px_rgba(0,245,160,0.15)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-12 top-2 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
            <button
              onClick={() => {
                if (searchQuery.trim()) {
                  ultimateBrain(searchQuery);
                  setSearchQuery('');
                }
              }}
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-[#00f5a0] text-black font-bold text-[11px] rounded-lg hover:bg-[#00d282] transition-colors"
            >
              RUN
            </button>

            {/* Instant Search Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#030c08] border-2 border-[#00f5a0] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] max-h-72 overflow-y-auto z-50 p-1.5 space-y-1">
                {searchResults.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => {
                      ultimateBrain(f.cmd);
                      setSearchQuery('');
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-black/60 hover:bg-[#00f5a0]/15 cursor-pointer border border-transparent hover:border-[#00f5a0]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#00f5a0]/20 text-[#00f5a0]">
                        #{f.id}
                      </span>
                      <span className="text-xs font-bold text-white">{f.name}</span>
                      <span className="text-[10px] text-[#00e5ff]">[{f.cat}]</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">"{f.cmd}"</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN BODY AREA */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* CENTER SECTION: ORB + STATUS + PREVIEW & TRANSCRIPT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* LEFT / CENTER: ORB CANVAS & STATUS */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-[#030906] border-2 border-[#00f5a0]/30 rounded-2xl shadow-[0_0_30px_rgba(0,245,160,0.1)] relative overflow-hidden group">
            {/* Background cyber accent */}
            <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#00f5a0]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Orb Canvas 260px */}
            <OrbCanvas state={orbState} onClick={toggleMic} />

            {/* Status Text Box */}
            <div
              id="status"
              className="w-full text-center text-xs font-mono font-bold text-[#00f5a0] mt-3 px-3 py-2 bg-black/70 border border-[#00f5a0]/30 rounded-xl min-h-[36px] flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,245,160,0.1)] transition-all"
            >
              {statusText}
            </div>

            {/* Quick Orb Action Controls */}
            <div className="flex items-center gap-2 mt-3 w-full justify-center">
              <button
                onClick={() => ultimateBrain("system diagnose")}
                className="px-3 py-1 bg-black/60 border border-[#00f5a0]/30 rounded-lg text-[10px] text-gray-300 hover:text-[#00f5a0] hover:border-[#00f5a0] transition-colors"
              >
                ⚡ DIAGNOSE
              </button>
              <button
                onClick={() => ultimateBrain("ram booster")}
                className="px-3 py-1 bg-black/60 border border-[#00f5a0]/30 rounded-lg text-[10px] text-gray-300 hover:text-[#00f5a0] hover:border-[#00f5a0] transition-colors"
              >
                🚀 BOOST RAM
              </button>
              <button
                onClick={() => ultimateBrain("roast me")}
                className="px-3 py-1 bg-black/60 border border-[#00f5a0]/30 rounded-lg text-[10px] text-gray-300 hover:text-[#00f5a0] hover:border-[#00f5a0] transition-colors"
              >
                🔥 ROAST
              </button>
            </div>
          </div>

          {/* RIGHT: PREVIEW IFRAME OR TRANSCRIPT */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* PREVIEW IFRAME CONTAINER (If Active) */}
            {previewUrl && (
              <div
                id="previewArea"
                className={`bg-[#030906] border-2 border-[#00f5a0] rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,245,160,0.25)] flex flex-col transition-all ${
                  isPreviewFullscreen ? 'fixed inset-4 z-50 max-h-none' : 'h-[360px]'
                }`}
              >
                {/* Preview Window Header */}
                <div className="flex items-center justify-between p-2.5 bg-[#00150d] border-b border-[#00f5a0]/40">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-pulse" />
                    <span className="text-xs font-bold text-white font-orbitron truncate">
                      {previewTitle}
                    </span>
                    <span className="text-[10px] text-[#00e5ff] px-2 py-0.5 rounded bg-[#00e5ff]/10 border border-[#00e5ff]/30 font-mono">
                      {previewCategory}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-400">
                    <button
                      onClick={() => setShowCodeModal(!showCodeModal)}
                      className="p-1.5 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10 rounded"
                      title="Inspect HTML"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (iframeRef.current && previewUrl) {
                          iframeRef.current.src = previewUrl;
                          voiceEngine.playSound('beep');
                        }
                      }}
                      className="p-1.5 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10 rounded"
                      title="Reload Sandbox"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(previewUrl, '_blank')}
                      className="p-1.5 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10 rounded"
                      title="Open in new window"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
                      className="p-1.5 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10 rounded"
                      title="Fullscreen"
                    >
                      {isPreviewFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setPreviewUrl(null)}
                      className="p-1.5 hover:text-red-400 hover:bg-red-500/10 rounded"
                      title="Close Preview"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* The Iframe Sandbox */}
                <iframe
                  ref={iframeRef}
                  id="gameFrame"
                  src={previewUrl}
                  title="Jarvis 1000 Feature Sandbox"
                  sandbox="allow-scripts allow-same-origin allow-modals allow-downloads allow-popups"
                  className="w-full flex-1 border-none bg-black"
                />
              </div>
            )}

            {/* TRANSCRIPT 250PX CONTAINER */}
            <div className="bg-[#030906] border-2 border-[#00f5a0]/30 rounded-2xl flex flex-col h-[280px] overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#00120b] border-b border-[#00f5a0]/20 text-[11px] font-mono">
                <span className="text-[#00f5a0] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> MISSION TRANSCRIPT // QUANTUM LOG
                </span>
                <span className="text-gray-500 text-[10px]">{transcripts.length} entries</span>
              </div>

              {/* Logs Stream (250px scrollable area) */}
              <div
                ref={transcriptEndRef}
                id="transcript"
                className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs font-mono"
              >
                {transcripts.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-xl border transition-all ${
                      log.sender === 'user'
                        ? 'bg-[#001c12] border-[#00f5a0]/40 text-[#00f5a0]'
                        : log.sender === 'factory'
                        ? 'bg-[#0b1723] border-[#00e5ff]/40 text-[#a5f3fc]'
                        : log.sender === 'system'
                        ? 'bg-[#151100] border-amber-500/30 text-amber-200'
                        : 'bg-[#050f0a] border-[#00f5a0]/20 text-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1 opacity-70">
                      <span className="font-bold flex items-center gap-1">
                        {log.sender === 'user' ? '👤 YOU' : log.sender === 'factory' ? '🏭 FACTORY' : '🤖 JARVIS 1000'}
                        {log.badge && (
                          <span className="px-1 py-0.2 rounded bg-black/40 border border-current text-[9px]">
                            {log.badge}
                          </span>
                        )}
                      </span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: log.text }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* QUICK CATEGORY SHELF / FEATURE TILES */}
        <div className="p-3 bg-[#030906] border border-[#00f5a0]/25 rounded-2xl">
          <div className="flex items-center justify-between mb-2 text-xs font-mono">
            <span className="text-[#00f5a0] font-bold">🚀 POPULAR CATEGORIES & SPEED LAUNCHERS</span>
            <button
              onClick={() => setActiveDrawer('store')}
              className="text-[#00e5ff] hover:underline flex items-center gap-1 text-[11px]"
            >
              View All 1000 →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs font-mono">
            {[
              { label: "♟️ Chess Engine", cmd: "chess game", cat: "Games" },
              { label: "🏎️ Car Racing 3D", cmd: "car racing 3d", cat: "Games" },
              { label: "🎨 Image Gen AI", cmd: "image gen", cat: "AI Tools" },
              { label: "🔢 Sci Calculator", cmd: "calculator scientific", cat: "Apps" },
              { label: "📊 BTC Live Price", cmd: "btc price", cat: "Web3 Crypto" },
              { label: "🔳 QR Bulk Maker", cmd: "qr bulk", cat: "Utilities" }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => ultimateBrain(item.cmd)}
                className="p-2 bg-black/60 border border-[#00f5a0]/30 rounded-xl hover:border-[#00f5a0] hover:bg-[#00f5a0]/15 active:scale-95 transition-all text-left group"
              >
                <div className="font-bold text-white group-hover:text-[#00f5a0] truncate">
                  {item.label}
                </div>
                <div className="text-[10px] text-[#00e5ff]">{item.cat}</div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* BOTTOM CONTROLS & DOCK */}
      <footer className="sticky bottom-0 z-30 bg-[#020202]/95 backdrop-blur-md border-t border-[#00f5a0]/40 p-2.5 sm:p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {/* 3 MODES BUTTONS */}
          <div className="grid grid-cols-3 gap-2 text-xs font-orbitron font-bold">
            <button
              onClick={() => {
                setActiveDrawer('store');
                voiceEngine.playSound('beep');
              }}
              className="py-2 px-2 sm:px-4 rounded-xl bg-black border border-[#00f5a0]/40 text-[#00f5a0] hover:bg-[#00f5a0]/15 hover:border-[#00f5a0] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(0,245,160,0.1)] text-[11px] sm:text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>CORE 100</span>
            </button>

            <button
              onClick={() => {
                setActiveDrawer('store');
                voiceEngine.playSound('beep');
              }}
              className="py-2 px-2 sm:px-4 rounded-xl bg-black border border-[#00e5ff]/40 text-[#00e5ff] hover:bg-[#00e5ff]/15 hover:border-[#00e5ff] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(0,229,255,0.1)] text-[11px] sm:text-xs"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>PLUGINS 900</span>
            </button>

            <button
              onClick={() => {
                setActiveDrawer('factory');
                voiceEngine.playSound('beep');
              }}
              className="py-2 px-2 sm:px-4 rounded-xl bg-[#00f5a0] text-black font-extrabold hover:bg-[#00d282] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,245,160,0.4)] text-[11px] sm:text-xs active:scale-95"
            >
              <Wrench className="w-3.5 h-3.5 fill-current" />
              <span>FACTORY // CREATE</span>
            </button>
          </div>

          {/* INPUT + MIC BUTTON + SEND */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-red-500 border-red-400 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.7)]'
                  : 'bg-black border-[#00f5a0]/50 text-[#00f5a0] hover:bg-[#00f5a0]/15 hover:border-[#00f5a0] shadow-[0_0_10px_rgba(0,245,160,0.15)]'
              }`}
              title={isListening ? "Listening... Click to stop" : "Speak in Hindi or English"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Command Text Input */}
            <div className="relative flex-1">
              <input
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Give command in Hindi/English or type 'feature banao car racing'..."
                className="w-full pl-3 pr-10 py-2.5 bg-black border border-[#00f5a0]/50 rounded-xl text-xs sm:text-sm text-[#00f5a0] placeholder-gray-500 font-mono focus:outline-none focus:border-[#00f5a0] shadow-[inset_0_0_12px_rgba(0,245,160,0.15)]"
              />
              <button
                type="submit"
                disabled={!commandInput.trim()}
                className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-[#00f5a0] text-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00d282] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </footer>

      {/* DRAWERS / MODALS */}
      <VaultDrawer
        isOpen={activeDrawer === 'vault'}
        onClose={() => setActiveDrawer(null)}
        keys={vaultKeys}
        onAddKey={handleAddVaultKey}
        onDeleteKey={handleDeleteVaultKey}
        notes={vaultNotes}
        onAddNote={handleAddVaultNote}
        onDeleteNote={handleDeleteVaultNote}
        memories={vaultMemories}
        onAddMemory={handleAddVaultMemory}
        onDeleteMemory={handleDeleteVaultMemory}
        onLaunchGame={(cmd) => ultimateBrain(cmd)}
      />

      <PluginStoreDrawer
        isOpen={activeDrawer === 'store'}
        onClose={() => setActiveDrawer(null)}
        allFeatures={allFeatures}
        onRunPlugin={(cmd, cat) => ultimateBrain(cmd)}
      />

      <FactoryDrawer
        isOpen={activeDrawer === 'factory'}
        onClose={() => setActiveDrawer(null)}
        onBuildCustom={(prompt, cat, customCode) => launchDynamicPlugin(prompt, cat, customCode)}
      />

      <AnalyticsDrawer
        isOpen={activeDrawer === 'analytics'}
        onClose={() => setActiveDrawer(null)}
        stats={executionStats}
        totalExecutions={totalExecutions}
        recentRuns={recentRuns}
      />

      {/* RAW HTML CODE INSPECTOR MODAL */}
      {showCodeModal && previewRawHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#030906] border-2 border-[#00f5a0] rounded-2xl shadow-[0_0_35px_rgba(0,245,160,0.3)] flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between p-3.5 border-b border-[#00f5a0]/30 bg-[#00140c]">
              <span className="text-xs font-mono font-bold text-[#00f5a0] flex items-center gap-2">
                <Code className="w-4 h-4" /> SYNTHESIZED HTML & JAVASCRIPT CODE
              </span>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <pre className="flex-1 overflow-y-auto p-4 bg-black text-[#a1ffdb] text-xs font-mono select-all">
              {previewRawHtml}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
