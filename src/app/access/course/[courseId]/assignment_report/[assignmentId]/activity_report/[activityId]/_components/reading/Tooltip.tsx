import React, { useState, useRef, useEffect } from 'react';

export default function Tooltip(props: { text: any, content: any }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const thRef = useRef(null);
  const tooltipRef = useRef(null);

  // Function to update tooltip position based on the <th> element's position
  const updateTooltipPosition = () => {
    if (thRef.current && tooltipRef.current) {
      // @ts-ignore
      const rect = thRef.current.getBoundingClientRect();
      // @ts-ignore
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      let left = rect.left + window.scrollX + rect.width / 2; // Center X-position

      // Check if tooltip goes beyond the right edge of the viewport
      if (left + tooltipRect.width / 2 > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width / 2 - 10; // Adjust to keep within the right edge, adding some padding
      }
      // Check if tooltip goes beyond the left edge of the viewport
      else if (left - tooltipRect.width / 2 < 0) {
        left = tooltipRect.width / 2 + 10; // Adjust to keep within the left edge, adding some padding
      }

      setTooltipPosition({
        top: rect.top + window.scrollY - 30, // Adjust Y-position above the <th>
        left: left
      });
    }
  };

  useEffect(() => {
    if (showTooltip) {
      updateTooltipPosition();
    }

    // Optionally, reposition on window resize to handle dynamic layout changes
    window.addEventListener('resize', updateTooltipPosition);
    return () => window.removeEventListener('resize', updateTooltipPosition);
  }, [showTooltip]);

  return (
    <th
      ref={thRef}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="cursor-pointer group relative"
    >
      {props.text}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed px-3 py-1 bg-black text-white text-sm rounded-lg z-10"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translateX(-50%)'
          }}
        >
          {props.content}
        </div>
      )}
    </th>
  );
};
