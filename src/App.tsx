import React, { useEffect, useState, useRef } from "react";
import { ActiveScene } from "./types";
import Navigation from "./components/Navigation";
import CinemaCanvas from "./components/CinemaCanvas";
import SceneText from "./components/SceneText";
import SpecsOverview from "./components/SpecsOverview";
import ProductGallery from "./components/ProductGallery";
import CustomCursor from "./components/CustomCursor";
import Preloader from "./components/Preloader";

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeScene, setActiveScene] = useState<ActiveScene>(ActiveScene.HeroIntro);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // High-performance throttle for scroll event
  const isScrollingRef = useRef(false);

  // Prevent scroll interaction while the preloader caches high-resolution assets
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;

      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        // Normalized progress between 0 and 1
        const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
        setScrollProgress(progress);

        // Map scroll percentage to our active scene enum
        if (progress < 0.12) {
          setActiveScene(ActiveScene.HeroIntro);
        } else if (progress < 0.28) {
          setActiveScene(ActiveScene.CameraStory);
        } else if (progress < 0.44) {
          setActiveScene(ActiveScene.Performance);
        } else if (progress < 0.60) {
          setActiveScene(ActiveScene.WaterResistant);
        } else if (progress < 0.74) {
          setActiveScene(ActiveScene.DesignForm);
        } else if (progress < 0.86) {
          setActiveScene(ActiveScene.TecnoAI);
        } else if (progress < 0.95) {
          setActiveScene(ActiveScene.HiOS);
        } else {
          setActiveScene(ActiveScene.FinalOutro);
        }

        isScrollingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoaded]);

  // Track cursor movement for dynamic lighting glare sweeps
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Navigate to specific timeline segments smoothly
  const handleNavigate = (targetProgress: number) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = targetProgress * docHeight;
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth"
    });
  };

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />

      {isLoaded && (
        <div id="launch-app-root" className="min-h-[550vh] bg-[#050505] font-sans text-white overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-300 relative">
          
          {/* Dynamic Background Grid and Ambient Glow Lights of Bold Typography Theme */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Ambient Top Left Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1a2b45] opacity-35 rounded-full blur-[120px]" />
            {/* Ambient Bottom Right Glow */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#4a0e0e] opacity-25 rounded-full blur-[150px]" />
            {/* Math Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-dot-grid" />
          </div>

          {/* Rotating Lateral Ribbons on Sides */}
          <div className="fixed left-[-40px] top-1/2 -translate-y-1/2 rotate-90 z-30 pointer-events-none hidden lg:block">
            <span className="text-[10px] tracking-[1em] font-bold opacity-20 uppercase">EVOLUTION IN EVERY PIXEL</span>
          </div>
          <div className="fixed right-[-40px] top-1/2 -translate-y-1/2 -rotate-90 z-30 pointer-events-none hidden lg:block">
            <span className="text-[10px] tracking-[1em] font-bold opacity-20 uppercase">CINESCAPE 2.0 TECHNOLOGY</span>
          </div>

          {/* Immersive Scroll Progress Bar Indicator at the top of the viewport */}
          <div className="fixed top-0 left-0 w-full h-[3px] bg-white/10 z-[100] pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 transition-all duration-100 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* 1. Desktop custom trailing cursor */}
          <CustomCursor />

          {/* 2. Global Translucent Glass Navigation */}
          <Navigation currentSceneProgress={scrollProgress} onNavigate={handleNavigate} />

          {/* 3. Full-Viewport Sticky Cinematic Visual Canvas (WebGL shader back) */}
          <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
            <CinemaCanvas
              scrollProgress={scrollProgress}
              activeScene={activeScene}
              mouseX={mousePos.x}
              mouseY={mousePos.y}
            />
            {/* Dark film tint overlay to amplify legibility */}
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          </div>

          {/* 4. Cinematic Floating Scrolling Scenes */}
          <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
            <SceneText
              scrollProgress={scrollProgress}
              activeScene={activeScene}
              onNavigate={handleNavigate}
            />
          </div>

          {/* 5. Scroll Spacers to drive progress calculation (creates the timeline) */}
          <div id="timeline-spacers" className="relative z-0 pointer-events-none">
            <div style={{ height: "100vh" }} /> {/* Scene 0: HeroIntro */}
            <div style={{ height: "100vh" }} /> {/* Scene 1: CameraStory */}
            <div style={{ height: "100vh" }} /> {/* Scene 2: Performance */}
            <div style={{ height: "100vh" }} /> {/* Scene 3: WaterResistant */}
            <div style={{ height: "100vh" }} /> {/* Scene 4: DesignForm */}
            <div style={{ height: "100vh" }} /> {/* Scene 5: TecnoAI */}
            <div style={{ height: "100vh" }} /> {/* Scene 6: HiOS */}
            <div style={{ height: "50vh" }} />  {/* Transition buffer */}
          </div>

          {/* 6. Static Interactive Bottom Dashboard Content Section (Scrolls in naturally) */}
          <div className="relative z-20 bg-neutral-950">
            {/* Premium Bento specifications list */}
            <SpecsOverview />

            {/* 3D stacked image perspective gallery */}
            <ProductGallery />

            {/* Cinematic Minimal Footer */}
            <footer className="border-t border-white/5 py-12 px-6 md:px-12 bg-black/40 text-neutral-500 text-xs">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-semibold tracking-[0.3em] text-white/50 font-mono uppercase">
                    TECNO
                  </span>
                  <span className="text-neutral-800">|</span>
                  <p>© 2026 TECNO Mobile. All Rights Reserved.</p>
                </div>
                
                <div className="flex items-center space-x-6">
                  <button onClick={() => handleNavigate(0)} className="hover:text-white transition-colors">Back to top</button>
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
