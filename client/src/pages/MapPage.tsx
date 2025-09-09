import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { Map } from "@/components/ui/map";
import { MapPin, Navigation, Users, AlertTriangle, Clock, Phone, Shield, Heart, Home } from "lucide-react";

export default function MapPage() {
  const [selectedRoute, setSelectedRoute] = useState<string>("all");
  const [crowdData, setCrowdData] = useState<any[]>([]);
  const [facilityData, setFacilityData] = useState<any[]>([]);
  const [ghatData, setGhatData] = useState<any[]>([]);

  useEffect(() => {
    // Mock Ujjain Mahakal Lok data with 3D path visualization
    setCrowdData([
      { 
        location: "Mahakal Temple Main Gate", 
        latitude: "23.1815", 
        longitude: "75.7682", 
        crowdCount: 15000, 
        densityLevel: "very-high",
        waitTime: "45 min"
      },
      { 
        location: "Male Route - Section 1", 
        latitude: "23.1820", 
        longitude: "75.7685", 
        crowdCount: 8500, 
        densityLevel: "high",
        waitTime: "25 min"
      },
      { 
        location: "Female Route - Section 1", 
        latitude: "23.1810", 
        longitude: "75.7685", 
        crowdCount: 6200, 
        densityLevel: "medium",
        waitTime: "15 min"
      },
      { 
        location: "Senior Citizens Path", 
        latitude: "23.1825", 
        longitude: "75.7680", 
        crowdCount: 2100, 
        densityLevel: "low",
        waitTime: "5 min"
      },
      { 
        location: "Temple Inner Sanctum", 
        latitude: "23.1818", 
        longitude: "75.7678", 
        crowdCount: 3500, 
        densityLevel: "medium",
        waitTime: "20 min"
      }
    ]);

    setFacilityData([
      { 
        type: "toilet", 
        name: "Public Toilet Block A", 
        latitude: "23.1812", 
        longitude: "75.7690", 
        status: "open",
        cleanlinessScore: 85,
        capacity: "50 people"
      },
      { 
        type: "medical", 
        name: "Medical Aid Post", 
        latitude: "23.1822", 
        longitude: "75.7675", 
        status: "24x7",
        staff: "2 doctors, 4 nurses"
      },
      { 
        type: "shop", 
        name: "Prasad & Puja Items", 
        latitude: "23.1808", 
        longitude: "75.7687", 
        status: "open",
        items: "Flowers, Incense, Offerings"
      },
      { 
        type: "food", 
        name: "Community Kitchen", 
        latitude: "23.1830", 
        longitude: "75.7685", 
        status: "open",
        services: "Free meals, Water"
      },
      { 
        type: "security", 
        name: "Police Help Booth", 
        latitude: "23.1815", 
        longitude: "75.7695", 
        status: "24x7",
        contact: "100"
      },
      { 
        type: "emergency", 
        name: "Emergency Exit A", 
        latitude: "23.1805", 
        longitude: "75.7680", 
        status: "always-open",
        capacity: "500 people/min"
      },
      { 
        type: "emergency", 
        name: "Emergency Exit B", 
        latitude: "23.1825", 
        longitude: "75.7695", 
        status: "always-open",
        capacity: "300 people/min"
      }
    ]);

    // Enhanced ghat data for bathing areas
    setGhatData([
      {
        name: "Main Bathing Ghat",
        latitude: "23.1800",
        longitude: "75.7670",
        type: "main",
        capacity: 500,
        currentOccupancy: 320,
        facilities: ["Changing Rooms", "Lockers", "Fresh Water", "Medical Aid", "Security"]
      },
      {
        name: "Female-Only Bathing Ghat",
        latitude: "23.1795",
        longitude: "75.7675",
        type: "female",
        capacity: 300,
        currentOccupancy: 180,
        facilities: ["Private Changing", "Female Security", "Fresh Water", "First Aid", "Children Area"]
      },
      {
        name: "Senior Citizens Ghat",
        latitude: "23.1805",
        longitude: "75.7665",
        type: "senior",
        capacity: 200,
        currentOccupancy: 85,
        facilities: ["Wheelchair Access", "Assisted Bathing", "Medical Support", "Rest Areas", "Priority Entry"]
      },
      {
        name: "Family Bathing Ghat",
        latitude: "23.1798",
        longitude: "75.7672",
        type: "family",
        capacity: 400,
        currentOccupancy: 220,
        facilities: ["Family Rooms", "Child Safety", "Lockers", "Fresh Water", "Food Counter"]
      }
    ]);
  }, []);

  const routes = [
    { 
      id: "all", 
      name: "All Routes", 
      color: "#6B7280", 
      description: "View all available routes and choose your path",
      estimatedTime: "Varies",
      crowdLevel: "Mixed"
    },
    { 
      id: "male", 
      name: "Male Devotees Path", 
      color: "#FF6B35", 
      description: "Optimized for male pilgrims ending at Main Bathing Ghat",
      estimatedTime: "55 minutes (Temple: 45 min + Ghat: 10 min)",
      crowdLevel: "High"
    },
    { 
      id: "female", 
      name: "Female Devotees Path", 
      color: "#FFB74D", 
      description: "Safe route for female pilgrims ending at Female-Only Ghat",
      estimatedTime: "45 minutes (Temple: 35 min + Ghat: 10 min)",
      crowdLevel: "Medium"
    },
    { 
      id: "elderly", 
      name: "Senior Citizens Path", 
      color: "#4CAF50", 
      description: "Priority route with assistance ending at Senior Citizens Ghat",
      estimatedTime: "35 minutes (Temple: 25 min + Ghat: 10 min)",
      crowdLevel: "Low"
    },
    { 
      id: "family", 
      name: "Family Path", 
      color: "#9C27B0", 
      description: "Child-friendly route ending at Family Bathing Ghat",
      estimatedTime: "50 minutes (Temple: 40 min + Ghat: 10 min)",
      crowdLevel: "Medium"
    }
  ];

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "very-high": return "bg-red-600";
      case "high": return "bg-red-400";
      case "medium": return "bg-yellow-400";
      case "low": return "bg-green-400";
      default: return "bg-gray-400";
    }
  };

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case "toilet": return "🚻";
      case "medical": return "🏥";
      case "shop": return "🛒";
      case "food": return "🍽️";
      case "security": return "👮";
      case "emergency": return "🚪";
      default: return "📍";
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Interactive Map - Ujjain Mahakal Lok</h1>
          <p className="text-primary-foreground/90">Real-time crowd monitoring and navigation assistance</p>
        </div>
      </section>

      {/* Route Selection */}
      <section className="py-6 bg-card border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">Select Your Route</h2>
          <div className="flex flex-wrap gap-3">
            {routes.map((route) => (
              <Button
                key={route.id}
                variant={selectedRoute === route.id ? "default" : "outline"}
                onClick={() => setSelectedRoute(route.id)}
                className="flex items-center space-x-2"
                data-testid={`route-${route.id}`}
              >
                <div 
                  className="w-4 h-4 rounded-full border border-white" 
                  style={{ backgroundColor: route.color }}
                />
                <span>{route.name}</span>
              </Button>
            ))}
          </div>
          {selectedRoute && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    Est. Time: {routes.find(r => r.id === selectedRoute)?.estimatedTime}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-sm">
                    Crowd: {routes.find(r => r.id === selectedRoute)?.crowdLevel}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Navigation className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Optimized Route</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {routes.find(r => r.id === selectedRoute)?.description}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Map and Sidebar */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Map */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-0">
                  <Map
                    className="h-[600px] rounded-lg"
                    crowdData={crowdData}
                    facilityData={facilityData}
                    ghatData={ghatData}
                    showHeatmap={true}
                    showPaths={true}
                    selectedRoute={selectedRoute}
                    center={[23.1815, 75.7682]} // Mahakal Temple coordinates
                    zoom={17}
                    onLocationClick={(location) => {
                      console.log('Location clicked:', location);
                      // Handle location click - could show details, navigate, etc.
                    }}
                  />
                </CardContent>
              </Card>

              {/* Map Legend */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Map Legend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {/* Crowd Density */}
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <span>Very High Crowd</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span>High Crowd</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span>Medium Crowd</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span>Low Crowd</span>
                    </div>

                    {/* Facilities */}
                    <div className="flex items-center space-x-2">
                      <span>🚻</span>
                      <span>Toilets</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🏥</span>
                      <span>Medical Aid</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🛒</span>
                      <span>Shops</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🚪</span>
                      <span>Emergency Exits</span>
                    </div>

                    {/* Bathing Ghats */}
                    <div className="flex items-center space-x-2">
                      <span>🛁</span>
                      <span>Bathing Ghats</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3" style={{backgroundColor: "#FF6B35"}}></div>
                      <span>Male Route</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3" style={{backgroundColor: "#FFB74D"}}></div>
                      <span>Female Route</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3" style={{backgroundColor: "#4CAF50"}}></div>
                      <span>Senior Route</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3" style={{backgroundColor: "#9C27B0"}}></div>
                      <span>Family Route</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Live Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    Live Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {crowdData.slice(0, 3).map((point, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium">{point.location}</div>
                        <div className="text-muted-foreground">Wait: {point.waitTime}</div>
                      </div>
                      <Badge className={getCrowdColor(point.densityLevel)}>
                        {point.crowdCount}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Ghat Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    🛁 Bathing Ghats Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ghatData.map((ghat, index) => {
                    const occupancyRate = (ghat.currentOccupancy / ghat.capacity) * 100;
                    let statusColor = "text-green-600";
                    if (occupancyRate > 80) statusColor = "text-red-600";
                    else if (occupancyRate > 60) statusColor = "text-orange-600";
                    
                    return (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm">{ghat.name}</div>
                          <Badge variant="outline" className={statusColor}>
                            {occupancyRate.toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {ghat.currentOccupancy}/{ghat.capacity} people
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full ${
                              occupancyRate > 80 ? 'bg-red-500' : 
                              occupancyRate > 60 ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${occupancyRate}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Type: {ghat.type} • {ghat.facilities.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-destructive">
                    <Phone className="h-5 w-5 mr-2" />
                    Emergency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="destructive" className="w-full justify-start" data-testid="emergency-police">
                    <Shield className="h-4 w-4 mr-2" />
                    Police: 100
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="emergency-medical">
                    <Heart className="h-4 w-4 mr-2" />
                    Medical: 108
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="emergency-control-room">
                    <Home className="h-4 w-4 mr-2" />
                    Control Room: 1950
                  </Button>
                </CardContent>
              </Card>

              {/* Nearby Facilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nearby Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {facilityData.slice(0, 5).map((facility, index) => (
                      <div key={index} className="flex items-start space-x-3 p-2 bg-muted rounded-lg">
                        <div className="text-lg">{getFacilityIcon(facility.type)}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{facility.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Status: <span className="text-green-600">{facility.status}</span>
                          </div>
                          {facility.cleanlinessScore && (
                            <div className="text-xs text-muted-foreground">
                              Cleanliness: {facility.cleanlinessScore}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-primary text-primary-foreground" data-testid="report-crowd">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Overcrowding
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="request-help">
                    <MapPin className="h-4 w-4 mr-2" />
                    Request Assistance
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}