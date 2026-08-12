import React, { useState } from "react";
import { Zap, ShieldCheck, Eye, Camera, Cpu, Sparkles, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
 
export default function SpecsOverview() {
  const [activeTab, setActiveTab] = useState<"camera" | "durability" | "display" | "performance" | "tecno_ai" | "hios">("camera");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
 
  const specCategories = {
    camera: {
      title: "PRO OPTICS ENGINE",
      icon: <Camera className="w-4 h-4 text-cyan-400" />,
      image: "/assets/images-image-card-1-1.jpg.webp",
      items: [
        { label: "Main Sensor", value: "Sony LYTIA-700C" },
        { label: "Lens Count", value: "Triple 50MP Array" },
        { label: "Stabilization", value: "Dual Hardware OIS" },
        { label: "Front Camera", value: "50MP Ultra-Selfie" }
      ],
      detail: "Incorporating advanced 1.0 µm photodiode capture, the LYTIA stack collects up to 140% more natural luminance compared to standard flagship sensors."
    },
    durability: {
      title: "ATMOSPHERIC SHIELD",
      icon: <ShieldCheck className="w-4 h-4 text-teal-400" />,
      image: "/assets/images-performance-green-1.jpg.webp",
      items: [
        { label: "Submersion Resistance", value: "IP69 Certification" },
        { label: "Thermal Resilience", value: "IP69K Thermal Jets" },
        { label: "Frame Composition", value: "Aero-Grade Titanium Core" },
        { label: "Glass Shield", value: "Gorilla Glass Armor" }
      ],
      detail: "Engineered with dynamic rubberized fluid gaskets and a carbon-welded chassis, rendering the phone fully dust-tight and immune to high-pressure washdowns."
    },
    display: {
      title: "IMMERSIVE CURVE DISPLAY",
      icon: <Eye className="w-4 h-4 text-blue-400" />,
      image: "/assets/images-CN5C-design-tap_poster-1.jpg.webp",
      items: [
        { label: "Refresh Rate", value: "120Hz Fluid Motion" },
        { label: "Panel Technology", value: "Curved AMOLED 1.5K" },
        { label: "Luminance Peak", value: "1500 nits Peak" },
        { label: "Color Depth", value: "10-Bit Wide Spectrum" }
      ],
      detail: "A dramatic 6.78-inch boundless curvature wraps gracefully into the metal alloy bezel, bringing cinematic projection right into the palm of your hand."
    },
    performance: {
      title: "PRO CO-PROCESSING CPU",
      icon: <Cpu className="w-4 h-4 text-indigo-400" />,
      image: "/assets/images-CN5C-performance-chip-1.jpg.webp",
      items: [
        { label: "Main Processor", value: "Dimensity Ultra-Flagship" },
        { label: "Lithography", value: "4nm Advanced Process" },
        { label: "Memory Peak", value: "16GB + 16GB Extended" },
        { label: "Thermal Tech", value: "Fluid Vapor Chamber" }
      ],
      detail: "Powered by the ultimate 4nm platform for lightning-fast loads, maximum frame rate stability in modern heavy gaming, and advanced background memory caching."
    },
    tecno_ai: {
      title: "TECNO NEURAL LOGIC",
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      image: "/assets/images-CN5C-ai-swiper-4-1.png.webp",
      items: [
        { label: "Smart Eraser", value: "AI Object Magic Eraser" },
        { label: "Photography", value: "AI Ambient Relighting" },
        { label: "Translation", value: "Real-time Voice & Text" },
        { label: "Efficiency", value: "Dynamic Neural Allocation" }
      ],
      detail: "Adaptive deep learning models run locally on our neural co-processor to instantly enrich user photos, eliminate clutter, and translate multi-lingual audio dialogues."
    },
    hios: {
      title: "HiOS 15 SYSTEM SPACE",
      icon: <Layers className="w-4 h-4 text-amber-400" />,
      image: "/assets/images-os-logo-1.png.webp",
      items: [
        { label: "Interface", value: "Smart Dynamic Island" },
        { label: "Security", value: "Private Safe 2.0 Encrypted" },
        { label: "Customization", value: "Dynamic Widget Layouts" },
        { label: "Fluidity Tech", value: "System-level Defragmenter" }
      ],
      detail: "The legendary customized OS brings beautiful fluid animations, private encrypted folders, customizable desktop cards, and intelligent notch system status trackers."
    }
  };

  const activeCategory = specCategories[activeTab];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div
      id="specs-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
      className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-white/5 bg-gradient-to-b from-transparent to-neutral-950/90 text-white"
    >
      <div className="text-center md:text-left mb-16">
        <motion.span variants={itemVariants} className="text-[11px] font-semibold tracking-[0.3em] text-cyan-400 uppercase mb-3 block">
          HARDWARE REVOLUTION
        </motion.span>
        <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-light tracking-tight text-white mb-4">
          Engineered without compromise.
        </motion.h2>
        <motion.p variants={itemVariants} className="text-sm text-neutral-400 max-w-lg leading-relaxed font-light">
          A symbiotic union of high-precision materials and computational co-processing to elevate every daily interaction.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Navigation Tabs */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col space-y-2 justify-center">
          {(Object.keys(specCategories) as Array<keyof typeof specCategories>).map((key) => {
            const cat = specCategories[key];
            const isSelected = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="w-full text-left flex items-center justify-between p-5 rounded-xl border transition-all duration-300"
                style={{
                  borderColor: isSelected ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.02)",
                  backgroundColor: isSelected ? "rgba(255, 255, 255, 0.03)" : "transparent",
                }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: isSelected ? "rgba(255, 255, 255, 0.05)" : "transparent"
                    }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <span
                      className="text-xs tracking-widest uppercase font-mono block transition-colors"
                      style={{
                        color: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.45)"
                      }}
                    >
                      {cat.title}
                    </span>
                  </div>
                </div>
                <div
                  className="w-1.5 h-1.5 rounded-full transition-transform duration-300"
                  style={{
                    backgroundColor: isSelected ? "#06b6d4" : "transparent",
                    transform: isSelected ? "scale(1.5)" : "scale(1)"
                  }}
                />
              </button>
            );
          })}
        </motion.div>

        {/* Dynamic Display panel */}
        <motion.div variants={itemVariants} className="lg:col-span-8 border border-white/10 rounded-2xl p-8 bg-neutral-900/50 backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row gap-8 justify-between items-stretch min-h-[380px]">
          {/* Accent lighting sweep inside card */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none" />

          {/* Left specification data sheet side */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 mb-6 font-mono text-[11px] tracking-widest uppercase">
                {activeCategory.icon}
                <span>SPECIFICATION DATA SHEET</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {activeCategory.items.map((item, idx) => (
                  <div key={idx} className="border-b border-white/5 pb-4">
                    <span className="text-xs text-neutral-400 font-light block mb-1">
                      {item.label}
                    </span>
                    <span className="text-lg font-light text-white block">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-4">
              <span className="text-[11px] text-cyan-400 tracking-widest uppercase font-mono block mb-2">
                COMPUTATIONAL NOTES
              </span>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                {activeCategory.detail}
              </p>
            </div>
          </div>

          {/* Right beautifully framed phone image side */}
          <div className="w-full md:w-[240px] flex items-center justify-center relative min-h-[220px] md:min-h-auto rounded-xl bg-white/[0.01] border border-white/5 p-4 overflow-hidden group">
            {/* Soft inner glow backlighting the phone preview */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-60 pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {failedImages[activeTab] ? (
                <motion.div
                  key={`fallback-${activeTab}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-4 text-center rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-950 flex items-center justify-center border border-cyan-500/20 mb-3">
                    {activeCategory.icon}
                  </div>
                  <span className="text-[10px] tracking-[0.3em] text-cyan-400 font-mono uppercase mb-2">
                    {activeCategory.title}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Upload file as:
                    <br />
                    <code className="text-cyan-300 font-mono block mt-1">
                      {activeCategory.image.split("/").pop()}
                    </code>
                  </span>
                </motion.div>
              ) : (
                <motion.img
                  key={activeTab}
                  src={activeCategory.image}
                  alt={activeCategory.title}
                  initial={{ opacity: 0, scale: 0.85, y: 15 }}
                  animate={{ opacity: 1, scale: 1.0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -15 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="max-w-[150px] max-h-[240px] md:max-h-[300px] object-contain relative z-10 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
                  referrerPolicy="no-referrer"
                  onError={() => setFailedImages((prev) => ({ ...prev, [activeTab]: true }))}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
