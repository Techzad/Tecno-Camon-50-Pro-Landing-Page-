import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ShieldCheck, Cpu, Eye, Camera, Check } from "lucide-react";

// The pipeline of critical high-res webp assets to cache before rendering the app
const PRELOAD_ASSETS = [
  { path: "/assets/images-CN5C-design-tap_poster-1.jpg.webp", name: "1.5K Immersive Curve AMOLED Texture" },
  { path: "/assets/images-image-card-1-1.jpg.webp", name: "Sony LYTIA-700C Lens Architecture" },
  { path: "/assets/images-CN5C-performance-chip-1.jpg.webp", name: "Flagship 4nm Processor Core Matrix" },
  { path: "/assets/images-performance-green-1.jpg.webp", name: "Aero-Grade Atmospheric Shield Chassis" },
  { path: "/assets/images-CN5C-design-img-green-1.jpg.webp", name: "Textured Premium Emerald Finish" },
  { path: "/assets/images-CN5C-ai-swiper-4-1.png.webp", name: "TECNO AI Swiper Spatial Interface" },
  { path: "/assets/images-CN5C-performance-bg-4-1.jpg.webp", name: "Ultra-Endurance 6500mAh Solid State Layer" },
  { path: "/assets/images-os-logo-1.png.webp", name: "HiOS 15 Fluid Dynamic Environment" }
];

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [currentAssetName, setCurrentAssetName] = useState("Initializing core files...");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let active = true;
    let loaded = 0;

    if (PRELOAD_ASSETS.length === 0) {
      setIsDone(true);
      setTimeout(onComplete, 800);
      return;
    }

    const loadPromises = PRELOAD_ASSETS.map((asset) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = asset.path;
        img.onload = () => {
          if (active) {
            loaded += 1;
            setLoadedCount(loaded);
            setCurrentAssetName(asset.name);
          }
          resolve();
        };
        img.onerror = () => {
          // Resolve even on error to prevent blocking the preloader indefinitely
          if (active) {
            loaded += 1;
            setLoadedCount(loaded);
            setCurrentAssetName(`Fallback initialized: ${asset.name}`);
          }
          resolve();
        };
      });
    });

    Promise.all(loadPromises).then(() => {
      if (active) {
        setIsDone(true);
        // Generous delay for cinematic effect to let the user see 100% and premium animation completion
        const timer = setTimeout(() => {
          onComplete();
        }, 1200);
        return () => clearTimeout(timer);
      }
    });

    return () => {
      active = false;
    };
  }, [onComplete]);

  const percentage = Math.round((loadedCount / PRELOAD_ASSETS.length) * 100);

  // Status message based on current load percentage
  const getStatusMessage = () => {
    if (percentage < 25) return "CALIBRATING OPTICAL PIPELINES";
    if (percentage < 50) return "PROVISIONING HIGH-COMPUTE ENGINE";
    if (percentage < 75) return "STRUCTURING ATMOSPHERIC SEALS";
    if (percentage < 100) return "OPTIMIZING HiOS 15 FLUID ENVIRONMENT";
    return "SYSTEM READINESS CAPTURED";
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 w-full h-full bg-[#050505] z-[9999] flex flex-col items-center justify-between py-16 px-6 overflow-hidden select-none"
        >
          {/* Subtle Ambient Background Light */}
          <div className="absolute top-[20%] left-[30%] -translate-x-1/2 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
          <div className="absolute bottom-[20%] right-[30%] translate-x-1/2 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="flex flex-col items-center gap-1 z-10 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-2"
            >
              <span className="text-[10px] tracking-[0.4em] font-mono font-black text-neutral-400">TECNO PREMIUM</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-2xl font-black tracking-[-0.03em] text-white"
            >
              CAMON 50 Pro
            </motion.h1>
          </div>

          {/* Center Progress Ring / Percentage Display */}
          <div className="relative flex flex-col items-center justify-center z-10 my-auto">
            {/* Elegant SVG Progress Ring */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="88"
                  cy="88"
                  r="74"
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="2"
                  fill="transparent"
                />
                {/* Active Progress Ring */}
                <motion.circle
                  cx="88"
                  cy="88"
                  r="74"
                  stroke="url(#progress-gradient)"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 74}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 74 * (1 - loadedCount / PRELOAD_ASSETS.length)
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Dynamic Centered Text */}
              <div className="flex flex-col items-center justify-center">
                <motion.span
                  key={percentage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-4xl md:text-5xl font-light tracking-tighter text-white font-mono"
                >
                  {percentage}%
                </motion.span>
                <span className="text-[9px] tracking-widest text-neutral-500 font-mono font-bold mt-1 uppercase">
                  {percentage === 100 ? "READY" : "LOADING"}
                </span>
              </div>
            </div>

            {/* Active Sub-system Indicator */}
            <div className="mt-8 text-center max-w-sm h-12 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentAssetName}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-neutral-400 font-light truncate px-4"
                >
                  {currentAssetName}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom status and tech keywords */}
          <div className="w-full max-w-md flex flex-col items-center gap-6 z-10 mb-6">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 bg-teal-400 rounded-full animate-ping" />
              <span className="text-[10px] tracking-[0.25em] font-bold text-teal-400 font-mono">
                {getStatusMessage()}
              </span>
            </div>

            {/* Visual Checklist Icons */}
            <div className="flex items-center justify-center gap-6 border-t border-white/5 pt-6 w-full">
              <div className={`flex flex-col items-center gap-1.5 transition-opacity duration-300 ${percentage >= 25 ? "opacity-100 text-teal-400" : "opacity-30 text-neutral-500"}`}>
                <Camera className="w-4 h-4" />
                <span className="text-[8px] tracking-wider font-mono uppercase">Optics</span>
              </div>
              <div className={`flex flex-col items-center gap-1.5 transition-opacity duration-300 ${percentage >= 50 ? "opacity-100 text-indigo-400" : "opacity-30 text-neutral-500"}`}>
                <Cpu className="w-4 h-4" />
                <span className="text-[8px] tracking-wider font-mono uppercase">Compute</span>
              </div>
              <div className={`flex flex-col items-center gap-1.5 transition-opacity duration-300 ${percentage >= 75 ? "opacity-100 text-cyan-400" : "opacity-30 text-neutral-500"}`}>
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[8px] tracking-wider font-mono uppercase">Shield</span>
              </div>
              <div className={`flex flex-col items-center gap-1.5 transition-opacity duration-300 ${percentage >= 100 ? "opacity-100 text-amber-400" : "opacity-30 text-neutral-500"}`}>
                <Sparkles className="w-4 h-4" />
                <span className="text-[8px] tracking-wider font-mono uppercase">System</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
