import React from "react";

interface BauhausCompositionProps {
  className?: string;
  compact?: boolean;
}

/**
 * Geometric Bauhaus composition anchored to the SeedIQ palette:
 * #000000 canvas, #D6E3E4 cool mist, #31CB53 emerald, #F6FF81 electric lime.
 */
export const BauhausComposition: React.FC<BauhausCompositionProps> = ({
  className = "",
  compact = false,
}) => {
  return (
    <div
      className={`select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 360 360"
        className={`w-full h-auto ${compact ? "max-w-[220px]" : "max-w-[340px]"}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Row 1 */}
        {/* Top-left double downward semi-circles (Cool Mist #D6E3E4) */}
        <path d="M0 0 H120 A60 60 0 0 1 0 0 Z" fill="#D6E3E4" />
        <path d="M0 0 A60 60 0 0 0 120 0 H0 Z" fill="#D6E3E4" />
        <path d="M0 60 A60 60 0 0 0 120 60 H0 Z" fill="#D6E3E4" />

        {/* Top-center double downward semi-circles (Cool Mist #D6E3E2) */}
        <path d="M120 0 A60 60 0 0 0 240 0 H120 Z" fill="#D6E3E2" />
        <path d="M120 60 A60 60 0 0 0 240 60 H120 Z" fill="#D6E3E2" />

        {/* Top-right rounded teardrop / corner arch (Lime #F6FF81) */}
        <path
          d="M240 60 C240 26.86 266.86 0 300 0 C333.14 0 360 26.86 360 60 V120 H240 V60 Z"
          fill="#F6FF81"
        />

        {/* Row 2 */}
        {/* Mid-left quarter circle (Lime #F6FF81) */}
        <path d="M0 240 A120 120 0 0 1 120 120 V240 H0 Z" fill="#F6FF81" />

        {/* Mid-center paired vertical semi-circles (Emerald #31CB53) */}
        <path d="M180 120 A60 60 0 0 0 180 240 V120 Z" fill="#31CB53" />
        <path d="M240 120 A60 60 0 0 0 240 240 V120 Z" fill="#31CB53" />

        {/* Mid-right quarter circle (Lime #F6FF81) */}
        <path d="M240 240 A120 120 0 0 1 360 120 V240 H240 Z" fill="#F6FF81" />

        {/* Row 3 */}
        {/* Bottom-left paired right-facing semi-circles (Emerald #31CB53) */}
        <path d="M0 240 A60 60 0 0 1 0 360 V240 Z" fill="#31CB53" />
        <path d="M60 240 A60 60 0 0 1 60 360 V240 Z" fill="#31CB53" />

        {/* Bottom-center large quarter circle (Emerald #31CB53) */}
        <path d="M120 360 A120 120 0 0 0 240 240 H120 V360 Z" fill="#31CB53" />

        {/* Bottom-right rounded corner leaf (Emerald #31CB53) */}
        <path
          d="M240 240 H300 C333.14 240 360 266.86 360 300 V360 H300 C266.86 360 240 333.14 240 300 V240 Z"
          fill="#31CB53"
        />
      </svg>
    </div>
  );
};
