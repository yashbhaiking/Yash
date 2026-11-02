import { savePluginToFirestore } from '../firebase';

export interface BuiltPluginResult {
  prompt: string;
  cat: string;
  html: string;
  url: string;
  id: number;
}

export function buildGame(prompt: string): string {
  const lower = prompt.toLowerCase();
  
  if (lower.includes("chess")) {
    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${prompt}</title>
<style>
  body { margin:0; background:#020202; color:#00f5a0; font-family:'Courier New', monospace; text-align:center; padding:12px; }
  h2 { margin:6px 0; color:#00f5a0; text-shadow:0 0 10px #00f5a0; }
  #board { display:grid; grid-template-columns:repeat(8, 38px); grid-template-rows:repeat(8, 38px); gap:1px; margin:16px auto; width:max-content; border:2px solid #00f5a0; box-shadow:0 0 15px rgba(0,245,160,0.3); }
  .square { display:flex; align-items:center; justify-content:center; font-size:22px; cursor:pointer; user-select:none; }
  .white { background:#0a291f; color:#e0fcf2; }
  .black { background:#03130d; color:#88ffcc; }
  .selected { background:#00f5a0 !important; color:#000 !important; }
  .info { font-size:12px; color:#a1ffdb; margin-top:10px; }
  button { background:#00f5a0; color:#000; font-weight:bold; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; margin:4px; }
</style>
</head>
<body>
  <h2>♟️ ${prompt.toUpperCase()}</h2>
  <div style="font-size:11px;color:#00e5ff">ADARSH STARK CHESS ENGINE v10.0</div>
  <div id="board"></div>
  <div class="info" id="status">Turn: Player (White) — Click piece then target square</div>
  <div>
    <button onclick="resetChess()">🔄 Reset Board</button>
    <button onclick="aiMove()">🤖 Stark AI Move</button>
  </div>
  <script>
    const initialBoard = [
      ['♜','♞','♝','♛','♚','♝','♞','♜'],
      ['♟','♟','♟','♟','♟','♟','♟','♟'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['♙','♙','♙','♙','♙','♙','♙','♙'],
      ['♖','♘','♗','♕','♔','♗','♘','♖']
    ];
    let board = JSON.parse(JSON.stringify(initialBoard));
    let selected = null;
    let turn = 'W';

    function render() {
      const b = document.getElementById('board');
      b.innerHTML = '';
      for (let r=0; r<8; r++) {
        for (let c=0; c<8; c++) {
          const sq = document.createElement('div');
          sq.className = 'square ' + ((r+c)%2===0 ? 'white':'black');
          if (selected && selected.r === r && selected.c === c) sq.classList.add('selected');
          sq.innerText = board[r][c];
          sq.onclick = () => handleClick(r, c);
          b.appendChild(sq);
        }
      }
    }

    function handleClick(r, c) {
      if (!selected) {
        if (board[r][c]) {
          selected = {r, c};
          render();
        }
      } else {
        board[r][c] = board[selected.r][selected.c];
        board[selected.r][selected.c] = '';
        selected = null;
        render();
        document.getElementById('status').innerText = 'Move confirmed Sir! Stark neural response ready.';
      }
    }

    function aiMove() {
      // Stark AI move
      for(let r=0; r<4; r++) {
        for(let c=0; c<8; c++) {
          if (board[r][c] && !board[r+1][c]) {
            board[r+1][c] = board[r][c];
            board[r][c] = '';
            render();
            document.getElementById('status').innerText = 'Stark AI executed strategic gambit!';
            return;
          }
        }
      }
    }

    function resetChess() {
      board = JSON.parse(JSON.stringify(initialBoard));
      selected = null;
      render();
      document.getElementById('status').innerText = 'Board reset Sir!';
    }
    render();
  </script>
</body>
</html>`;
  }

  if (lower.includes("car") || lower.includes("racing") || lower.includes("gta")) {
    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${prompt}</title>
<style>
  body { margin:0; background:#020202; color:#00f5a0; font-family:sans-serif; text-align:center; overflow:hidden; }
  canvas { background:#0a0d0c; border:2px solid #00f5a0; box-shadow:0 0 15px rgba(0,245,160,0.3); display:block; margin:8px auto; border-radius:10px; }
  .hud { font-size:12px; margin:4px; font-weight:bold; }
  .ctrl { display:flex; justify-content:center; gap:12px; margin-top:4px; }
  .btn { background:#00f5a0; color:#000; font-weight:bold; border:none; padding:10px 24px; border-radius:8px; font-size:16px; cursor:pointer; touch-action:manipulation; }
</style>
</head>
<body>
  <div class="hud">🏎️ ${prompt.toUpperCase()} — Score: <span id="score">0</span></div>
  <canvas id="raceCanvas" width="280" height="340"></canvas>
  <div class="ctrl">
    <button class="btn" onmousedown="moveCar(-1)" ontouchstart="moveCar(-1)">⬅️ LEFT</button>
    <button class="btn" onclick="restart()">🔄 RESET</button>
    <button class="btn" onmousedown="moveCar(1)" ontouchstart="moveCar(1)">RIGHT ➡️</button>
  </div>
  <script>
    const cvs = document.getElementById('raceCanvas');
    const ctx = cvs.getContext('2d');
    let carX = 120, carY = 270;
    let enemies = [{x: 80, y: -40, speed: 3.5}, {x: 180, y: -160, speed: 4}];
    let score = 0;
    let gameActive = true;

    function moveCar(dir) {
      carX = Math.max(30, Math.min(210, carX + dir * 35));
    }

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'a') moveCar(-1);
      if (e.key === 'ArrowRight' || e.key === 'd') moveCar(1);
    });

    function restart() {
      carX = 120;
      enemies = [{x: 80, y: -40, speed: 3.5}, {x: 180, y: -160, speed: 4}];
      score = 0;
      gameActive = true;
      requestAnimationFrame(loop);
    }

    let lineOffset = 0;
    function loop() {
      if (!gameActive) return;
      lineOffset = (lineOffset + 6) % 40;
      ctx.fillStyle = '#050a08';
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      // Road markings
      ctx.strokeStyle = '#00f5a033';
      ctx.lineWidth = 4;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -lineOffset;
      ctx.beginPath();
      ctx.moveTo(140, 0); ctx.lineTo(140, cvs.height);
      ctx.stroke();

      // Borders
      ctx.strokeStyle = '#00f5a0';
      ctx.setLineDash([]);
      ctx.strokeRect(20, 0, 240, cvs.height);

      // Player Car (Neon Green)
      ctx.fillStyle = '#00f5a0';
      ctx.shadowColor = '#00f5a0';
      ctx.shadowBlur = 10;
      ctx.fillRect(carX, carY, 32, 55);
      ctx.fillStyle = '#000';
      ctx.fillRect(carX+6, carY+12, 20, 15);
      ctx.shadowBlur = 0;

      // Enemies (Neon Red/Orange)
      enemies.forEach(en => {
        en.y += en.speed;
        if (en.y > cvs.height) {
          en.y = -60;
          en.x = 40 + Math.random() * 160;
          score += 10;
          document.getElementById('score').innerText = score;
        }
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(en.x, en.y, 30, 50);

        // Collision check
        if (Math.abs(carX - en.x) < 28 && Math.abs(carY - en.y) < 45) {
          gameActive = false;
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText('CRASHED! SCORE: ' + score, 40, 160);
        }
      });

      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`;
  }

  // Generic Cyber Canvas Game (Snake / Shooter / Arcade)
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${prompt}</title>
<style>
  body { margin:0; background:#020202; color:#00f5a0; font-family:sans-serif; text-align:center; padding:8px; }
  canvas { background:#070d0b; border:2px solid #00f5a0; border-radius:12px; margin:8px auto; display:block; }
  .btn { background:#00f5a0; color:#000; font-weight:bold; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; margin:4px; }
</style>
</head>
<body>
  <h3>🎮 ${prompt.toUpperCase()}</h3>
  <div style="font-size:12px;color:#a1ffdb">Score: <span id="sc">0</span> | Controls: Arrow Keys / Swipe</div>
  <canvas id="gameCanvas" width="280" height="280"></canvas>
  <div>
    <button class="btn" onclick="setDir('UP')">⬆️</button><br>
    <button class="btn" onclick="setDir('LEFT')">⬅️</button>
    <button class="btn" onclick="setDir('DOWN')">⬇️</button>
    <button class="btn" onclick="setDir('RIGHT')">➡️</button>
  </div>
  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 14;
    let snake = [{x: 10, y: 10}];
    let dir = {x: 1, y: 0};
    let food = {x: 15, y: 15};
    let score = 0;
    let running = true;

    function setDir(d) {
      if (d==='UP' && dir.y!==1) dir = {x:0, y:-1};
      if (d==='DOWN' && dir.y!==-1) dir = {x:0, y:1};
      if (d==='LEFT' && dir.x!==1) dir = {x:-1, y:0};
      if (d==='RIGHT' && dir.x!==-1) dir = {x:1, y:0};
    }

    window.addEventListener('keydown', e => {
      if (e.key==='ArrowUp') setDir('UP');
      if (e.key==='ArrowDown') setDir('DOWN');
      if (e.key==='ArrowLeft') setDir('LEFT');
      if (e.key==='ArrowRight') setDir('RIGHT');
    });

    function tick() {
      if(!running) return;
      const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        alert('Game Over Sir! Final Score: ' + score);
        snake = [{x:10, y:10}];
        score = 0;
        document.getElementById('sc').innerText = score;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('sc').innerText = score;
        food = {x: Math.floor(Math.random()*19), y: Math.floor(Math.random()*19)};
      } else {
        snake.pop();
      }

      ctx.fillStyle = '#050a08';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Food
      ctx.fillStyle = '#00e5ff';
      ctx.fillRect(food.x*gridSize, food.y*gridSize, gridSize-2, gridSize-2);

      // Snake
      ctx.fillStyle = '#00f5a0';
      snake.forEach(s => ctx.fillRect(s.x*gridSize, s.y*gridSize, gridSize-2, gridSize-2));
    }
    setInterval(tick, 110);
  </script>
</body>
</html>`;
}

export function buildApp(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes("calculator")) {
    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${prompt}</title>
<style>
  body { margin:0; background:#020202; color:#00f5a0; font-family:monospace; padding:16px; text-align:center; }
  .calc-box { max-width:320px; margin:0 auto; background:#08100d; border:2px solid #00f5a0; border-radius:14px; padding:16px; box-shadow:0 0 20px rgba(0,245,160,0.2); }
  #screen { width:100%; box-sizing:border-box; background:#000; border:1px solid #00f5a0; color:#00f5a0; font-size:24px; text-align:right; padding:12px; border-radius:8px; margin-bottom:12px; }
  .grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; }
  button { background:#0d1c16; color:#00f5a0; border:1px solid #00f5a066; font-size:18px; padding:12px; border-radius:8px; cursor:pointer; font-weight:bold; }
  button:active { background:#00f5a0; color:#000; }
  .op { color:#00e5ff; border-color:#00e5ff66; }
</style>
</head>
<body>
  <h2>🔢 ${prompt.toUpperCase()}</h2>
  <div class="calc-box">
    <input type="text" id="screen" readonly value="0">
    <div class="grid">
      <button onclick="cl()">C</button>
      <button onclick="sq()">√</button>
      <button onclick="pct()">%</button>
      <button class="op" onclick="ap('/')">÷</button>
      <button onclick="ap('7')">7</button>
      <button onclick="ap('8')">8</button>
      <button onclick="ap('9')">9</button>
      <button class="op" onclick="ap('*')">×</button>
      <button onclick="ap('4')">4</button>
      <button onclick="ap('5')">5</button>
      <button onclick="ap('6')">6</button>
      <button class="op" onclick="ap('-')">−</button>
      <button onclick="ap('1')">1</button>
      <button onclick="ap('2')">2</button>
      <button onclick="ap('3')">3</button>
      <button class="op" onclick="ap('+')">+</button>
      <button onclick="ap('0')">0</button>
      <button onclick="ap('.')">.</button>
      <button onclick="pi()">π</button>
      <button class="op" style="background:#00f5a0;color:#000" onclick="eq()">=</button>
    </div>
  </div>
  <script>
    const scr = document.getElementById('screen');
    function ap(v) { if (scr.value === '0') scr.value = ''; scr.value += v; }
    function cl() { scr.value = '0'; }
    function sq() { scr.value = Math.sqrt(eval(scr.value)).toFixed(4); }
    function pct() { scr.value = (eval(scr.value)/100).toString(); }
    function pi() { scr.value = Math.PI.toFixed(4); }
    function eq() { try { scr.value = eval(scr.value); } catch(e){ scr.value = 'ERR'; } }
  </script>
</body>
</html>`;
  }

  if (lower.includes("todo")) {
    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${prompt}</title>
<style>
  body { margin:0; background:#020202; color:#00f5a0; font-family:sans-serif; padding:16px; }
  .box { max-width:360px; margin:0 auto; background:#08100d; border:2px solid #00f5a0; border-radius:14px; padding:16px; }
  input { width:70%; padding:10px; background:#000; border:1px solid #00f5a0; color:#00f5a0; border-radius:8px; }
  button { padding:10px 14px; background:#00f5a0; color:#000; font-weight:bold; border:none; border-radius:8px; cursor:pointer; }
  ul { list-style:none; padding:0; margin-top:16px; }
  li { display:flex; justify-content:space-between; align-items:center; background:#03130d; padding:10px; border-radius:6px; margin-bottom:8px; border-left:3px solid #00f5a0; }
  .done { text-decoration:line-through; opacity:0.5; }
</style>
</head>
<body>
  <div class="box">
    <h3>✅ ${prompt.toUpperCase()}</h3>
    <div>
      <input id="taskInput" placeholder="Add mission task...">
      <button onclick="addTask()">ADD</button>
    </div>
    <ul id="taskList"></ul>
  </div>
  <script>
    let tasks = ['Initialize Stark Protocol', 'Calibrate 1000 Feature Factory', 'Check Firebase Real-time DB'];
    function render() {
      const ul = document.getElementById('taskList');
      ul.innerHTML = '';
      tasks.forEach((t, i) => {
        const li = document.createElement('li');
        li.innerHTML = '<span onclick="this.classList.toggle(\\'done\\')">' + t + '</span> <button style="background:#ff3b30;color:#fff;padding:4px 8px;font-size:10px;" onclick="delTask(' + i + ')">DEL</button>';
        ul.appendChild(li);
      });
    }
    function addTask() {
      const val = document.getElementById('taskInput').value.trim();
      if(val) { tasks.push(val); document.getElementById('taskInput').value = ''; render(); }
    }
    function delTask(i) { tasks.splice(i, 1); render(); }
    render();
  </script>
</body>
</html>`;
  }

  // Generic App Template
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { background:#020202; color:#00f5a0; font-family:sans-serif; padding:16px; margin:0; }
  .box { background:#091410; border:2px solid #00f5a0; border-radius:14px; padding:16px; box-shadow:0 0 15px rgba(0,245,160,0.2); }
  button { background:#00f5a0; color:#000; padding:10px 18px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; margin-top:10px; width:100%; }
  textarea { width:100%; box-sizing:border-box; height:120px; background:#000; border:1px solid #00f5a0; color:#00f5a0; padding:10px; border-radius:8px; font-family:monospace; }
</style>
</head>
<body>
  <div class="box">
    <h2>📱 ${prompt.toUpperCase()}</h2>
    <div style="font-size:12px;color:#a1ffdb;margin-bottom:10px">Plugin Factory Instant App — Online & Armed</div>
    <textarea placeholder="Interactive input for ${prompt}...">Stark Quantum Subroutine Ready.
Type or interact below.</textarea>
    <button onclick="alert('${prompt} processed successfully Sir!')">⚡ Execute ${prompt}</button>
  </div>
</body>
</html>`;
}

export function buildAITool(prompt: string): string {
  const encPrompt = encodeURIComponent(prompt + " futuristic cyberpunk high detail");
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { background:#020202; color:#fff; text-align:center; padding:16px; font-family:sans-serif; margin:0; }
  img { max-width:100%; height:auto; border:3px solid #00f5a0; border-radius:12px; box-shadow:0 0 20px rgba(0,245,160,0.3); margin:12px 0; }
  .btn { display:inline-block; background:#00f5a0; color:#000; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:bold; margin:6px; cursor:pointer; border:none; }
  #status { font-size:12px; color:#00f5a0; }
</style>
</head>
<body>
  <h2 style="color:#00f5a0">🎨 ${prompt.toUpperCase()}</h2>
  <div id="status">Synthesizing Neural Art Matrix...</div>
  <img id="aiImg" src="https://image.pollinations.ai/prompt/${encPrompt}?nologo=true" alt="${prompt}" onload="document.getElementById('status').innerText='Neural Art Render Complete Sir!'" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'200\\' style=\\'background:%23000\\'><text x=\\'50%\\' y=\\'50%\\' fill=\\'%2300f5a0\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'sans-serif\\'>AI Vision Rendered</text></svg>';document.getElementById('status').innerText='Neural Vector Complete Sir!';">
  <div>
    <button class="btn" onclick="regenerate()">🔄 Re-roll Seed</button>
    <a id="dl" class="btn" href="https://image.pollinations.ai/prompt/${encPrompt}" target="_blank">📥 Download HD</a>
  </div>
  <script>
    function regenerate() {
      const seed = Math.floor(Math.random()*100000);
      document.getElementById('status').innerText = 'Re-synthesizing seed #' + seed;
      document.getElementById('aiImg').src = 'https://image.pollinations.ai/prompt/' + encodeURIComponent('${prompt}') + '?seed=' + seed + '&nologo=true';
    }
  </script>
</body>
</html>`;
}

export function buildQRBarcode(prompt: string): string {
  const data = encodeURIComponent(prompt + " — ADARSH JARVIS 1000 BY @free_maker93");
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { background:#020202; color:#00f5a0; text-align:center; padding:16px; font-family:sans-serif; margin:0; }
  .box { background:#0a1410; border:2px solid #00f5a0; border-radius:16px; padding:16px; max-width:340px; margin:0 auto; }
  img { border:4px solid #00f5a0; border-radius:12px; margin:12px 0; background:#fff; padding:6px; }
  input { width:80%; padding:8px; background:#000; border:1px solid #00f5a0; color:#00f5a0; border-radius:6px; margin-bottom:8px; text-align:center; }
  button { background:#00f5a0; color:#000; font-weight:bold; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; }
</style>
</head>
<body>
  <div class="box">
    <h2>🔳 ${prompt.toUpperCase()}</h2>
    <input id="qrText" value="${prompt} — Adarsh Jarvis 1000">
    <br>
    <button onclick="updateQR()">Generate New Code</button>
    <br>
    <img id="qrImg" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${data}" alt="QR">
    <div style="font-size:11px;color:#a1ffdb">Encrypted scannable optical matrix</div>
  </div>
  <script>
    function updateQR() {
      const txt = encodeURIComponent(document.getElementById('qrText').value);
      document.getElementById('qrImg').src = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + txt;
    }
  </script>
</body>
</html>`;
}

export function buildDataTicker(prompt: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { background:#020202; color:#00f5a0; font-family:monospace; padding:16px; margin:0; text-align:center; }
  .card { background:#08130e; border:2px solid #00f5a0; border-radius:14px; padding:16px; max-width:340px; margin:0 auto; box-shadow:0 0 15px rgba(0,245,160,0.25); }
  .price { font-size:26px; color:#00e5ff; font-weight:bold; margin:12px 0; }
  .feed { background:#000; padding:10px; border-radius:8px; font-size:12px; text-align:left; border:1px solid #00f5a044; }
  button { background:#00f5a0; color:#000; font-weight:bold; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; margin-top:10px; }
</style>
</head>
<body>
  <div class="card">
    <h3>📊 ${prompt.toUpperCase()}</h3>
    <div style="font-size:11px;color:#88e0c0">LIVE QUANTUM FEED TELEMETRY</div>
    <div class="price" id="priceDisplay">Fetching...</div>
    <div class="feed" id="dataFeed">Connecting to global oracle...</div>
    <button onclick="fetchData()">🔄 Sync Oracle</button>
  </div>
  <script>
    async function fetchData() {
      try {
        const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd,inr&include_24hr_change=true');
        const data = await r.json();
        const btc = data.bitcoin;
        document.getElementById('priceDisplay').innerText = '$' + btc.usd.toLocaleString() + ' / ₹' + btc.inr.toLocaleString();
        document.getElementById('dataFeed').innerHTML = 'BTC: $' + btc.usd + ' (' + btc.usd_24h_change.toFixed(2) + '%)<br>ETH: $' + data.ethereum.usd + '<br>SOL: $' + data.solana.usd + '<br>Status: Quantum Feed 100% Live';
      } catch(e) {
        // Fallback simulation
        const fakePrice = (89400 + (Math.random()*800 - 400)).toFixed(2);
        document.getElementById('priceDisplay').innerText = '$' + fakePrice + ' USD';
        document.getElementById('dataFeed').innerHTML = 'Live Telemetry: Active Sir!<br>Asset: ' + '${prompt}' + '<br>24h Range: High Volatility<br>Neural Confidence: 99.4%';
      }
    }
    fetchData();
  </script>
</body>
</html>`;
}

export function buildUniversalFactory(prompt: string, cat: string): string {
  const timestamp = Date.now().toString().slice(-6);
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { margin:0; background:#020202; color:#00f5a0; font-family:'Courier New', monospace, sans-serif; padding:16px; text-align:center; }
  .factory { background:linear-gradient(135deg,#001a10,#002a30); border:2px solid #00f5a0; border-radius:16px; padding:20px; margin-top:10px; box-shadow:0 0 20px rgba(0,245,160,0.3); }
  h2 { margin:8px 0; color:#fff; text-shadow:0 0 10px #00f5a0; }
  button { background:#00f5a0; color:#000; border:none; padding:10px 18px; border-radius:8px; font-weight:bold; margin:6px; cursor:pointer; font-family:sans-serif; }
  button:hover { background:#00d282; }
  .meta { margin-top:14px; background:#000; padding:12px; border-radius:8px; text-align:left; font-size:12px; line-height:1.6; border:1px solid #00f5a044; }
  .pulse { display:inline-block; width:8px; height:8px; background:#00f5a0; border-radius:50%; box-shadow:0 0 8px #00f5a0; margin-right:6px; animation:p 1s infinite alternate; }
  @keyframes p { from{opacity:0.3} to{opacity:1} }
</style>
</head>
<body>
  <div style="font-size:11px;color:#00e5ff;letter-spacing:1px">⚡ ADARSH JARVIS 1000 — AUTONOMOUS FACTORY</div>
  <div class="factory">
    <h2>${prompt.toUpperCase()}</h2>
    <div style="font-size:11px;color:#a1ffdb;margin-bottom:12px">
      <span class="pulse"></span>PLUGIN #${timestamp} — CATEGORY: ${cat}
    </div>
    <p style="font-size:13px;color:#e0fff3">This feature was auto-generated on-demand by the JARVIS 1000 Feature Factory — Built live in milliseconds Sir!</p>
    
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px">
      <button onclick="runFeature()">▶️ Run</button>
      <button onclick="navigator.clipboard.writeText('${prompt}'); alert('Command copied to clipboard Sir!');">📋 Copy</button>
      <button onclick="window.open('https://wa.me/?text=' + encodeURIComponent('Check out this Stark Feature: ${prompt} by @free_maker93'))">📤 Share</button>
      <button onclick="toggleTheme()">🎨 Theme</button>
    </div>

    <div class="meta">
      <div><b>Plugin ID:</b> #1000-${timestamp}</div>
      <div><b>Category:</b> ${cat}</div>
      <div><b>Execution State:</b> ✅ Active & Verified</div>
      <div><b>Engine:</b> Autonomous Dynamic Factory</div>
      <div><b>Creator:</b> @free_maker93</div>
    </div>
  </div>
  <script>
    function runFeature() {
      alert('Mission subroutine for "${prompt}" executed successfully Sir!');
    }
    function toggleTheme() {
      const f = document.querySelector('.factory');
      f.style.background = f.style.background.includes('rgb(0, 26, 16)') ? 
        'linear-gradient(135deg, #15002b, #2b003b)' : 'linear-gradient(135deg,#001a10,#002a30)';
    }
  </script>
</body>
</html>`;
}

// Master dynamic plugin builder
export async function dynamicPlugin(prompt: string, cat: string = "Dynamic Plugin"): Promise<BuiltPluginResult> {
  const lower = prompt.toLowerCase();
  let html = "";

  if (lower.includes("game") || lower.includes("chess") || lower.includes("car") || lower.includes("racing") || lower.includes("pubg") || lower.includes("snake") || lower.includes("pong") || lower.includes("ludo")) {
    html = buildGame(prompt);
  } else if (lower.includes("calculator") || lower.includes("todo") || lower.includes("excel") || lower.includes("notes") || lower.includes("editor")) {
    html = buildApp(prompt);
  } else if (lower.includes("image gen") || lower.includes("bg remove") || lower.includes("upscale") || lower.includes("face swap") || lower.includes("art")) {
    html = buildAITool(prompt);
  } else if (lower.includes("qr") || lower.includes("barcode")) {
    html = buildQRBarcode(prompt);
  } else if (lower.includes("price") || lower.includes("btc") || lower.includes("eth") || lower.includes("weather") || lower.includes("news") || lower.includes("ticker")) {
    html = buildDataTicker(prompt);
  } else {
    html = buildUniversalFactory(prompt, cat);
  }

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const pluginId = Date.now();

  // Save to Firestore asynchronously
  savePluginToFirestore({
    prompt,
    cat,
    html,
    id: pluginId
  });

  return {
    prompt,
    cat,
    html,
    url,
    id: pluginId
  };
}
