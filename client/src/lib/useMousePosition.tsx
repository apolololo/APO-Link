import { useState, useEffect } from "react";

export const useMousePosition = () => {
  const [position, setPosition] = useState<{ x: number, y: number }>({ 
    x: 0, 
    y: 0 
  });
  const [isActive, setIsActive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouch) return;
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isActive) setIsActive(true);
    };
    
    const handleMouseDown = () => {
      if (isTouch) return;
      setIsPressed(true);
    };
    
    const handleMouseUp = () => {
      if (isTouch) return;
      setIsPressed(false);
    };
    
    // Support tactile
    const handleTouchStart = (e: TouchEvent) => {
      if (!isTouch) setIsTouch(true);
      const touch = e.touches[0];
      setPosition({ x: touch.clientX, y: touch.clientY });
      setIsActive(true);
      setIsPressed(true);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      setPosition({ x: touch.clientX, y: touch.clientY });
      setIsActive(true);
    };
    
    const handleTouchEnd = () => {
      setIsPressed(false);
      setIsActive(false);
    };
    
    // Événements souris
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    // Événements tactiles
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isActive, isTouch]);
  
  return { ...position, isActive, isPressed };
};
