import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface TiltingCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltingCard({ children, className = '', maxTilt = 16 }: TiltingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for normalized cursor coordinates (-1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for rotation
  const springConfig = { damping: 18, stiffness: 240, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-maxTilt, maxTilt]), springConfig);

  // Glare position
  const glareX = useSpring(useTransform(mouseX, [-1, 1], [10, 90]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-1, 1], [10, 90]), springConfig);

  const updateCoordinates = useCallback((clientX: number, clientY: number) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Coordinate relative to card center (-1 to 1)
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    const xPct = Math.max(-1, Math.min(1, (relX / width) * 2 - 1));
    const yPct = Math.max(-1, Math.min(1, (relY / height) * 2 - 1));

    mouseX.set(xPct);
    mouseY.set(yPct);
    setIsHovered(true);
  }, [mouseX, mouseY]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updateCoordinates(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="w-full flex items-center justify-center select-none"
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={handleLeave}
        onTouchStart={(e) => {
          setIsHovered(true);
          if (e.touches.length > 0) {
            updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleLeave}
        onTouchCancel={handleLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full cursor-grab active:cursor-grabbing will-change-transform ${className}`}
      >
        {/* Dynamic 3D Glare effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 rounded-[32px] overflow-hidden transition-opacity duration-300"
          style={{ opacity: isHovered ? 0.45 : 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([x, y]) =>
                  `radial-gradient(circle 350px at ${x}% ${y}%, rgba(255, 255, 255, 0.25), transparent 75%)`
              ),
            }}
          />
        </motion.div>

        {/* Inner Card Content with subtle 3D translation */}
        <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
