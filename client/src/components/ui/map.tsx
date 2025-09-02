import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40IDAgMjUgNS42IDI1IDEyLjVDMjUgMTkuNCAyMC40IDI1IDE1IDI1QzE0LjMgMjguMSAxMyAzMC44IDExLjIgMzMuMkwxMi41IDQxTDEzLjggMzMuMkMxMiAzMC44IDEwLjcgMjguMSAxMCAyNUM0LjYgMjUgMCAxOS40IDAgMTIuNUMwIDUuNiA1LjYgMCAxMi41IDBaIiBmaWxsPSIjRkY2QjM1Ii8+CjxjaXJjbGUgY3g9IjEyLjUiIGN5PSIxMi41IiByPSI3LjUiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40IDAgMjUgNS42IDI1IDEyLjVDMjUgMTkuNCAyMC40IDI1IDE1IDI1QzE0LjMgMjguMSAxMyAzMC44IDExLjIgMzMuMkwxMi41IDQxTDEzLjggMzMuMkMxMiAzMC44IDEwLjcgMjguMSAxMCAyNUM0LjYgMjUgMCAxOS40IDAgMTIuNUMwIDUuNiA1LjYgMCAxMi41IDBaIiBmaWxsPSIjRkY2QjM1Ii8+CjxjaXJjbGUgY3g9IjEyLjUiIGN5PSIxMi41IiByPSI3LjUiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
  shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIyMC41IiByeD0iMjAuNSIgcnk9IjIwLjUiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4K',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
    if (!mapRef.current) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize map with proper container sizing
    const map = L.map(mapRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      touchZoom: true
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      tileSize: 256,
      zoomOffset: 0
    }).addTo(map);

    // Store map instance
    mapInstanceRef.current = map;

    // Fix map size after initialization
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 100);

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
        html: `<div style="background-color: #FF6B35; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          ${location.icon}
        </div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([location.lat, location.lng], { icon })
        .addTo(map)
        .bindPopup(`<div style="font-family: sans-serif;"><strong style="color: #FF6B35;">${location.name}</strong><br/>Type: ${location.type}<br/>📍 Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</div>`);
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
      }).addTo(map).bindPopup('<strong>👨 Male Devotees Path</strong><br/>⏱️ Estimated Time: 45 min<br/>👥 Current Wait: High');

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
      }).addTo(map).bindPopup('<strong>👩 Female Devotees Path</strong><br/>⏱️ Estimated Time: 35 min<br/>👥 Current Wait: Medium');

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
      }).addTo(map).bindPopup('<strong>🧓 Senior Citizens Path</strong><br/>⏱️ Estimated Time: 25 min<br/>🚀 Priority Access Available');
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
        html: `<div style="background-color: ${color}; color: white; width: ${size}px; height: ${size}px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 20px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; animation: pulse 2s infinite;">
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
        html: `<div style="background-color: ${facilityColors[facility.type] || '#6B7280'}; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
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

    // Call onMapReady if provided
    if (onMapReady) {
      onMapReady(map);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, showPaths, showHeatmap, JSON.stringify(crowdData), JSON.stringify(facilityData)]);

  return <div ref={mapRef} className={className} style={{ minHeight: '400px', width: '100%', zIndex: 1 }} data-testid="interactive-map" />;
}