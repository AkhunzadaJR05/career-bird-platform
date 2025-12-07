"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { GlobeMethods } from "react-globe.gl";

// Dynamically import Globe with SSR disabled
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface Globe3DProps {
  searchQuery?: string;
  onGlobeReady?: (globeRef: GlobeMethods) => void;
  onCityClick?: (city: string) => void;
}

// Hardcoded arc data: Source (Pakistan/India) to Destinations
const mobilityArcs = [
  // Pakistan to Germany
  { startLat: 30.3753, startLng: 69.3451, endLat: 48.1351, endLng: 11.5820 },
  // Pakistan to USA (Boston)
  { startLat: 30.3753, startLng: 69.3451, endLat: 42.3601, endLng: -71.0589 },
  // Pakistan to UK
  { startLat: 30.3753, startLng: 69.3451, endLat: 51.5074, endLng: -0.1278 },
  // Pakistan to Saudi Arabia
  { startLat: 30.3753, startLng: 69.3451, endLat: 24.7136, endLng: 46.6753 },
  // India to Germany
  { startLat: 20.5937, startLng: 78.9629, endLat: 48.1351, endLng: 11.5820 },
  // India to USA (Boston)
  { startLat: 20.5937, startLng: 78.9629, endLat: 42.3601, endLng: -71.0589 },
  // India to UK
  { startLat: 20.5937, startLng: 78.9629, endLat: 51.5074, endLng: -0.1278 },
  // India to Saudi Arabia
  { startLat: 20.5937, startLng: 78.9629, endLat: 24.7136, endLng: 46.6753 },
  // Pakistan to Singapore
  { startLat: 30.3753, startLng: 69.3451, endLat: 1.3521, endLng: 103.8198 },
  // India to Singapore
  { startLat: 20.5937, startLng: 78.9629, endLat: 1.3521, endLng: 103.8198 },
];

// Radar ring coordinates (opportunities) - also used for labels
const radarRings = [
  { lat: 48.1351, lng: 11.5820, label: "Munich" }, // Germany
  { lat: 42.3601, lng: -71.0589, label: "Boston" }, // USA
  { lat: 24.7136, lng: 46.6753, label: "Riyadh" }, // Saudi Arabia
  { lat: 1.3521, lng: 103.8198, label: "Singapore" },
];

export default function Globe3D({ searchQuery, onGlobeReady, onCityClick }: Globe3DProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [rings, setRings] = useState<Array<{ lat: number; lng: number; id: number; maxRadius: number }>>([]);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotation effect
  useEffect(() => {
    if (!globeRef.current) return;

    if (isAutoRotating && !hoveredLabel) {
      // Start auto-rotation
      rotationIntervalRef.current = setInterval(() => {
        if (globeRef.current) {
          const currentPOV = globeRef.current.pointOfView();
          if (currentPOV) {
            globeRef.current.pointOfView(
              {
                lat: currentPOV.lat,
                lng: (currentPOV.lng || 0) + 0.5,
                altitude: currentPOV.altitude,
              },
              0
            );
          }
        }
      }, 50);
    } else {
      // Stop auto-rotation
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
        rotationIntervalRef.current = null;
      }
    }

    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
    };
  }, [isAutoRotating, hoveredLabel]);

  // Generate radar rings with ripple animation using ringsData
  useEffect(() => {
    const ringInterval = setInterval(() => {
      radarRings.forEach((ring) => {
        const newRing = {
          lat: ring.lat,
          lng: ring.lng,
          id: Date.now() + Math.random(),
          maxRadius: 0,
        };
        setRings((prev) => [...prev, newRing]);

        // Animate the ring expanding
        let radius = 0;
        const animateRing = () => {
          radius += 0.5;
          setRings((prev) =>
            prev.map((r) =>
              r.id === newRing.id
                ? { ...r, maxRadius: Math.min(radius, 20) }
                : r
            )
          );

          if (radius < 20) {
            requestAnimationFrame(animateRing);
          } else {
            // Remove ring after animation completes
            setTimeout(() => {
              setRings((prev) => prev.filter((r) => r.id !== newRing.id));
            }, 500);
          }
        };

        requestAnimationFrame(animateRing);
      });
    }, 2000); // Create new rings every 2 seconds

    return () => clearInterval(ringInterval);
  }, []);

  // Set initial camera position
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 0);
    }
  }, []);

  // Expose globe ref
  useEffect(() => {
    if (globeRef.current && onGlobeReady) {
      onGlobeReady(globeRef.current);
    }
  }, [onGlobeReady]);

  // Track mouse position for tooltip
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle label hover
  const handleLabelHover = (label: any, prevLabel: any) => {
    if (label) {
      setHoveredLabel(label.text);
      setIsAutoRotating(false);
      
      // Show tooltip at current mouse position
      setTooltip({
        x: mousePos.x,
        y: mousePos.y,
        text: `Click to view grants in ${label.text}`,
      });
    } else {
      setHoveredLabel(null);
      setIsAutoRotating(true);
      setTooltip(null);
    }
  };

  // Handle label click
  const handleLabelClick = (label: any) => {
    if (label && onCityClick) {
      onCityClick(label.text);
    }
  };


  return (
    <div className="h-full w-full relative">
      <Globe
        ref={globeRef}
        // Night Earth texture with city lights (keeping night for holographic effect)
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        // Transparent background
        backgroundColor="rgba(0,0,0,0)"
        // Atmosphere with blue/teal glow - increased for stronger hologram effect
        showAtmosphere={true}
        atmosphereColor="#06b6d4"
        atmosphereAltitude={0.25}
        // Animated arcs with gradient colors
        arcsData={mobilityArcs}
        arcStartLat={(d: any) => d.startLat}
        arcStartLng={(d: any) => d.startLng}
        arcEndLat={(d: any) => d.endLat}
        arcEndLng={(d: any) => d.endLng}
        arcColor={() => {
          // Gradient from orange (source) to teal (destination)
          return ["rgba(251, 146, 60, 0.8)", "rgba(6, 182, 212, 0.8)"];
        }}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={3000}
        arcStroke={2}
        arcCurveResolution={64}
        // Radar rings with ripple effect
        ringsData={rings}
        ringLat={(d: any) => d.lat}
        ringLng={(d: any) => d.lng}
        ringMaxRadius={(d: any) => d.maxRadius}
        ringColor={() => (t: number) => `rgba(6, 182, 212, ${1 - t})`}
        ringResolution={32}
        // Labels for cities
        labelsData={radarRings}
        labelLat={(d: any) => d.lat}
        labelLng={(d: any) => d.lng}
        labelText={(d: any) => d.label}
        labelSize={(d: any) => hoveredLabel === d.label ? 2.0 : 1.5}
        labelDotRadius={(d: any) => hoveredLabel === d.label ? 0.7 : 0.5}
        labelColor={(d: any) => hoveredLabel === d.label ? "#ffffff" : "#06b6d4"}
        labelResolution={2}
        onLabelHover={handleLabelHover}
        onLabelClick={handleLabelClick}
      />
      
      {/* Custom Tooltip */}
      {tooltip && (
        <div
          className="fixed pointer-events-none z-50 bg-[#0B0F19]/95 backdrop-blur-md border border-teal-500/30 rounded-lg px-4 py-2 text-white text-sm shadow-lg"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 10}px`,
            transform: "translateY(-100%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
