import { useEffect, useRef } from "react";

const WARM = ["#e09aaa", "#d4a055", "#d0a0e8", "#f5d8a0", "#e8a0c8", "#9ecfeb"];

export function CelebrationCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", resize);

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = WARM[Math.floor(Math.random() * WARM.length)];
        const angle = Math.random() * Math.PI * 2;
        const spd = 2.5 + Math.random() * 5.5;
        this.vx = Math.cos(angle) * spd;
        this.vy = Math.sin(angle) * spd - 1;
        this.alpha = 1;
        this.size = 1.8 + Math.random() * 3.5;
        this.decay = 0.013 + Math.random() * 0.013;
        this.gravity = 0.1;
      }

      tick() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Heart {
      constructor(startLow) {
        this.reset(startLow);
        if (!startLow) {
          this.y = Math.random() * window.innerHeight;
          this.alpha = Math.random() * 0.4;
        }
      }

      reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight + 30;
        this.size = 8 + Math.random() * 18;
        this.spd = 0.7 + Math.random() * 1.4;
        this.drift = (Math.random() - 0.5) * 0.6;
        this.alpha = 0.55 + Math.random() * 0.4;
        this.color = WARM[Math.floor(Math.random() * 3)];
        this.rot = (Math.random() - 0.5) * 0.35;
        this.wobble = Math.random() * Math.PI * 2;
      }

      tick() {
        this.y -= this.spd;
        this.wobble += 0.03;
        this.x += this.drift + Math.sin(this.wobble) * 0.4;
        this.alpha -= 0.0018;
        if (this.alpha <= 0 || this.y < -40) this.reset(true);
      }

      draw() {
        const s = this.size / 20;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.scale(s, s);
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.bezierCurveTo(-10, -7, -20, 3, 0, 15);
        ctx.bezierCurveTo(20, 3, 10, -7, 0, 3);
        ctx.fill();
        ctx.restore();
      }
    }

    let particles = [];
    const hearts = Array.from({ length: 20 }, () => new Heart(false));
    let raf;

    const burst = (xf, yf, n) => {
      const x = window.innerWidth * xf;
      const y = window.innerHeight * yf;
      for (let i = 0; i < n; i += 1) particles.push(new Particle(x, y));
    };

    setTimeout(() => burst(0.22, 0.35, 75), 150);
    setTimeout(() => burst(0.78, 0.38, 75), 550);
    setTimeout(() => burst(0.5, 0.22, 90), 1000);
    setTimeout(() => burst(0.12, 0.55, 60), 1500);
    setTimeout(() => burst(0.88, 0.28, 60), 1900);
    setTimeout(() => burst(0.35, 0.45, 55), 2400);
    setTimeout(() => burst(0.65, 0.5, 55), 2800);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.alpha > 0);
      particles.forEach((p) => {
        p.tick();
        p.draw();
      });
      hearts.forEach((h) => {
        h.tick();
        h.draw();
      });
      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      if (window.visualViewport) window.visualViewport.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 997,
      }}
    />
  );
}
