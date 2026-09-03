"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import "./CursorFollower.css";

/**
 * Luxury Perfume Spray Particle Effect on Click
 * 
 * Features:
 * - Emits a fine, atomized mist of perfume droplets from the nozzle of the Marj bottle.
 * - Directional cone tilted 90° to the left (-180° / horizontal left).
 * - Background Detection & Dynamic Inversion:
 *   - On WHITE / LIGHT backgrounds: inverts spray color to deep charcoal & smoky mist for 100% contrast.
 *   - On DARK backgrounds: sprays crisp, pure white translucent fragrance mist.
 * - Soft expanding vapor puffs that dissipate naturally.
 * - High-DPI canvas, 60/120fps requestAnimationFrame loop.
 * - Zero CPU when idle (animation loop sleeps when no particles are active).
 * - pointer-events: none so all clicks pass through seamlessly.
 */

// Detect whether background under the click coordinate is white or light
function isLightBackground(x, y) {
  try {
    let el = document.elementFromPoint(x, y);
    while (el && el !== document.documentElement) {
      const bg = window.getComputedStyle(el).backgroundColor;
      if (bg && bg !== "transparent" && !bg.includes("rgba(0, 0, 0, 0)")) {
        const parts = bg.match(/[\d.]+/g);
        if (parts && parts.length >= 3) {
          const r = parseFloat(parts[0]);
          const g = parseFloat(parts[1]);
          const b = parseFloat(parts[2]);
          const a = parts.length >= 4 ? parseFloat(parts[3]) : 1;
          if (a > 0.25) {
            // Perceived luminance formula (ITU-R BT.709)
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            return luminance > 165;
          }
        }
      }
      el = el.parentElement;
    }
    // Default fallback on web pages is light/white
    return true;
  } catch {
    return true;
  }
}

// Signature spray colors per perfume
const SPRAY_THEMES = {
  marj: {
    baseRgb: "200, 160, 156", // #c8a09c (dusty rose / blush quartz)
    palettes: [
      "rgba(200, 160, 156,",
      "rgba(208, 168, 164,",
      "rgba(192, 152, 148,",
      "rgba(215, 175, 171,",
      "rgba(204, 164, 160,",
    ],
    shadow: "rgba(200, 160, 156, 0.55)",
  },
  kawkab: {
    baseRgb: "240, 213, 128", // #f0d580 (radiant celestial champagne gold)
    palettes: [
      "rgba(240, 213, 128,",
      "rgba(246, 222, 140,",
      "rgba(232, 204, 118,",
      "rgba(250, 228, 152,",
      "rgba(238, 210, 125,",
    ],
    shadow: "rgba(240, 213, 128, 0.55)",
  },
  "bin-shaikh": {
    baseRgb: "227, 167, 110", // #e3a76e (warm peach amber)
    palettes: [
      "rgba(227, 167, 110,",
      "rgba(235, 175, 120,",
      "rgba(219, 159, 100,",
      "rgba(240, 180, 125,",
      "rgba(225, 165, 108,",
    ],
    shadow: "rgba(227, 167, 110, 0.5)",
  },
};

class MistDroplet {
  constructor(x, y, theme = "bin-shaikh") {
    this.x = x;
    this.y = y;
    this.theme = theme;

    const themeConfig = SPRAY_THEMES[theme] || SPRAY_THEMES["bin-shaikh"];

    // Central spray angle tilted 90° to the left (-180° / horizontal left) with a 45° cone spread
    const baseAngle = (-180 * Math.PI) / 180;
    const spread = ((Math.random() - 0.5) * 45 * Math.PI) / 180;
    const angle = baseAngle + spread;

    // Fast initial burst that gently decelerates
    const speed = 4 + Math.random() * 7;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    // Air resistance friction
    this.friction = 0.92 + Math.random() * 0.03;

    // Elongated liquid ellipse dimensions:
    // radiusX: length along flight direction (semi-major axis)
    // radiusY: slender thickness across (semi-minor axis)
    this.radiusX = 4.8 + Math.random() * 7.2;
    this.radiusY = 0.75 + Math.random() * 0.75;

    // Base opacity and lifespan
    this.alpha = 0.85 + Math.random() * 0.15;
    this.decay = 0.022 + Math.random() * 0.024;

    this.color = themeConfig.palettes[Math.floor(Math.random() * themeConfig.palettes.length)];
    this.shadowColor = themeConfig.shadow;
  }

  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;

    // Gently taper down as the droplet decelerates
    if (this.radiusX > 1.0) {
      this.radiusX -= 0.06;
    }
    if (this.radiusY > 0.35) {
      this.radiusY -= 0.01;
    }
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.beginPath();

    // Rotate along velocity vector for a streamlined liquid streak
    const rotation = Math.atan2(this.vy, this.vx);
    ctx.ellipse(
      this.x,
      this.y,
      Math.max(0.7, this.radiusX),
      Math.max(0.3, this.radiusY),
      rotation,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = `${this.color} ${Math.max(0, this.alpha)})`;
    ctx.shadowBlur = 4;
    ctx.shadowColor = this.shadowColor;
    ctx.fill();
    ctx.restore();
  }
}

class VaporPuff {
  constructor(x, y, theme = "bin-shaikh", tier = 0.5) {
    this.x = x;
    this.y = y;
    this.theme = theme;
    this.themeConfig = SPRAY_THEMES[theme] || SPRAY_THEMES["bin-shaikh"];

    // Plume drifting in spray direction (leftwards at -180°) with slight cone spread
    const spread = ((Math.random() - 0.5) * 35 * Math.PI) / 180;
    const angle = (-180 * Math.PI) / 180 + spread;

    // Speed scales with tier so puffs carry from the nozzle (2px) all the way to the end of droplet path (up to 8.5px)
    const speed = 2.0 + tier * 6.0 + Math.random() * 1.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.friction = 0.93 + tier * 0.015;

    // Radius expands progressively larger as it reaches the end of the droplet path
    this.radius = 3 + Math.random() * 3;
    this.maxRadius = 18 + tier * 28 + Math.random() * 10;
    this.alpha = 0.70 + Math.random() * 0.2;
    this.decay = 0.015 + Math.random() * 0.010;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.radius += (this.maxRadius - this.radius) * 0.08;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    const grad = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      Math.max(1, this.radius)
    );

    const baseRgb = this.themeConfig.baseRgb;
    grad.addColorStop(0, `rgba(${baseRgb}, ${Math.max(0, this.alpha * 0.85)})`);
    grad.addColorStop(0.45, `rgba(${baseRgb}, ${Math.max(0, this.alpha * 0.55)})`);
    grad.addColorStop(0.8, `rgba(${baseRgb}, ${Math.max(0, this.alpha * 0.22)})`);
    grad.addColorStop(1, `rgba(${baseRgb}, 0)`);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
}

export default function CursorFollower() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const puffsRef = useRef([]);
  const animFrameIdRef = useRef(null);
  const themeRef = useRef("bin-shaikh");
  const pathname = usePathname() || "";

  // Switch cursor theme based on active perfume route
  useEffect(() => {
    let theme = "bin-shaikh";
    const lower = pathname.toLowerCase();
    if (
      lower.includes("/shop/perfumes/oriental-fragrance/marj") ||
      lower.endsWith("/marj") ||
      lower.includes("/marj/")
    ) {
      theme = "marj";
    } else if (
      lower.includes("/shop/perfumes/oriental-fragrance/kawkab") ||
      lower.endsWith("/kawkab") ||
      lower.includes("/kawkab/")
    ) {
      theme = "kawkab";
    }

    themeRef.current = theme;
    document.documentElement.setAttribute("data-cursor-theme", theme);
    document.body.setAttribute("data-cursor-theme", theme);
  }, [pathname]);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (
      typeof window === "undefined" ||
      window.innerWidth < 768 ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Vapor Puffs
      const puffs = puffsRef.current;
      for (let i = puffs.length - 1; i >= 0; i--) {
        const puff = puffs[i];
        puff.update();
        if (puff.alpha <= 0) {
          puffs.splice(i, 1);
        } else {
          puff.draw(ctx);
        }
      }

      // Update & Draw Mist Droplets
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw(ctx);
        }
      }

      // If particles still exist, continue loop; otherwise sleep
      if (particles.length > 0 || puffs.length > 0) {
        animFrameIdRef.current = requestAnimationFrame(render);
      } else {
        animFrameIdRef.current = null;
      }
    };

    const triggerSpray = (x, y) => {
      const currentTheme = themeRef.current || "bin-shaikh";

      // Spawn 24-30 mist droplets with perfume theme color
      const dropletCount = 24 + Math.floor(Math.random() * 7);
      for (let i = 0; i < dropletCount; i++) {
        particlesRef.current.push(new MistDroplet(x, y, currentTheme));
      }

      // Spawn expanding vapor puffs carrying all the way to the end of the droplet path
      const puffCount = 7;
      for (let i = 0; i < puffCount; i++) {
        const tier = i / (puffCount - 1);
        puffsRef.current.push(new VaporPuff(x, y, currentTheme, tier));
      }

      // Start loop if not already running
      if (!animFrameIdRef.current) {
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    let sprayTimeout = null;

    const handlePointerDown = (e) => {
      // Only spray on primary click
      if (e.button !== 0 && e.buttons !== 1) return;

      // Switch cursor to angled bottle for the duration of the spray puff
      document.body.classList.add("is-spraying");
      if (sprayTimeout) clearTimeout(sprayTimeout);
      sprayTimeout = setTimeout(() => {
        document.body.classList.remove("is-spraying");
      }, 400);

      triggerSpray(e.clientX, e.clientY);
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (sprayTimeout) clearTimeout(sprayTimeout);
      document.body.classList.remove("is-spraying");
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="perfume-spray-canvas"
      aria-hidden="true"
    />
  );
}
