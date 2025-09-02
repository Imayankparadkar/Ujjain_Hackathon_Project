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
    waitTime?: string;
  }>;
  showHeatmap?: boolean;
  showPaths?: boolean;
  facilityData?: Array<{
    type: string;
    name: string;
    latitude: string;
    longitude: string;
    status: string;
  }>;
}

export function Map({ 
  className = "h-96", 
  center = [23.1815, 75.7682], // Ujjain Mahakal coordinates
  zoom = 16,
  onMapReady,
  crowdData = [],
  showHeatmap = false,
  showPaths = false,
  facilityData = []
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

    // Add custom markers for Ujjain Mahakal Lok locations
    const importantLocations = [
      { name: "Mahakaleshwar Temple", lat: 23.1815, lng: 75.7682, type: "temple", icon: "🕉️" },
      { name: "Main Entry Gate", lat: 23.1820, lng: 75.7685, type: "gate", icon: "🚪" },
      { name: "VIP Entry", lat: 23.1810, lng: 75.7680, type: "vip", icon: "👑" },
      { name: "Security Check Point", lat: 23.1822, lng: 75.7683, type: "security", icon: "🛡️" },
      { name: "Queue Management Area", lat: 23.1818, lng: 75.7688, type: "queue", icon: "📋" },
      { name: "Sanctum Sanctorum", lat: 23.1815, lng: 75.7678, type: "sanctum", icon: "🔥" },
    ];

    importantLocations.forEach(location => {
      const icon = L.divIcon({
        html: `<div class="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-white shadow-lg">
          ${location.icon}
        </div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([location.lat, location.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${location.name}</strong><br/>Type: ${location.type}`);
    });

    // Add 3D path visualization for different routes
    if (showPaths) {
      // Male devotees path (Red/Orange)
      const malePath: [number, number][] = [
        [23.1820, 75.7685], // Entry
        [23.1822, 75.7683], // Security
        [23.1818, 75.7681], // Queue
        [23.1816, 75.7679], // Approach
        [23.1815, 75.7678]  // Sanctum
      ];
      
      L.polyline(malePath, {
        color: '#FF6B35',
        weight: 6,
        opacity: 0.8,
        dashArray: '10, 5'
      }).addTo(map).bindPopup('Male Devotees Path - 45 min');

      // Female devotees path (Yellow/Golden)
      const femalePath: [number, number][] = [
        [23.1810, 75.7685], // Female Entry
        [23.1812, 75.7682], // Female Security
        [23.1814, 75.7680], // Female Queue
        [23.1815, 75.7679], // Approach
        [23.1815, 75.7678]  // Sanctum
      ];
      
      L.polyline(femalePath, {
        color: '#FFB74D',
        weight: 6,
        opacity: 0.8,
        dashArray: '15, 5'
      }).addTo(map).bindPopup('Female Devotees Path - 35 min');

      // Senior citizens path (Green)
      const seniorPath: [number, number][] = [
        [23.1825, 75.7680], // Senior Entry
        [23.1823, 75.7679], // Direct Access
        [23.1820, 75.7678], // Priority Queue
        [23.1817, 75.7678], // Assisted Approach
        [23.1815, 75.7678]  // Sanctum
      ];
      
      L.polyline(seniorPath, {
        color: '#4CAF50',
        weight: 5,
        opacity: 0.9,
        dashArray: '5, 10'
      }).addTo(map).bindPopup('Senior Citizens Path - 25 min (Priority)');
    }

    // Add crowd data markers if provided
    crowdData.forEach(crowd => {
      const lat = parseFloat(crowd.latitude);
      const lng = parseFloat(crowd.longitude);
      
      let color = "#10B981"; // green for low
      let size = 20;
      if (crowd.densityLevel === "medium") {
        color = "#F59E0B"; // yellow
        size = 24;
      } else if (crowd.densityLevel === "high") {
        color = "#F97316"; // orange
        size = 28;
      } else if (crowd.densityLevel === "very-high") {
        color = "#EF4444"; // red
        size = 32;
      }

      const crowdIcon = L.divIcon({
        html: `<div style="background-color: ${color}" class="rounded-full border-4 border-white shadow-xl animate-pulse flex items-center justify-center text-white font-bold text-xs" style="width: ${size}px; height: ${size}px;">
          ${Math.round(crowd.crowdCount / 1000)}K
        </div>`,
        className: 'crowd-marker',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });

      L.marker([lat, lng], { icon: crowdIcon })
        .addTo(map)
        .bindPopup(`
          <strong>${crowd.location}</strong><br/>
          Crowd Count: ${crowd.crowdCount.toLocaleString()}<br/>
          Density: ${crowd.densityLevel}<br/>
          ${crowd.waitTime ? `Wait Time: ${crowd.waitTime}` : ''}
        `);
    });

    // Add facility markers
    facilityData.forEach(facility => {
      const lat = parseFloat(facility.latitude);
      const lng = parseFloat(facility.longitude);
      
      const facilityIcons: Record<string, string> = {
        toilet: '🚻',
        medical: '🏥',
        shop: '🛒', 
        food: '🍽️',
        security: '👮',
        emergency: '🚨'
      };
      
      const facilityColors: Record<string, string> = {
        toilet: '#8B5CF6',
        medical: '#EF4444',
        shop: '#3B82F6',
        food: '#10B981',
        security: '#6366F1',
        emergency: '#F59E0B'
      };

      const facilityIcon = L.divIcon({
        html: `<div style="background-color: ${facilityColors[facility.type] || '#6B7280'}" class="rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">
          ${facilityIcons[facility.type] || '📍'}
        </div>`,
        className: 'facility-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([lat, lng], { icon: facilityIcon })
        .addTo(map)
        .bindPopup(`
          <strong>${facility.name}</strong><br/>
          Type: ${facility.type}<br/>
          Status: <span style="color: ${facility.status === 'open' || facility.status === '24x7' ? 'green' : 'red'}">${facility.status}</span>
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
  }, [center, zoom, crowdData, showPaths, facilityData]);

  return <div ref={mapRef} className={className} data-testid="interactive-map" />;
}
