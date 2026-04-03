import React, { useEffect, useRef } from 'react';

const Starfield: React.FC<{ paused?: boolean }> = ({ paused = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: { x: number; y: number; size: number; baseOpacity: number; opacity: number; vx: number; vy: number; shimmerOffset: number }[] = [];
    let shootingStars: { x: number; y: number; len: number; speed: number; opacity: number; vx: number; vy: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < 400; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          baseOpacity: Math.random() * 0.7 + 0.3,
          opacity: 0,
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05,
          shimmerOffset: Math.random() * Math.PI * 2
        });
      }
    };

    const createShootingStar = () => {
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      
      if (side === 0) { // Top
        x = Math.random() * canvas.width; y = 0;
        vx = (Math.random() - 0.5) * 4; vy = Math.random() * 5 + 5;
      } else if (side === 1) { // Right
        x = canvas.width; y = Math.random() * canvas.height;
        vx = -(Math.random() * 5 + 5); vy = (Math.random() - 0.5) * 4;
      } else if (side === 2) { // Bottom
        x = Math.random() * canvas.width; y = canvas.height;
        vx = (Math.random() - 0.5) * 4; vy = -(Math.random() * 5 + 5);
      } else { // Left
        x = 0; y = Math.random() * canvas.height;
        vx = Math.random() * 5 + 5; vy = (Math.random() - 0.5) * 4;
      }

      shootingStars.push({
        x, y,
        len: Math.random() * 150 + 100, 
        speed: 1, 
        opacity: 1,
        vx, vy
      });
    };

    const animate = (time: number) => {
      if (pausedRef.current) {
        requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(s => {
        const shimmer = Math.sin(time * 0.008 + s.shimmerOffset) * 0.3;
        s.opacity = Math.max(0.1, s.baseOpacity + shimmer);

        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = canvas.width; if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height; if (s.y > canvas.height) s.y = 0;
      });

      if (Math.random() < 0.02) createShootingStar(); 
      
      ctx.globalCompositeOperation = 'lighter';
      shootingStars.forEach((s, i) => {
        const tailX = s.x - (s.vx * s.len) / 10;
        const tailY = s.y - (s.vy * s.len) / 10;
        
        const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3; 
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        
        s.x += s.vx;
        s.y += s.vy;
        s.opacity -= 0.008; 

        if (s.opacity <= 0) shootingStars.splice(i, 1);
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    setTimeout(resize, 100);
    requestAnimationFrame(animate);
    
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />;
};

export default Starfield;
