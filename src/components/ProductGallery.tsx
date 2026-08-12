import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GALLERY_IMAGES = [
  {
    src: "/assets/images-CN5C-design-tap_poster-1.jpg.webp",
    title: "Cinematic Tap Experience",
    desc: "A dramatic 120Hz curved display calibrated for high-precision tactile responsiveness."
  },
  {
    src: "/assets/images-CN5C-design-img-green-1.jpg.webp",
    title: "Premium Emerald Finish",
    desc: "The vibrant, organic textured back of the CAMON 50 Pro capturing rich light sweeps."
  },
  {
    src: "/assets/images-image-card-1-1.jpg.webp",
    title: "Perfect Snap Optic Zoom",
    desc: "Unrivaled focal precision powered by the custom Sony LYTIA lens sensor stack."
  },
  {
    src: "/assets/images-CN5C-performance-chip-1.jpg.webp",
    title: "Flagship Co-Processing",
    desc: "High-compute motherboard engine managing AI frame rates and camera enhancements."
  },
  {
    src: "/assets/images-CN5C-performance-bg-4-1.jpg.webp",
    title: "Ultra-Endurance Matrix",
    desc: "Sleek, slim form factor seamlessly containing a massive 6500mAh energy reserve."
  },
  {
    src: "/assets/images-performance-green-1.jpg.webp",
    title: "Atmospheric Green Shield",
    desc: "Aero-grade core frame certified with dual IP69 and IP69K liquid immersion protection."
  }
];

export default function ProductGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };

  return (
    <div
      id="gallery-section"
      className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-24 text-white overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.3em] text-cyan-400 uppercase mb-3 block">
            OFFICIAL SHOWCASE
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-4">
            Curated perspective.
          </h2>
          <p className="text-sm text-neutral-400 max-w-md font-light leading-relaxed">
            Witness the pristine build quality of the CAMON 50 Pro through high-resolution official imagery.
          </p>
        </div>
        
        {/* Gallery Controls */}
        <div className="flex items-center space-x-3 mt-6 md:mt-0">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-300" />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-neutral-300" />
          </button>
        </div>
      </div>

      {/* 3D Perspective Card Stack */}
      <div className="relative h-[480px] md:h-[540px] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          {GALLERY_IMAGES.map((item, idx) => {
            // Calculate distance index relative to active slide
            let offset = idx - activeIndex;
            // Handle circular wrapping for relative math
            if (offset < -GALLERY_IMAGES.length / 2) {
              offset += GALLERY_IMAGES.length;
            } else if (offset > GALLERY_IMAGES.length / 2) {
              offset -= GALLERY_IMAGES.length;
            }

            const absOffset = Math.abs(offset);
            const isCenter = idx === activeIndex;
            
            // Only show immediate neighbors for visual clutter reduction
            if (absOffset > 2) return null;

            // Compute structural 3D perspective variables
            const scale = 1 - absOffset * 0.15;
            const translateX = offset * 260; // Spread cards horizontally
            const zIndex = 10 - absOffset;
            const rotateY = offset * -15; // Rotate slightly in Y-axis
            const opacity = 1 - absOffset * 0.45;

            return (
              <motion.div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className="absolute w-[280px] h-[380px] md:w-[340px] md:h-[460px] cursor-pointer rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ease-out"
                style={{
                  transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                  zIndex,
                  opacity,
                  pointerEvents: isCenter ? "auto" : "none"
                }}
              >
                {/* Image element with required no-referrer attribute and luxury fallback gradient */}
                {failedImages[idx] ? (
                  <div className="w-full h-full bg-gradient-to-tr from-neutral-900 via-teal-950 to-neutral-900 flex flex-col items-center justify-center p-6 border border-white/5 relative">
                    <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 to-transparent pointer-events-none" />
                    <span className="text-[11px] tracking-[0.4em] text-cyan-400 font-mono uppercase mb-4 opacity-75">
                      TECNO CAMON 50 Pro
                    </span>
                    <div className="w-12 h-[1px] bg-cyan-500/30 mb-4" />
                    <span className="text-xs text-neutral-400 font-light text-center max-w-[200px]">
                      Upload raw file to File Explorer as <code className="text-cyan-300 font-mono">input_file_{idx === 5 ? 5 : idx}.png</code> to reveal
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                    onError={() => setFailedImages((prev) => ({ ...prev, [idx]: true }))}
                  />
                )}

                {/* Info Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-6 transition-opacity duration-500"
                  style={{
                    opacity: isCenter ? 1 : 0
                  }}
                >
                  <span className="text-[10px] tracking-widest text-cyan-400 font-mono uppercase mb-2">
                    {`ASSET 0${idx + 1}`}
                  </span>
                  <h3 className="text-xl font-medium text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
