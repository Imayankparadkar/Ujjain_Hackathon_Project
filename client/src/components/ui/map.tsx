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
  selectedRoute?: string;
  userLocation?: {lat: number, lng: number} | null;
  facilityData?: Array<{
    type: string;
    name: string;
    latitude: string;
    longitude: string;
    status: string;
  }>;
  ghatData?: Array<{
    name: string;
    latitude: string;
    longitude: string;
    type: string;
    capacity: number;
    currentOccupancy: number;
    facilities: string[];
  }>;
  onLocationClick?: (location: any) => void;
}

export function Map({ 
  className = "h-96", 
  center = [23.1815, 75.7682], // Ujjain Mahakal coordinates
  zoom = 16,
  onMapReady,
  crowdData = [],
  showHeatmap = false,
  showPaths = false,
  selectedRoute = "all",
  userLocation = null,
  facilityData = [],
  ghatData = [],
  onLocationClick
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

    // Enhanced routing system with ghat endpoints
    if (showPaths) {
      // Define ghat locations as common endpoints
      const ghatLocations = {
        mainGhat: [23.1800, 75.7670] as [number, number], // Main bathing ghat
        femaleGhat: [23.1795, 75.7675] as [number, number], // Female-only ghat
        seniorGhat: [23.1805, 75.7665] as [number, number], // Senior citizens ghat
        familyGhat: [23.1798, 75.7672] as [number, number]  // Family ghat
      };

      // Male devotees path to Main Ghat
      const malePath: [number, number][] = [
        [23.1820, 75.7685], // Male Entry
        [23.1822, 75.7683], // Security Check
        [23.1818, 75.7681], // Queue Management
        [23.1816, 75.7679], // Temple Approach
        [23.1815, 75.7678], // Sanctum Sanctorum
        [23.1810, 75.7675], // Ghat Approach
        ghatLocations.mainGhat  // Main Ghat (Bathing Area)
      ];
      
      // Female devotees path to Female Ghat
      const femalePath: [number, number][] = [
        [23.1810, 75.7685], // Female Entry
        [23.1812, 75.7682], // Female Security
        [23.1814, 75.7680], // Female Queue
        [23.1815, 75.7679], // Temple Approach
        [23.1815, 75.7678], // Sanctum Sanctorum
        [23.1808, 75.7673], // Female Ghat Approach
        ghatLocations.femaleGhat  // Female Ghat (Bathing Area)
      ];

      // Senior citizens path to Senior Ghat
      const seniorPath: [number, number][] = [
        [23.1825, 75.7680], // Senior Entry
        [23.1823, 75.7679], // Direct Access
        [23.1820, 75.7678], // Priority Queue
        [23.1817, 75.7678], // Assisted Approach
        [23.1815, 75.7678], // Sanctum Sanctorum
        [23.1812, 75.7670], // Senior Ghat Approach
        ghatLocations.seniorGhat  // Senior Ghat (Bathing Area)
      ];

      // Family path to Family Ghat
      const familyPath: [number, number][] = [
        [23.1815, 75.7690], // Family Entry
        [23.1817, 75.7687], // Family Security
        [23.1816, 75.7684], // Family Queue
        [23.1815, 75.7681], // Temple Approach
        [23.1815, 75.7678], // Sanctum Sanctorum
        [23.1805, 75.7673], // Family Ghat Approach
        ghatLocations.familyGhat  // Family Ghat (Bathing Area)
      ];

      // Show paths based on selected route
      if (selectedRoute === 'all' || selectedRoute === 'male') {
        const malePolyline = L.polyline(malePath, {
          color: '#FF6B35',
          weight: 8,
          opacity: 0.9,
          dashArray: '10, 5'
        }).addTo(map);
        
        malePolyline.bindPopup('<div style="padding: 10px;"><strong>👨 Male Devotees Path to Main Ghat</strong><br/>⏱️ Total Time: 55 min (Temple: 45 min + Ghat: 10 min)<br/>👥 Current Wait: High<br/>🛁 Ends at: Main Bathing Ghat<br/><button onclick="alert(\'Navigate to Male Route\')" style="background: #FF6B35; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Select This Route</button></div>');
      }

      if (selectedRoute === 'all' || selectedRoute === 'female') {
        const femalePolyline = L.polyline(femalePath, {
          color: '#FFB74D',
          weight: 8,
          opacity: 0.9,
          dashArray: '15, 5'
        }).addTo(map);
        
        femalePolyline.bindPopup('<div style="padding: 10px;"><strong>👩 Female Devotees Path to Female Ghat</strong><br/>⏱️ Total Time: 45 min (Temple: 35 min + Ghat: 10 min)<br/>👥 Current Wait: Medium<br/>🛁 Ends at: Female-Only Bathing Ghat<br/>👮‍♀️ Female Security Present<br/><button onclick="alert(\'Navigate to Female Route\')" style="background: #FFB74D; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Select This Route</button></div>');
      }

      if (selectedRoute === 'all' || selectedRoute === 'elderly') {
        const seniorPolyline = L.polyline(seniorPath, {
          color: '#4CAF50',
          weight: 6,
          opacity: 0.9,
          dashArray: '5, 10'
        }).addTo(map);
        
        seniorPolyline.bindPopup('<div style="padding: 10px;"><strong>🧓 Senior Citizens Path to Senior Ghat</strong><br/>⏱️ Total Time: 35 min (Temple: 25 min + Ghat: 10 min)<br/>🚀 Priority Access Available<br/>🛁 Ends at: Senior Citizens Ghat<br/>♿ Wheelchair Accessible<br/>🏥 Medical Support Available<br/><button onclick="alert(\'Navigate to Senior Route\')" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Select This Route</button></div>');
      }

      if (selectedRoute === 'all' || selectedRoute === 'family') {
        const familyPolyline = L.polyline(familyPath, {
          color: '#9C27B0',
          weight: 7,
          opacity: 0.9,
          dashArray: '20, 5'
        }).addTo(map);
        
        familyPolyline.bindPopup('<div style="padding: 10px;"><strong>👨‍👩‍👧‍👦 Family Path to Family Ghat</strong><br/>⏱️ Total Time: 50 min (Temple: 40 min + Ghat: 10 min)<br/>👥 Current Wait: Medium<br/>🛁 Ends at: Family Bathing Ghat<br/>👶 Child-Friendly Facilities<br/><button onclick="alert(\'Navigate to Family Route\')" style="background: #9C27B0; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Select This Route</button></div>');
      }
    }

    // Add ghat areas with enhanced markers
    ghatData.forEach(ghat => {
      const lat = parseFloat(ghat.latitude);
      const lng = parseFloat(ghat.longitude);
      
      let ghatColor = "#2196F3"; // Blue for water
      if (ghat.type === 'female') ghatColor = "#FFB74D";
      if (ghat.type === 'senior') ghatColor = "#4CAF50";
      if (ghat.type === 'family') ghatColor = "#9C27B0";
      
      const occupancyRate = (ghat.currentOccupancy / ghat.capacity) * 100;
      let statusColor = "#4CAF50";
      if (occupancyRate > 80) statusColor = "#F44336";
      else if (occupancyRate > 60) statusColor = "#FF9800";
      
      const ghatIcon = L.divIcon({
        html: `<div style="background: linear-gradient(45deg, ${ghatColor}, #E3F2FD); color: white; width: 45px; height: 45px; border-radius: 50%; border: 3px solid ${statusColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; cursor: pointer; animation: ripple 3s infinite;">
          🛁
        </div>`,
        className: 'ghat-marker',
        iconSize: [45, 45],
        iconAnchor: [22.5, 22.5]
      });

      const marker = L.marker([lat, lng], { icon: ghatIcon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 15px; font-family: sans-serif;">
            <h3 style="color: ${ghatColor}; margin: 0 0 10px 0;">${ghat.name}</h3>
            <div style="margin-bottom: 8px;"><strong>Type:</strong> ${ghat.type} bathing area</div>
            <div style="margin-bottom: 8px;"><strong>Capacity:</strong> ${ghat.capacity} people</div>
            <div style="margin-bottom: 8px;"><strong>Current Occupancy:</strong> <span style="color: ${statusColor}">${ghat.currentOccupancy} (${occupancyRate.toFixed(0)}%)</span></div>
            <div style="margin-bottom: 10px;"><strong>Facilities:</strong> ${ghat.facilities.join(', ')}</div>
            <button onclick="alert('Starting navigation to ${ghat.name}')" style="background: ${ghatColor}; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Navigate to Ghat</button>
          </div>
        `);
        
      if (onLocationClick) {
        marker.on('click', () => onLocationClick(ghat));
      }
    });

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

    // Enhanced facility markers with more interactivity
    facilityData.forEach(facility => {
      const lat = parseFloat(facility.latitude);
      const lng = parseFloat(facility.longitude);
      
      const facilityIcons: Record<string, string> = {
        toilet: '🚻',
        medical: '🏥',
        shop: '🛒', 
        food: '🍽️',
        security: '👮',
        emergency: '🚨',
        parking: '🅿️',
        information: 'ℹ️',
        water: '💧',
        rest: '🪑'
      };
      
      const facilityColors: Record<string, string> = {
        toilet: '#8B5CF6',
        medical: '#EF4444',
        shop: '#3B82F6',
        food: '#10B981',
        security: '#6366F1',
        emergency: '#F59E0B',
        parking: '#795548',
        information: '#607D8B',
        water: '#00BCD4',
        rest: '#9E9E9E'
      };

      const facilityIcon = L.divIcon({
        html: `<div style="background-color: ${facilityColors[facility.type] || '#6B7280'}; color: white; width: 35px; height: 35px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.3); cursor: pointer; transition: transform 0.2s;" 
               onmouseover="this.style.transform='scale(1.15)'" 
               onmouseout="this.style.transform='scale(1)'">
          ${facilityIcons[facility.type] || '📍'}
        </div>`,
        className: 'facility-marker',
        iconSize: [35, 35],
        iconAnchor: [17.5, 17.5]
      });

      const marker = L.marker([lat, lng], { icon: facilityIcon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 12px; font-family: sans-serif;">
            <h4 style="color: ${facilityColors[facility.type]}; margin: 0 0 8px 0;">${facility.name}</h4>
            <div style="margin-bottom: 5px;"><strong>Type:</strong> ${facility.type}</div>
            <div style="margin-bottom: 8px;"><strong>Status:</strong> <span style="color: ${facility.status === 'open' || facility.status === '24x7' ? 'green' : 'red'}">${facility.status}</span></div>
            <button onclick="alert('Getting directions to ${facility.name}')" style="background: ${facilityColors[facility.type]}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-top: 5px;">Get Directions</button>
          </div>
        `);
        
      if (onLocationClick) {
        marker.on('click', () => onLocationClick(facility));
      }
    });

    // Add user location marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        html: `<div style="background: linear-gradient(45deg, #4285F4, #34A853); color: white; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 20px rgba(66, 133, 244, 0.6); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; animation: userPulse 2s infinite;">
          📍
        </div>`,
        className: 'user-location-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 12px; font-family: sans-serif;">
            <h4 style="color: #4285F4; margin: 0 0 8px 0;">📍 Your Current Location</h4>
            <div style="margin-bottom: 5px;"><strong>Latitude:</strong> ${userLocation.lat.toFixed(6)}</div>
            <div style="margin-bottom: 8px;"><strong>Longitude:</strong> ${userLocation.lng.toFixed(6)}</div>
            <button onclick="alert('This is your current location')" style="background: #4285F4; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Your Location</button>
          </div>
        `);
        
      // Add accuracy circle if available
      const accuracyCircle = L.circle([userLocation.lat, userLocation.lng], {
        radius: 50, // 50 meter accuracy circle
        fillColor: '#4285F4',
        fillOpacity: 0.1,
        color: '#4285F4',
        weight: 2,
        opacity: 0.5
      }).addTo(map);
    }

    // Enhanced CSS animations for better interactivity
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes ripple {
        0% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4); }
        70% { box-shadow: 0 0 0 20px rgba(33, 150, 243, 0); }
        100% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0); }
      }
      @keyframes userPulse {
        0% { transform: scale(1); box-shadow: 0 0 20px rgba(66, 133, 244, 0.6); }
        50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(66, 133, 244, 0.8); }
        100% { transform: scale(1); box-shadow: 0 0 20px rgba(66, 133, 244, 0.6); }
      }
      .crowd-marker {
        animation: pulse 2s infinite;
      }
      .ghat-marker {
        animation: ripple 3s infinite;
      }
      .custom-div-icon:hover {
        z-index: 1000 !important;
      }
      .facility-marker:hover {
        z-index: 1000 !important;
      }
    `;
    document.head.appendChild(style);

    // Add map interaction features
    map.on('click', (e) => {
      if (onLocationClick) {
        onLocationClick({
          type: 'map_click',
          latitude: e.latlng.lat.toString(),
          longitude: e.latlng.lng.toString(),
          name: 'Custom Location'
        });
      }
    });

    // Add zoom event handler for responsive marker sizing
    map.on('zoomend', () => {
      const currentZoom = map.getZoom();
      // Adjust marker sizes based on zoom level
      const markers = document.querySelectorAll('.custom-div-icon, .facility-marker, .ghat-marker');
      markers.forEach(marker => {
        const scale = Math.max(0.5, Math.min(1.5, currentZoom / 16));
        (marker as HTMLElement).style.transform = `scale(${scale})`;
      });
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
  }, [center, zoom, showPaths, showHeatmap, selectedRoute, userLocation, JSON.stringify(crowdData), JSON.stringify(facilityData), JSON.stringify(ghatData)]);

  return <div ref={mapRef} className={className} style={{ minHeight: '400px', width: '100%', zIndex: 1 }} data-testid="interactive-map" />;
}