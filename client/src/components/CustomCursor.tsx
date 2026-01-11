import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (isMobile) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animateFollower = () => {
      if (followerRef.current) {
        const dx = mousePos.current.x - followerPos.current.x;
        const dy = mousePos.current.y - followerPos.current.y;
        
        followerPos.current.x += dx * 0.1;
        followerPos.current.y += dy * 0.1;
        
        followerRef.current.style.left = `${followerPos.current.x}px`;
        followerRef.current.style.top = `${followerPos.current.y}px`;
      }
      
      animationFrameId = requestAnimationFrame(animateFollower);
    };

    const handleMouseEnter = () => {
      if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.opacity = "1";
        followerRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.opacity = "0";
        followerRef.current.style.opacity = "0";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    animationFrameId = requestAnimationFrame(animateFollower);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return createPortal(
    <>
      <div
        ref={cursorRef}
        className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-50 mix-blend-difference transform -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: 0 }}
      />
      <div
        ref={followerRef}
        className="fixed w-6 h-6 border-2 border-white rounded-full pointer-events-none z-50 mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
        style={{ opacity: 0 }}
      />
    </>,
    document.body
  );
};

export default CustomCursor;