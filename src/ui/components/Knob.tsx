import React, { useRef, useState, useEffect } from 'react';

interface KnobProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (value: number) => void;
  formatValue?: (val: number) => string | number;
}

export const Knob: React.FC<KnobProps> = ({ label, value, min, max, unit = '', onChange, formatValue }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startVal = useRef(value);

  const range = max - min;
  // Calculate percentage for visual rotation (0 to 1)
  const percentage = (value - min) / range;
  // Rotate from -135deg to +135deg
  const rotation = -135 + (percentage * 270);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.clientY;
    startVal.current = value;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = startY.current - e.clientY;

    // Adjust sensitivity: 100px movement = full range
    const sensitivity = 100;
    const deltaVal = (deltaY / sensitivity) * range;

    let newVal = startVal.current + deltaVal;
    newVal = Math.max(min, Math.min(max, newVal));

    // Round to 1 decimal if small range, else integer
    if (range <= 30) {
       newVal = Math.round(newVal * 10) / 10;
    } else {
       newVal = Math.round(newVal);
    }

    if (newVal !== value) {
      onChange(newVal);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Add touch support to prevent scrolling while turning knobs on mobile
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDragging) e.preventDefault();
    };
    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => document.removeEventListener('touchmove', preventScroll);
  }, [isDragging]);

  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div
        className="relative w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.4)] cursor-pointer touch-none flex items-center justify-center"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="w-full h-full rounded-full transition-transform duration-75 ease-out flex justify-center"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-1 h-4 bg-white rounded-full mt-1"></div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{label}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{displayValue}{unit}</div>
      </div>
    </div>
  );
};
