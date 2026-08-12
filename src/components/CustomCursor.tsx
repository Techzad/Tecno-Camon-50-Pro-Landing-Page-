import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Detect touch device
    const checkMobile = () => {
      setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();

    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Add event listeners to detect clickable hover triggers
    const addHoverListeners = () => {
      const clickables = document.querySelectorAll('button, a, [role="button"], .cursor-pointer');
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovered(true));
        el.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Initial listener set
    addHoverListeners();

    // Create custom observer to keep elements in sync
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();
    };
  }, [isMobile]);

  // Handle smooth trailing physics
  useEffect(() => {
    if (isMobile || !isVisible) return;

    let reqId: number;
    const updateTrail = () => {
      setTrailPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Lag coefficient (0.15 represents optimal fluid damping)
        return {
          x: prev.x + dx * 0.16,
          y: prev.y + dy * 0.16
        };
      });
      reqId = requestAnimationFrame(updateTrail);
    };
    reqId = requestAnimationFrame(updateTrail);

    return () => cancelAnimationFrame(reqId);
  }, [position, isMobile, isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* Center pinpoint */}
      <div
        className="fixed pointer-events-none z-50 w-1.5 h-1.5 bg-cyan-400 rounded-full mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) ${isHovered ? "scale(0.5)" : "scale(1)"}`
        }}
      />
      {/* Soft lagging halo */}
      <div
        className="fixed pointer-events-none z-50 border border-cyan-400/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
        style={{
          left: `${trailPosition.x}px`,
          top: `${trailPosition.y}px`,
          width: isHovered ? "44px" : "28px",
          height: isHovered ? "44px" : "28px",
          backgroundColor: isHovered ? "rgba(6, 182, 212, 0.08)" : "transparent",
          borderColor: isHovered ? "rgba(6, 182, 212, 0.7)" : "rgba(6, 182, 212, 0.35)",
          transform: "translate(-50%, -50%)"
        }}
      />
    </>
  );
}
