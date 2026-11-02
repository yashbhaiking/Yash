import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { VaultKey, VaultNote, VaultMemory } from './types';

export const firebaseConfig = {
  apiKey: "AIzaSyCjqpX1UZRBxo4tGPG1dFbyL-hieWrW6ho",
  authDomain: "deled-87163.firebaseapp.com",
  projectId: "deled-87163",
  storageBucket: "deled-87163.firebasestorage.app",
  messagingSenderId: "695526980310",
  appId: "1:695526980310:web:3bdb32c129ba7d366ae777"
};

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Save plugin to Firestore
export async function savePluginToFirestore(pluginData: {
  prompt: string;
  cat: string;
  html: string;
  id: number;
}) {
  try {
    const docRef = await addDoc(collection(db, "adarsh_plugins_1000"), {
      prompt: pluginData.prompt,
      cat: pluginData.cat,
      html: pluginData.html.slice(0, 5000), // Protect against size quotas
      createdAt: serverTimestamp(),
      id: pluginData.id
    });
    // Also mirror to localStorage
    mirrorPluginLocally(pluginData);
    return { success: true, docId: docRef.id };
  } catch (err) {
    console.warn("Firestore sync fallback to localStorage:", err);
    mirrorPluginLocally(pluginData);
    return { success: false, fallback: true, error: (err as Error).message };
  }
}

function mirrorPluginLocally(pluginData: { prompt: string; cat: string; html: string; id: number }) {
  try {
    const existing = JSON.parse(localStorage.getItem('adarsh_local_plugins') || '[]');
    existing.unshift({ ...pluginData, createdAt: new Date().toISOString() });
    localStorage.setItem('adarsh_local_plugins', JSON.stringify(existing.slice(0, 100)));
  } catch (e) {
    console.warn("Local storage write error:", e);
  }
}

export async function fetchRemotePlugins(): Promise<any[]> {
  try {
    const q = query(collection(db, "adarsh_plugins_1000"), orderBy("createdAt", "desc"), limit(50));
    const snap = await getDocs(q);
    const list: any[] = [];
    snap.forEach((d) => {
      list.push({ docId: d.id, ...d.data() });
    });
    return list;
  } catch (err) {
    console.warn("Cannot fetch remote plugins, using localStorage backup", err);
    return JSON.parse(localStorage.getItem('adarsh_local_plugins') || '[]');
  }
}

// Vault Persistence (Keys, Notes, Memories)
export async function saveVaultKey(keyData: Omit<VaultKey, 'id'>): Promise<VaultKey> {
  const item: VaultKey = {
    ...keyData,
    id: 'key_' + Date.now()
  };
  try {
    await addDoc(collection(db, "adarsh_apikeys_1000"), {
      ...item,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.warn("Firestore key save fallback:", e);
  }
  // Store locally
  const current = getLocalVaultKeys();
  localStorage.setItem('adarsh_vault_keys', JSON.stringify([item, ...current]));
  return item;
}

export function getLocalVaultKeys(): VaultKey[] {
  try {
    const raw = localStorage.getItem('adarsh_vault_keys');
    if (!raw) {
      const defaultKeys: VaultKey[] = [
        { id: 'key_1', name: 'Gemini AI Studio', key: 'AIzaSy...PROD_ACTIVE', service: 'Google Gemini', dateAdded: 'Today' },
        { id: 'key_2', name: 'OpenAI Stark Link', key: 'sk-stark-...VAULT_KEY', service: 'OpenAI', dateAdded: 'Today' },
        { id: 'key_3', name: 'CoinGecko Live API', key: 'cg-public-free-tier', service: 'Crypto Data', dateAdded: 'Today' },
      ];
      localStorage.setItem('adarsh_vault_keys', JSON.stringify(defaultKeys));
      return defaultKeys;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function deleteVaultKey(id: string) {
  const current = getLocalVaultKeys().filter(k => k.id !== id);
  localStorage.setItem('adarsh_vault_keys', JSON.stringify(current));
}

// Vault Notes
export function getLocalVaultNotes(): VaultNote[] {
  try {
    const raw = localStorage.getItem('adarsh_vault_notes');
    if (!raw) {
      const defaultNotes: VaultNote[] = [
        { id: 'note_1', title: 'JARVIS 1000 Operational Brief', content: 'Universe edition deployed with 100 Core + 900 Dynamic plugin capabilities. Neural link stable.', timestamp: new Date().toLocaleTimeString() },
        { id: 'note_2', title: 'Adarsh Master Directive', content: 'All subroutines authorized by @free_maker93. Voice recognition locked to Hindi & English.', timestamp: new Date().toLocaleTimeString() }
      ];
      localStorage.setItem('adarsh_vault_notes', JSON.stringify(defaultNotes));
      return defaultNotes;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveVaultNote(title: string, content: string): Promise<VaultNote> {
  const item: VaultNote = {
    id: 'note_' + Date.now(),
    title,
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  try {
    await addDoc(collection(db, "adarsh_notes_1000"), {
      ...item,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.warn("Firestore notes save fallback:", e);
  }
  const current = getLocalVaultNotes();
  localStorage.setItem('adarsh_vault_notes', JSON.stringify([item, ...current]));
  return item;
}

export function deleteVaultNote(id: string) {
  const current = getLocalVaultNotes().filter(n => n.id !== id);
  localStorage.setItem('adarsh_vault_notes', JSON.stringify(current));
}

// Vault Memories
export function getLocalVaultMemories(): VaultMemory[] {
  try {
    const raw = localStorage.getItem('adarsh_vault_memories');
    if (!raw) {
      const defaultMemories: VaultMemory[] = [
        { id: 'mem_1', key: 'Creator Identity', value: '@free_maker93 (Adarsh Sir)', timestamp: 'Universal Protocol' },
        { id: 'mem_2', key: 'System Title', value: 'ADARSH JARVIS 1000 UNIVERSE EDITION', timestamp: 'Permanent Core' },
        { id: 'mem_3', key: 'Language Preference', value: 'Hindi-English (Hinglish / hi-IN)', timestamp: 'Voice Kernel' },
        { id: 'mem_4', key: 'Total Features Armed', value: '1,000 Verified (100 Core + 900 Dynamic)', timestamp: 'Registry Init' },
      ];
      localStorage.setItem('adarsh_vault_memories', JSON.stringify(defaultMemories));
      return defaultMemories;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveVaultMemory(key: string, value: string): Promise<VaultMemory> {
  const item: VaultMemory = {
    id: 'mem_' + Date.now(),
    key,
    value,
    timestamp: new Date().toLocaleDateString()
  };
  try {
    await addDoc(collection(db, "adarsh_memories_1000"), {
      ...item,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.warn("Firestore memory save fallback:", e);
  }
  const current = getLocalVaultMemories();
  localStorage.setItem('adarsh_vault_memories', JSON.stringify([item, ...current]));
  return item;
}

export function deleteVaultMemory(id: string) {
  const current = getLocalVaultMemories().filter(m => m.id !== id);
  localStorage.setItem('adarsh_vault_memories', JSON.stringify(current));
}
