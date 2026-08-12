import React from "react";

interface NavigationProps {
  currentSceneProgress: number;
  onNavigate: (progressTarget: number) => void;
}

export default function Navigation({ currentSceneProgress, onNavigate }: NavigationProps) {
  // Navigation links mapped to their target scroll percentage
  const navItems = [
    { label: "CAMON 50 Pro", target: 0.05 },
    { label: "Camera", target: 0.20 },
    { label: "Performance", target: 0.36 },
    { label: "Water Resistant", target: 0.52 },
    { label: "Design", target: 0.68 },
    { label: "TECNO AI", target: 0.81 },
    { label: "HiOS", target: 0.92 }
  ];

  return (
    <nav
      id="main-nav-bar"
      className="fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-transparent py-4 px-6 md:px-12"
      style={{
        backgroundColor: currentSceneProgress > 0.05 ? "rgba(4, 4, 6, 0.45)" : "transparent",
        backdropFilter: currentSceneProgress > 0.05 ? "blur(20px)" : "none",
        borderBottomColor: currentSceneProgress > 0.05 ? "rgba(255, 255, 255, 0.04)" : "transparent"
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Official TECNO logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate(0)}>
          <span className="text-sm md:text-base font-semibold tracking-[0.3em] text-white font-mono uppercase">
            TECNO
          </span>
        </div>

        {/* Navigation items */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => {
            // Determine active item based on current scroll segment
            const isActive =
              (item.label === "CAMON 50 Pro" && currentSceneProgress < 0.12) ||
              (item.label === "Camera" && currentSceneProgress >= 0.12 && currentSceneProgress < 0.28) ||
              (item.label === "Performance" && currentSceneProgress >= 0.28 && currentSceneProgress < 0.44) ||
              (item.label === "Water Resistant" && currentSceneProgress >= 0.44 && currentSceneProgress < 0.60) ||
              (item.label === "Design" && currentSceneProgress >= 0.60 && currentSceneProgress < 0.74) ||
              (item.label === "TECNO AI" && currentSceneProgress >= 0.74 && currentSceneProgress < 0.86) ||
              (item.label === "HiOS" && currentSceneProgress >= 0.86);

            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.target)}
                className="text-[13px] font-medium tracking-[0.15em] uppercase transition-all duration-300 relative py-1 hover:text-white"
                style={{
                  color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.45)"
                }}
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-white scale-x-0 transition-transform duration-300 origin-left"
                  style={{
                    transform: isActive ? "scaleX(1)" : "scaleX(0)"
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onNavigate(0.96)}
          className="border border-white/20 text-white hover:border-white text-[11px] font-semibold uppercase tracking-[0.2em] px-5 py-2 rounded-full transition-all duration-300 bg-white/5 hover:bg-white/10"
        >
          Explore
        </button>
      </div>
    </nav>
  );
}
