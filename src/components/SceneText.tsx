import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ActiveScene } from "../types";

interface SceneTextProps {
  scrollProgress: number;
  activeScene: ActiveScene;
  onNavigate: (progressTarget: number) => void;
}

export default function SceneText({ scrollProgress, activeScene, onNavigate }: SceneTextProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  // Define helper to get opacity and translate values based on scrollProgress ranges
  const getSceneStyle = (start: number, end: number) => {
    if (scrollProgress < start) {
      return { opacity: 0, transform: "translateY(40px) scale(0.95)", filter: "blur(12px)", pointerEvents: "none" as const };
    }
    if (scrollProgress > end) {
      return { opacity: 0, transform: "translateY(-40px) scale(0.95)", filter: "blur(12px)", pointerEvents: "none" as const };
    }
    // Interpolate in the active window
    const duration = end - start;
    const progress = (scrollProgress - start) / duration;
    
    // Smooth peak: rise in first 25%, flat till 75%, fall in last 25%
    let opacity = 1;
    let translate = 0;
    let blur = 0;

    if (progress < 0.25) {
      const p = progress / 0.25;
      opacity = p;
      translate = (1.0 - p) * 30;
      blur = (1.0 - p) * 10;
    } else if (progress > 0.75) {
      const p = (1.0 - progress) / 0.25;
      opacity = p;
      translate = (p - 1.0) * 30;
      blur = (1.0 - p) * 10;
    }

    return {
      opacity,
      transform: `translateY(${translate}px) scale(${0.98 + opacity * 0.02})`,
      filter: `blur(${blur}px)`,
      pointerEvents: opacity > 0.1 ? ("auto" as const) : ("none" as const),
      transition: "transform 0.1s ease-out, filter 0.1s ease-out, opacity 0.1s ease-out"
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none">
      <div className="w-full h-full max-w-7xl mx-auto px-6 md:px-12 relative flex items-center justify-center">
        
        {/* ================= SCENE 0: HERO INTRO ================= */}
        <div
          style={getSceneStyle(0.0, 0.12)}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center"
            >
              <span className="text-[11px] font-bold tracking-[0.4em] text-cyan-400 uppercase mb-6 block">
                THE PRESENTATION OF PURE IMAGERY
              </span>
              <div className="mb-6 overflow-hidden">
                <span className="block text-[65px] sm:text-[100px] md:text-[140px] font-black leading-[0.8] tracking-[-0.04em] text-center text-gradient-metallic-light">
                  CAMON
                </span>
                <span className="block text-[65px] sm:text-[100px] md:text-[140px] font-black leading-[0.8] tracking-[-0.04em] text-center text-gradient-metallic-dark">
                  50 PRO
                </span>
              </div>
              <div className="flex items-center gap-6 mt-6">
                <div className="h-[1px] w-12 md:w-24 bg-white/20"></div>
                <span className="text-xs md:text-sm tracking-[0.4em] md:tracking-[0.6em] font-light opacity-60 uppercase">
                  ULTRA-CINEMATIC SERIES
                </span>
                <div className="h-[1px] w-12 md:w-24 bg-white/20"></div>
              </div>
              <div className="mt-12 flex flex-col items-center">
                <span className="text-[10px] text-white/40 tracking-widest uppercase mb-2 animate-pulse">
                  Scroll to unveil
                </span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
 
        {/* ================= SCENE 1: CAMERA STORY ================= */}
        <div
          style={getSceneStyle(0.12, 0.28)}
          className="absolute inset-x-6 md:inset-x-12 top-24 md:top-36 flex flex-col justify-start text-left"
        >
          <span className="text-[11px] font-bold tracking-[0.3em] text-cyan-400 uppercase mb-4 block">
            CINEMATIC OPTICS
          </span>
          <h2 className="text-5xl md:text-7xl font-black tracking-[-0.04em] text-white mb-6 leading-none">
            CAPTURE MORE <br className="hidden md:block" />
            <span className="text-gradient-metallic-light">THAN A MOMENT.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 max-w-3xl mb-8">
            <p className="text-sm text-neutral-400 leading-relaxed font-light">
              Powered by the cutting-edge <strong>Sony LYTIA-700C</strong> sensor stack. Triple 50MP OIS lens engineering brings unrivaled light sensitivity, dynamic range, and professional focal calibration.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed font-light">
              With hardware-level high sensitivity and pixel co-processing, your night shots retain absolute clarity, turning darkness into a canvas of vivid memories.
            </p>
          </div>
          {/* Lens focus markers */}
          <div className="flex space-x-8 border-t border-white/10 pt-4 max-w-xl">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-cyan-400 block mb-1">01 — SONY LYTIA SENSOR</span>
              <p className="text-xs text-neutral-500">50MP with ultra-high light absorption ratios.</p>
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-widest text-teal-400 block mb-1">02 — PORTRAIT SENSOR</span>
              <p className="text-xs text-neutral-500">1.0 µm pixel binning for precise cinematic bokeh.</p>
            </div>
          </div>
        </div>

        {/* ================= SCENE 2: PERFORMANCE (NEW) ================= */}
        <div
          style={getSceneStyle(0.28, 0.44)}
          className="absolute inset-x-6 md:inset-x-12 bottom-24 flex flex-col md:flex-row items-end justify-between text-left"
        >
          <div className="max-w-xl mb-6 md:mb-0">
            <span className="text-[11px] font-bold tracking-[0.25em] text-indigo-400 uppercase mb-3 block">
              COMPUTE ENGINE
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white leading-tight mb-4">
              Uncompromising <br className="hidden md:block" />
              <span className="text-gradient-metallic-light font-black">Performance.</span>
            </h2>
            <p className="text-sm text-neutral-400 max-w-md font-light leading-relaxed">
              Powered by the high-compute AI co-processing chipset. Optimizes dynamic rendering frame rates, manages thermal loads intelligently, and handles complex on-device deep neural networks smoothly.
            </p>
          </div>
          <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02] backdrop-blur-md max-w-xs">
            <span className="text-3xl font-light text-indigo-400 block mb-2">4nm Platform</span>
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest leading-relaxed font-bold">
              Ultimate Frame Rates & Hyper-Fast Load Times
            </p>
          </div>
        </div>

        {/* ================= SCENE 3: WATER RESISTANT (DURABILITY) ================= */}
        <div
          style={getSceneStyle(0.44, 0.60)}
          className="absolute inset-x-6 md:inset-x-12 bottom-24 flex flex-col md:flex-row items-end justify-between text-left"
        >
          <div className="max-w-xl mb-6 md:mb-0">
            <span className="text-[11px] font-bold tracking-[0.25em] text-teal-400 uppercase mb-3 block">
              ATMOSPHERIC SHIELD
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white leading-tight mb-4">
              Beauty in <br className="hidden md:block" />
              <span className="text-gradient-metallic-light font-black">every splash.</span>
            </h2>
            <p className="text-sm text-neutral-400 max-w-md font-light leading-relaxed">
              Certified with dual <strong>IP69 & IP69K</strong> protection. Engineered with precision liquid seals to withstand high-pressure hot water jets, dust storms, and continuous deep submersion.
            </p>
          </div>
          <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02] backdrop-blur-md max-w-xs">
            <span className="text-3xl font-light text-teal-400 block mb-2">IP69 / IP69K</span>
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest leading-relaxed font-bold">
              Dust Tight & Extreme Thermal Jet Protection
            </p>
          </div>
        </div>

        {/* ================= SCENE 4: DESIGN FORM ================= */}
        <div
          style={getSceneStyle(0.60, 0.74)}
          className="absolute inset-x-6 md:inset-x-12 bottom-20 md:bottom-32 flex flex-col md:flex-row items-end justify-between"
        >
          <div className="max-w-xl mb-6 md:mb-0">
            <span className="text-[11px] font-bold tracking-[0.25em] text-amber-400 uppercase mb-3 block">
              DESIGN PHILOSOPHY
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white leading-tight mb-4">
              Designed <br />to be seen.
            </h2>
          </div>
          <div className="max-w-xs text-left">
            <p className="text-sm text-neutral-400 leading-relaxed font-light">
              A flawless statement of premium luxury materials, 120Hz curved screen elegance, and precision bilateral symmetry. Formed to command attention.
            </p>
          </div>
        </div>

        {/* ================= SCENE 5: TECNO AI ================= */}
        <div
          style={getSceneStyle(0.74, 0.86)}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <div className="mb-6 flex justify-center">
            {logoFailed ? (
              <div className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-cyan-500/30 bg-gradient-to-r from-neutral-900 to-cyan-950/40 text-cyan-400 font-bold font-mono tracking-[0.25em] text-sm animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                TECNO AI
              </div>
            ) : (
              <img
                src="/assets/images-os-logo-1.png.webp"
                alt="TECNO AI"
                className="h-16 md:h-20 object-contain animate-pulse"
                referrerPolicy="no-referrer"
                onError={() => setLogoFailed(true)}
              />
            )}
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white mb-4 leading-none">
            INTELLIGENCE, <br className="md:hidden" />
            <span className="text-gradient-metallic-light font-black">BUILT AROUND YOU.</span>
          </h2>
          <p className="text-sm text-neutral-400 max-w-lg leading-relaxed font-light mb-8">
            Adaptive AI co-processors automatically clean photo clutter, dynamically re-balance exposure in pitch darkness, and translate speech instantly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="bg-white/10 border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded font-mono">
              AI Portrait Retouching
            </span>
            <span className="bg-white/10 border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded font-mono">
              AI Magic Eraser
            </span>
            <span className="bg-white/10 border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded font-mono">
              Real-time Translator
            </span>
          </div>
        </div>

        {/* ================= SCENE 6: HiOS (NEW) ================= */}
        <div
          style={getSceneStyle(0.86, 0.95)}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="px-4 py-1.5 border border-amber-500/30 text-amber-400 font-bold font-mono tracking-widest text-xs uppercase rounded bg-amber-950/20 backdrop-blur">
              HiOS 15
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white mb-4 leading-none">
            FLUID ECOSYSTEM, <br className="md:hidden" />
            <span className="text-gradient-metallic-light font-black">SEAMLESS SPACE.</span>
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl leading-relaxed font-light mb-8">
            Experience absolute software fluidity. Loaded with lightweight widgets, smart dynamic dynamic notches, private folder security, and customized workspace themes built for your style.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="bg-white/10 border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded font-mono">
              Smart Dynamic Island
            </span>
            <span className="bg-white/10 border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded font-mono">
              Private Safe 2.0
            </span>
            <span className="bg-white/10 border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded font-mono">
              Fluid Desktop Widgets
            </span>
          </div>
        </div>

        {/* ================= SCENE 7: OUTRO REVEAL ================= */}
        <div
          style={getSceneStyle(0.95, 1.0)}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <span className="text-[11px] font-bold tracking-[0.3em] text-cyan-400 uppercase mb-4 block">
            EXPERIENCE THE REVOLUTION
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-[-0.04em] text-white mb-6 leading-none">
            CAMON 50 Pro
          </h1>
          <p className="text-sm md:text-base text-neutral-400 max-w-md font-light leading-relaxed mb-10">
            Capture More. Experience More. Engineered with absolute premium symmetry, robust IP69 sealing, and the legendary Sony LYTIA optics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm pointer-events-auto">
            <button
              onClick={() => onNavigate(0.20)}
              className="w-full sm:w-auto bg-white text-black text-[11px] font-black tracking-widest uppercase px-10 py-4 rounded-full hover:bg-gray-200 transition-all duration-300"
            >
              Explore Cameras
            </button>
            <button
              onClick={() => alert("Registration for the TECNO CAMON 50 Pro private launch is now open in your region.")}
              className="w-full sm:w-auto border border-white/20 text-white hover:bg-white/5 text-[11px] font-bold tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-300"
            >
              Get Updates
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
