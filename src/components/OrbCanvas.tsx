import React, { useEffect, useRef } from 'react';

interface OrbCanvasProps {
  state: 'idle' | 'listening' | 'speaking' | 'building' | 'armed';
  onClick?: () => void;
}

export const OrbCanvas: React.FC<OrbCanvasProps> = ({ state, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let pulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      angle += state === 'building' ? 0.05 : state === 'listening' ? 0.03 : 0.015;
      pulse += 0.04;
      const pulseScale = Math.sin(pulse) * 4;

      // Color scheme based on state
      let primaryColor = '#00f5a0';
      let secondaryColor = '#00e5ff';
      let glowColor = 'rgba(0, 245, 160, 0.4)';

      if (state === 'listening') {
        primaryColor = '#00e5ff';
        secondaryColor = '#3b82f6';
        glowColor = 'rgba(0, 229, 255, 0.6)';
      } else if (state === 'building') {
        primaryColor = '#f59e0b';
        secondaryColor = '#ef4444';
        glowColor = 'rgba(245, 158, 11, 0.6)';
      } else if (state === 'speaking') {
        primaryColor = '#10b981';
        secondaryColor = '#34d399';
        glowColor = 'rgba(16, 185, 129, 0.6)';
      }

      // 1. Ambient Background Glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120);
      bgGrad.addColorStop(0, glowColor);
      bgGrad.addColorStop(0.6, 'rgba(0, 245, 160, 0.05)');
      bgGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 120, 0, Math.PI * 2);
      ctx.fill();

      // 2. Outer Rotating Segmented Ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, 110 + pulseScale * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3. Counter-Rotating Middle Ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle * 1.5);
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([16, 8, 4, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, 92 - pulseScale * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 4. Arc Reactor Triangular / Hex Core Nodes
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle * 0.5);
      const segments = 8;
      for (let i = 0; i < segments; i++) {
        const rad = (i * Math.PI * 2) / segments;
        const x = Math.cos(rad) * 72;
        const y = Math.sin(rad) * 72;

        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 245, 160, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.restore();

      // 5. Waveform Ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const wavePoints = 48;
      for (let i = 0; i <= wavePoints; i++) {
        const theta = (i / wavePoints) * Math.PI * 2;
        const amp = state === 'speaking' || state === 'listening' ? Math.sin(theta * 6 + pulse * 2) * 8 : Math.sin(theta * 4 + pulse) * 3;
        const r = 55 + amp;
        const wx = Math.cos(theta) * r;
        const wy = Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // 6. Inner Glowing Core
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 40);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, primaryColor);
      coreGrad.addColorStop(0.7, secondaryColor);
      coreGrad.addColorStop(1, 'rgba(0, 245, 160, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 42 + pulseScale, 0, Math.PI * 2);
      ctx.fill();

      // 7. Center Quantum Core Text
      ctx.fillStyle = '#020202';
      ctx.font = 'bold 11px Orbitron, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(state.toUpperCase(), cx, cy);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state]);

  return (
    <div className="relative flex flex-col items-center justify-center cursor-pointer select-none group" onClick={onClick}>
      <canvas
        ref={canvasRef}
        width={260}
        height={260}
        className="w-[260px] h-[260px] drop-shadow-[0_0_25px_rgba(0,245,160,0.35)] transition-transform duration-300 group-hover:scale-105 active:scale-95"
      />
      <div className="absolute bottom-2 text-[10px] tracking-widest text-[#00f5a0]/80 font-mono flex items-center gap-1.5 bg-black/60 px-3 py-0.5 rounded-full border border-[#00f5a0]/30 backdrop-blur-sm">
        <span className={`w-1.5 h-1.5 rounded-full animate-ping ${state === 'building' ? 'bg-amber-400' : state === 'listening' ? 'bg-cyan-400' : 'bg-[#00f5a0]'}`} />
        STARK ARC REACTOR • 100%
      </div>
    </div>
  );
};
