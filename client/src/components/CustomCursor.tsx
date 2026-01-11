import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
        
        setTimeout(() => {
          if (followerRef.current) {
            followerRef.current.style.left = `${e.clientX}px`;
            followerRef.current.style.top = `${e.clientY}px`;
          }
        }, 100);
      }
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

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return createPortal(
    <>
      <div
        ref={cursorRef}
        className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-50 mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      <div
        ref={followerRef}
        className="fixed w-6 h-6 border border-white rounded-full pointer-events-none z-50 mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
    </>,
    document.body
  );
};

export default CustomCursor;