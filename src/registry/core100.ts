import { FeatureItem } from '../types';

export const CORE_100: FeatureItem[] = [
  // 1-10: API & Network Subsystems
  { id: 1, name: "API Check", cmd: "api check", action: "checkAPI", cat: "API", desc: "Diagnostic ping to API endpoints and connection health" },
  { id: 2, name: "API Create", cmd: "api create", action: "createAPI", cat: "API", desc: "Instantiate dynamic REST mock endpoint" },
  { id: 3, name: "API Benchmark", cmd: "api benchmark", action: "benchmarkAPI", cat: "API", desc: "Execute latency and throughput stress test" },
  { id: 4, name: "API Health", cmd: "api health", action: "healthAPI", cat: "API", desc: "Verify status codes and response uptime" },
  { id: 5, name: "API Webhook Tester", cmd: "api webhook test", action: "webhookAPI", cat: "API", desc: "Send simulated event payloads to webhook" },
  { id: 6, name: "API JSON Formatter", cmd: "api json format", action: "jsonFormatAPI", cat: "API", desc: "Beautify and validate JSON data structures" },
  { id: 7, name: "API Rate Limiter Sim", cmd: "api rate limit", action: "rateLimitAPI", cat: "API", desc: "Calculate token bucket allowance & throttle" },
  { id: 8, name: "API IP Whitelist", cmd: "api ip whitelist", action: "ipWhitelistAPI", cat: "API", desc: "Inspect and verify allowed host addresses" },
  { id: 9, name: "API Headers Inspect", cmd: "api headers inspect", action: "headersAPI", cat: "API", desc: "Audit CORS, auth headers and security tokens" },
  { id: 10, name: "API Export CSV", cmd: "api export csv", action: "exportCsvAPI", cat: "API", desc: "Convert response collection into downloadable CSV" },

  // 11-20: Stark Security & System
  { id: 11, name: "Stark Diagnostic", cmd: "system diagnose", action: "starkDiagnose", cat: "Stark Advanced", desc: "Full hardware & neural subsystem scan" },
  { id: 12, name: "RAM Booster", cmd: "ram booster", action: "ramBooster", cat: "Stark Advanced", desc: "Purge background cache and allocate RAM" },
  { id: 13, name: "Battery Saver Protocol", cmd: "battery saver", action: "batterySaver", cat: "Stark Advanced", desc: "Calibrate power consumption & dark mode" },
  { id: 14, name: "CPU Monitor", cmd: "cpu monitor", action: "cpuMonitor", cat: "Stark Advanced", desc: "Real-time simulated multi-core telemetry" },
  { id: 15, name: "Storage Cleaner", cmd: "storage cleaner", action: "storageCleaner", cat: "Stark Advanced", desc: "Analyze temporary cache and index blobs" },
  { id: 16, name: "Firewall Audit", cmd: "firewall audit", action: "firewallAudit", cat: "Stark Advanced", desc: "Deep packet inspection and breach audit" },
  { id: 17, name: "Threat Neutralizer", cmd: "threat scan", action: "threatScan", cat: "Stark Advanced", desc: "Zero-day vulnerability heuristics check" },
  { id: 18, name: "Reactor Overclock", cmd: "reactor overclock", action: "reactorOverclock", cat: "Stark Advanced", desc: "Boost Arc Reactor frequency to maximum" },
  { id: 19, name: "Hologram Calibrate", cmd: "hologram calibrate", action: "hologramCalibrate", cat: "Stark Advanced", desc: "Align optical projector matrices and laser grid" },
  { id: 20, name: "Vault Decryption", cmd: "vault decrypt", action: "vaultDecrypt", cat: "Stark Advanced", desc: "Unlock Stark secure enclave keys" },

  // 21-30: AI Tools
  { id: 21, name: "AI Vision Prompt", cmd: "ai vision", action: "aiVision", cat: "AI Tools", desc: "Interactive prompt analyzer for computer vision" },
  { id: 22, name: "AI Code Refactor", cmd: "ai refactor", action: "aiRefactor", cat: "AI Tools", desc: "Optimize TypeScript and modern code snippets" },
  { id: 23, name: "AI Hindi-English Translator", cmd: "translate hindi", action: "aiTranslate", cat: "AI Tools", desc: "Translate Hindi to English and reverse with speech" },
  { id: 24, name: "AI Text Summarizer", cmd: "ai summarize", action: "aiSummarize", cat: "AI Tools", desc: "Condense long articles and complex briefs" },
  { id: 25, name: "AI Paraphraser", cmd: "ai paraphrase", action: "aiParaphrase", cat: "AI Tools", desc: "Rewrite text in 5 distinct professional tones" },
  { id: 26, name: "AI Prompt Polisher", cmd: "ai prompt polish", action: "aiPromptPolish", cat: "AI Tools", desc: "Elevate raw prompts into high-precision directives" },
  { id: 27, name: "AI Sentiment Radar", cmd: "ai sentiment", action: "aiSentiment", cat: "AI Tools", desc: "Analyze emotional polarity and tone in phrases" },
  { id: 28, name: "AI Regex Forge", cmd: "ai regex", action: "aiRegex", cat: "AI Tools", desc: "Generate validated Regular Expressions" },
  { id: 29, name: "AI SQL Generator", cmd: "ai sql", action: "aiSql", cat: "AI Tools", desc: "Convert plain English to optimized SQL query" },
  { id: 30, name: "AI Math Solver", cmd: "ai math", action: "aiMath", cat: "AI Tools", desc: "Step-by-step calculus and algebraic solutions" },

  // 31-40: Games
  { id: 31, name: "Cyber Racer 2099", cmd: "cyber racer", action: "gameRacer", cat: "Games", desc: "Playable retro neon car racing canvas game" },
  { id: 32, name: "Cyber Chess Engine", cmd: "chess game", action: "gameChess", cat: "Games", desc: "Interactive chessboard with move logic & AI player" },
  { id: 33, name: "Retro Pong Neon", cmd: "pong game", action: "gamePong", cat: "Games", desc: "Arcade 2-player or AI paddle showdown" },
  { id: 34, name: "Matrix Snake 2099", cmd: "snake game", action: "gameSnake", cat: "Games", desc: "Futuristic snake arcade with holographic fruit" },
  { id: 35, name: "Space Invaders 3D", cmd: "space defense", action: "gameSpace", cat: "Games", desc: "Defend Earth against orbital invaders canvas" },
  { id: 36, name: "Stark TicTacToe", cmd: "tictactoe game", action: "gameTicTacToe", cat: "Games", desc: "Unbeatable Stark AI Tic-Tac-Toe arena" },
  { id: 37, name: "Speed Clicker Reflex", cmd: "reaction game", action: "gameReaction", cat: "Games", desc: "Millisecond reflex test with leaderboard score" },
  { id: 38, name: "Memory Hologram", cmd: "memory game", action: "gameMemory", cat: "Games", desc: "Cyber symbol sequence memory matching game" },
  { id: 39, name: "Quantum Guess 1-100", cmd: "guess game", action: "gameGuess", cat: "Games", desc: "Binary search interactive guessing game" },
  { id: 40, name: "Cyber Cricket Sim", cmd: "cricket game", action: "gameCricket", cat: "Games", desc: "Over-by-over tactical cricket simulator" },

  // 41-50: Phone & Hardware Simulators
  { id: 41, name: "Torch SOS Strobe", cmd: "torch sos blink", action: "torchSOS", cat: "Phone Hardware", desc: "Ultra-bright white strobe with SOS Morse code" },
  { id: 42, name: "Haptic Morse Vibrate", cmd: "vibrate morse", action: "vibrateMorse", cat: "Phone Hardware", desc: "Hardware vibration API with custom vibration pulses" },
  { id: 43, name: "Screen Brightness HUD", cmd: "brightness auto", action: "screenBrightness", cat: "Phone Hardware", desc: "Dynamic screen lux controller with dark-shift" },
  { id: 44, name: "Compass Heading HUD", cmd: "compass hud", action: "compassHUD", cat: "Phone Hardware", desc: "Digital magnetic orientation sensor HUD" },
  { id: 45, name: "Accelerometer Gauge", cmd: "accelerometer test", action: "accelerometerGauge", cat: "Phone Hardware", desc: "3-axis tilt and gravity vector visualization" },
  { id: 46, name: "Audio Decibel Meter", cmd: "decibel meter", action: "audioDecibel", cat: "Phone Hardware", desc: "Microphone spectral decibel visualizer" },
  { id: 47, name: "Camera Cyber HUD", cmd: "camera filter", action: "cameraFilter", cat: "Phone Hardware", desc: "Live camera stream with Stark HUD overlay" },
  { id: 48, name: "Battery Thermal Check", cmd: "battery health", action: "batteryThermal", cat: "Phone Hardware", desc: "Battery API voltage, temperature & cycles telemetry" },
  { id: 49, name: "Fullscreen Immersion", cmd: "fullscreen mode", action: "fullscreenMode", cat: "Phone Hardware", desc: "Toggle immersive cinema full-viewport display" },
  { id: 50, name: "Sound Synthesizer", cmd: "sound synth", action: "soundSynth", cat: "Phone Hardware", desc: "Web Audio oscillator with pitch and reverb controls" },

  // 51-60: Communication
  { id: 51, name: "WhatsApp Direct", cmd: "whatsapp direct", action: "whatsappDirect", cat: "Communication", desc: "Instant WhatsApp link generator with pre-filled message" },
  { id: 52, name: "Bulk Email Dispatch", cmd: "email bulk", action: "emailBulk", cat: "Communication", desc: "Generate professional mailto triggers & campaign templates" },
  { id: 53, name: "SMS Broadcast Prep", cmd: "sms schedule", action: "smsSchedule", cat: "Communication", desc: "Emergency SMS payload composer" },
  { id: 54, name: "Discord Webhook Ping", cmd: "discord webhook", action: "discordPing", cat: "Communication", desc: "Format rich embed cards for Discord webhooks" },
  { id: 55, name: "Telegram Bot Linker", cmd: "telegram bot", action: "telegramLink", cat: "Communication", desc: "Format inline query and telegram direct links" },
  { id: 56, name: "Contact VCF Card", cmd: "contact card", action: "contactVCF", cat: "Communication", desc: "Generate downloadable digital vCard 3.0" },
  { id: 57, name: "Emergency SOS Alert", cmd: "emergency sos", action: "emergencySOS", cat: "Communication", desc: "One-click emergency broadcast coordinate transmitter" },
  { id: 58, name: "Quick Tweet Composer", cmd: "tweet composer", action: "tweetComposer", cat: "Communication", desc: "Draft high-impact viral X/Twitter threads" },
  { id: 59, name: "QR Code Generator", cmd: "qr generate", action: "qrGenerate", cat: "Communication", desc: "High-resolution scannable QR code generator" },
  { id: 60, name: "Meeting Link Forge", cmd: "meeting link", action: "meetingLink", cat: "Communication", desc: "Generate instant Google Meet & Zoom room invites" },

  // 61-70: Productivity & Utilities
  { id: 61, name: "Scientific Calculator", cmd: "calculator scientific", action: "calcScientific", cat: "Apps", desc: "Trigonometric, logarithmic & exponential computational engine" },
  { id: 62, name: "Pomodoro Focus Matrix", cmd: "pomodoro timer", action: "pomodoroTimer", cat: "Utilities", desc: "25/5 interval productivity clock with audio cues" },
  { id: 63, name: "Precision Stopwatch", cmd: "stopwatch timer", action: "stopwatchTimer", cat: "Utilities", desc: "Millisecond lap timer with split telemetry" },
  { id: 64, name: "World Timezones HUD", cmd: "world clock", action: "worldClock", cat: "Utilities", desc: "Real-time clocks for Tokyo, London, NYC, Delhi, Dubai" },
  { id: 65, name: "Unit Converter 100", cmd: "unit convert", action: "unitConvert", cat: "Utilities", desc: "Convert length, mass, energy, digital bytes, pressure" },
  { id: 66, name: "Base64 Cyber Encoder", cmd: "base64 convert", action: "base64Convert", cat: "Utilities", desc: "Encode and decode binary string data" },
  { id: 67, name: "Markdown Studio", cmd: "markdown editor", action: "markdownEditor", cat: "Apps", desc: "Split-screen markdown renderer with HTML export" },
  { id: 68, name: "Password Vault Gen", cmd: "password vault", action: "passwordVault", cat: "Utilities", desc: "High-entropy cryptographic password generator" },
  { id: 69, name: "Color Palette Forge", cmd: "color palette", action: "colorPalette", cat: "Utilities", desc: "Cyberpunk, neon and Stark UI color hex generator" },
  { id: 70, name: "UUIDv4 Generator", cmd: "uuid generate", action: "uuidGenerate", cat: "Utilities", desc: "Cryptographically random GUIDs in bulk batches" },

  // 71-80: Web3 & Crypto
  { id: 71, name: "BTC Real-Time Ticker", cmd: "btc price", action: "cryptoBTC", cat: "Web3 Crypto", desc: "Live Bitcoin price in INR and USD with 24h change" },
  { id: 72, name: "ETH Real-Time Ticker", cmd: "eth price", action: "cryptoETH", cat: "Web3 Crypto", desc: "Live Ethereum price, gas estimates & market cap" },
  { id: 73, name: "SOL Real-Time Ticker", cmd: "sol price", action: "cryptoSOL", cat: "Web3 Crypto", desc: "Solana high-speed network live pricing" },
  { id: 74, name: "Crypto Fear & Greed", cmd: "crypto fear greed", action: "cryptoSentiment", cat: "Web3 Crypto", desc: "Real-time market sentiment index meter" },
  { id: 75, name: "Paper Wallet Generator", cmd: "wallet create", action: "walletCreate", cat: "Web3 Crypto", desc: "Generate offline public/private mock keypairs" },
  { id: 76, name: "Gas Fee Tracker", cmd: "gas fee tracker", action: "gasFeeTracker", cat: "Web3 Crypto", desc: "Gwei breakdown for slow, normal, rapid gas fees" },
  { id: 77, name: "Token Swap Simulator", cmd: "token swap", action: "tokenSwap", cat: "Web3 Crypto", desc: "Slippage and liquidity pool math simulator" },
  { id: 78, name: "SHA-256 Hash Calc", cmd: "hash sha256", action: "hashCalc", cat: "Web3 Crypto", desc: "Compute cryptographic hashes for any string" },
  { id: 79, name: "NFT Metadata Inspector", cmd: "nft view", action: "nftInspector", cat: "Web3 Crypto", desc: "Visualize JSON attributes, rarity and image URI" },
  { id: 80, name: "Satoshi Converter", cmd: "satoshi convert", action: "satoshiConvert", cat: "Web3 Crypto", desc: "Convert BTC, mBTC, Bits, and Satoshis" },

  // 81-90: Entertainment & Humour
  { id: 81, name: "JARVIS Roast Me", cmd: "roast me", action: "funRoast", cat: "Entertainment", desc: "Savage witty Stark AI roast generated on the fly" },
  { id: 82, name: "Cyber Motivation", cmd: "motivate me", action: "funMotivation", cat: "Entertainment", desc: "Tony Stark level relentless drive & vision quote" },
  { id: 83, name: "Cyber Riddle", cmd: "riddle me", action: "funRiddle", cat: "Entertainment", desc: "Cryptic logic puzzle with interactive reveal" },
  { id: 84, name: "Cyber Horoscope", cmd: "horoscope today", action: "funHoroscope", cat: "Entertainment", desc: "Quantum constellation alignment forecast" },
  { id: 85, name: "Love Calculator 2099", cmd: "love calculator", action: "funLoveCalc", cat: "Entertainment", desc: "Quantum heart compatibility algorithm" },
  { id: 86, name: "Quantum 8-Ball", cmd: "future predict", action: "funPredict", cat: "Entertainment", desc: "Cosmic oracle answer for yes/no questions" },
  { id: 87, name: "Nerd Dad Jokes", cmd: "tell joke", action: "funJoke", cat: "Entertainment", desc: "Computer science & engineering dad jokes" },
  { id: 88, name: "ASCII Art Forge", cmd: "ascii art", action: "funASCII", cat: "Entertainment", desc: "Render text into glowing ASCII banner" },
  { id: 89, name: "Matrix Rain Screen", cmd: "matrix rain", action: "funMatrixRain", cat: "Entertainment", desc: "Digital green code rain canvas visualization" },
  { id: 90, name: "Pickup Lines 2099", cmd: "pickup line", action: "funPickup", cat: "Entertainment", desc: "Tech-savvy and charming one-liners" },

  // 91-100: Business & Creator
  { id: 91, name: "Invoice Maker 2099", cmd: "invoice maker", action: "bizInvoice", cat: "Business", desc: "Generate professional client billing invoice with print" },
  { id: 92, name: "Resume Bullet Forge", cmd: "resume maker", action: "bizResume", cat: "Business", desc: "Turn duties into high-impact metric achievement bullets" },
  { id: 93, name: "Cyber Logo Studio", cmd: "logo maker", action: "bizLogo", cat: "Business", desc: "Vector SVG monogram and tech brand badge generator" },
  { id: 94, name: "Business Card Preview", cmd: "business card maker", action: "bizCard", cat: "Business", desc: "Holographic double-sided card designer" },
  { id: 95, name: "Startup Pitch Forge", cmd: "startup pitch", action: "bizPitch", cat: "Business", desc: "Y-Combinator style 1-sentence value proposition" },
  { id: 96, name: "Pricing Table Builder", cmd: "pricing table", action: "bizPricing", cat: "Business", desc: "Compare Free, Pro, Enterprise tiers with CTA" },
  { id: 97, name: "Terms & Privacy Gen", cmd: "terms privacy", action: "bizTerms", cat: "Business", desc: "Standard SaaS terms of service outline" },
  { id: 98, name: "Email Newsletter Forge", cmd: "newsletter gen", action: "bizNewsletter", cat: "Business", desc: "Structured newsletter outline with hook & call-to-action" },
  { id: 99, name: "Social Bio Generator", cmd: "bio maker", action: "bizBio", cat: "Business", desc: "Create killer LinkedIn, X, and Instagram bios" },
  { id: 100, name: "Poster & Banner Studio", cmd: "poster maker", action: "bizPoster", cat: "Business", desc: "High-contrast promotional visual banner" }
];
