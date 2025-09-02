import { useEffect, useRef } from "react";
import L from "leaflet";

interface MapProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  onMapReady?: (map: L.Map) => void;
  crowdData?: Array<{
    location: string;
    latitude: string;
    longitude: string;
    crowdCount: number;
    densityLevel: string;
  }>;
  showHeatmap?: boolean;
}

export function Map({ 
  className = "h-96", 
  center = [29.9457, 78.1642], // Haridwar coordinates
  zoom = 13,
  onMapReady,
  crowdData = [],
  showHeatmap = false
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add custom markers for important locations
    const importantLocations = [
      { name: "Har Ki Pauri", lat: 29.9457, lng: 78.1642, type: "ghat" },
      { name: "Chandi Devi Temple", lat: 29.9759, lng: 78.1354, type: "temple" },
      { name: "Mansa Devi Temple", lat: 29.9294, lng: 78.1642, type: "temple" },
      { name: "Maya Devi Temple", lat: 29.9557, lng: 78.1642, type: "temple" },
    ];

    importantLocations.forEach(location => {
      const icon = L.divIcon({
        html: `<div class="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          ${location.type === 'ghat' ? '🕉️' : '🛕'}
        </div>`,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([location.lat, location.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${location.name}</strong><br/>Type: ${location.type}`);
    });

    // Add crowd data markers if provided
    crowdData.forEach(crowd => {
      const lat = parseFloat(crowd.latitude);
      const lng = parseFloat(crowd.longitude);
      
      let color = "#10B981"; // green for low
      if (crowd.densityLevel === "medium") color = "#F59E0B"; // yellow
      else if (crowd.densityLevel === "high") color = "#F97316"; // orange
      else if (crowd.densityLevel === "critical") color = "#EF4444"; // red

      const crowdIcon = L.divIcon({
        html: `<div style="background-color: ${color}" class="rounded-full w-4 h-4 border-2 border-white shadow-lg"></div>`,
        className: 'crowd-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      L.marker([lat, lng], { icon: crowdIcon })
        .addTo(map)
        .bindPopup(`
          <strong>${crowd.location}</strong><br/>
          Crowd Count: ${crowd.crowdCount.toLocaleString()}<br/>
          Density: ${crowd.densityLevel}
        `);
    });

    mapInstanceRef.current = map;
    
    if (onMapReady) {
      onMapReady(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, crowdData]);

  return <div ref={mapRef} className={className} data-testid="interactive-map" />;
}
