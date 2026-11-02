// Voice Engine supporting SpeechRecognition (hi-IN) and TTS (hi-IN / en-IN) with Web Audio sound synthesis

class VoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isListening: boolean = false;
  private audioCtx: AudioContext | null = null;
  public lang: string = 'hi-IN'; // Default hi-IN as requested
  public voiceVolume: number = 1.0;
  public voiceRate: number = 1.0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis || null;
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.lang;
      }
    }
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public playSound(type: 'beep' | 'reactor' | 'success' | 'alert' | 'click') {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'reactor') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'alert') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(200, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch (e) {
      // Audio autoplay may require user gesture
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) return;
    try {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.lang;
      utterance.rate = this.voiceRate;
      utterance.pitch = 1.0;
      utterance.volume = this.voiceVolume;

      // Find appropriate Hindi/Indian English voice if available
      const voices = this.synth.getVoices();
      const matched = voices.find(v => 
        (this.lang.startsWith('hi') && v.lang.includes('hi')) ||
        (this.lang.includes('IN') && v.lang.includes('IN'))
      ) || voices.find(v => v.lang.includes('en'));

      if (matched) {
        utterance.voice = matched;
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.warn("TTS error:", e);
    }
  }

  public startListening(
    onResult: (text: string) => void,
    onError: (err: any) => void,
    onListeningChange: (listening: boolean) => void
  ) {
    if (!this.recognition) {
      onError(new Error("Speech recognition not supported in this browser environment."));
      return;
    }

    try {
      this.recognition.lang = this.lang;
      this.recognition.onstart = () => {
        this.isListening = true;
        this.playSound('beep');
        onListeningChange(true);
      };

      this.recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        this.playSound('success');
        onResult(text);
      };

      this.recognition.onerror = (e: any) => {
        this.isListening = false;
        onListeningChange(false);
        onError(e);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onListeningChange(false);
      };

      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      onListeningChange(false);
      onError(e);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public toggleListening(
    onResult: (text: string) => void,
    onError: (err: any) => void,
    onListeningChange: (listening: boolean) => void
  ) {
    if (this.isListening) {
      this.stopListening();
      onListeningChange(false);
    } else {
      this.startListening(onResult, onError, onListeningChange);
    }
  }
}

export const voiceEngine = new VoiceEngine();
