import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { Map } from "@/components/ui/map";
import { MapPin, Navigation, Users, AlertTriangle, Clock, Phone, Shield, Heart, Home, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { locationService } from "@/lib/locationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function MapPage() {
  const [selectedRoute, setSelectedRoute] = useState<string>("all");
  const [crowdData, setCrowdData] = useState<any[]>([]);
  const [facilityData, setFacilityData] = useState<any[]>([]);
  const [ghatData, setGhatData] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isCallingEmergency, setIsCallingEmergency] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

    // Get user's current location
    getUserLocation();
  }, []);

  // Function to get user's current location
  const getUserLocation = async () => {
    setIsGettingLocation(true);
    try {
      const permission = await locationService.requestPermission();
      if (permission) {
        const location = await locationService.getCurrentPosition();
        if (location) {
          setUserLocation({
            lat: location.latitude,
            lng: location.longitude
          });
          toast({
            title: "📍 Location Found",
            description: "Your current location has been detected for navigation.",
          });
        }
      } else {
        toast({
          title: "📍 Location Access Denied",
          description: "Please allow location access for navigation features.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: "📍 Location Error",
        description: "Unable to get your location. Please check your settings.",
        variant: "destructive"
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Function to get directions to a specific location
  const getDirections = (destinationLat: number, destinationLng: number, destinationName: string) => {
    if (!userLocation) {
      toast({
        title: "📍 Location Required",
        description: "Getting your location for navigation...",
      });
      getUserLocation();
      return;
    }

    // Open Google Maps with directions
    const directionsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destinationLat},${destinationLng}`;
    window.open(directionsUrl, '_blank');
    
    toast({
      title: "🗺️ Directions Opened",
      description: `Navigation to ${destinationName} opened in Google Maps.`,
    });
  };

  // Emergency calling functions
  const makeEmergencyCall = async (service: string, number: string) => {
    setIsCallingEmergency(service);
    
    try {
      // In a real app, this would integrate with phone system
      // For demo, we'll simulate the call and show confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a clickable link for phone call
      const phoneLink = document.createElement('a');
      phoneLink.href = `tel:${number}`;
      phoneLink.click();
      
      toast({
        title: `📞 Calling ${service}`,
        description: `Dialing ${number}... Tap to call if needed.`,
      });
      
      // Log the emergency call for admin tracking
      try {
        const response = await fetch('/api/emergency/log-call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service,
            number,
            timestamp: new Date().toISOString(),
            userLocation: userLocation || null
          })
        });
        if (!response.ok) throw new Error('Failed to log call');
      } catch (logError) {
        console.log('Call logging failed:', logError);
      }
      
    } catch (error) {
      toast({
        title: "📞 Call Failed",
        description: `Unable to place call to ${service}. Please dial ${number} manually.`,
        variant: "destructive"
      });
    } finally {
      setIsCallingEmergency(null);
    }
  };

  // Report overcrowding mutation
  const reportCrowdMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/crowd-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to submit report');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "📊 Report Submitted",
        description: "Overcrowding report sent to control room. Thank you for helping!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/crowd-data'] });
    },
    onError: () => {
      toast({
        title: "❌ Report Failed",
        description: "Unable to submit report. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Request assistance mutation
  const requestAssistanceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/assistance-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to submit request');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "🆘 Assistance Requested",
        description: "Help request sent. Nearest volunteer will assist you shortly.",
      });
    },
    onError: () => {
      toast({
        title: "❌ Request Failed",
        description: "Unable to send assistance request. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Handle quick actions
  const handleReportCrowd = () => {
    if (!userLocation) {
      toast({
        title: "📍 Location Required",
        description: "Please allow location access to report overcrowding.",
        variant: "destructive"
      });
      getUserLocation();
      return;
    }

    reportCrowdMutation.mutate({
      location: `${userLocation.lat}, ${userLocation.lng}`,
      latitude: userLocation.lat.toString(),
      longitude: userLocation.lng.toString(),
      reportType: 'overcrowding',
      severity: 'high',
      description: 'User reported overcrowding via map interface',
      timestamp: new Date().toISOString(),
      reportedBy: 'mobile_user'
    });
  };

  const handleRequestAssistance = () => {
    if (!userLocation) {
      toast({
        title: "📍 Location Required",
        description: "Please allow location access to request assistance.",
        variant: "destructive"
      });
      getUserLocation();
      return;
    }

    requestAssistanceMutation.mutate({
      location: `${userLocation.lat}, ${userLocation.lng}`,
      latitude: userLocation.lat.toString(),
      longitude: userLocation.lng.toString(),
      requestType: 'general_assistance',
      priority: 'medium',
      description: 'User requested assistance via map interface',
      timestamp: new Date().toISOString(),
      requestedBy: 'mobile_user'
    });
  };

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
                <CardContent className="p-0 relative">
                  <Map
                    className="h-[600px] rounded-lg"
                    crowdData={crowdData}
                    facilityData={facilityData}
                    ghatData={ghatData}
                    showHeatmap={true}
                    showPaths={true}
                    selectedRoute={selectedRoute}
                    userLocation={userLocation}
                    center={[23.1815, 75.7682]} // Mahakal Temple coordinates
                    zoom={17}
                    onLocationClick={(location) => {
                      console.log('Location clicked:', location);
                      if (location.lat && location.lng) {
                        getDirections(location.lat, location.lng, location.name || 'Selected Location');
                      }
                    }}
                  />
                  
                  {/* Location Status Indicator */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className={`px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 ${
                      userLocation ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
                      {isGettingLocation ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm font-medium">Getting Location...</span>
                        </>
                      ) : userLocation ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Location Found</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Location Needed</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Get Directions Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      onClick={() => {
                        if (selectedRoute !== 'all') {
                          // Get directions to the selected route's starting point
                          const routeCoords = {
                            'male': { lat: 23.1820, lng: 75.7685, name: 'Male Devotees Path' },
                            'female': { lat: 23.1810, lng: 75.7685, name: 'Female Devotees Path' },
                            'elderly': { lat: 23.1825, lng: 75.7680, name: 'Senior Citizens Path' },
                            'family': { lat: 23.1815, lng: 75.7690, name: 'Family Path' }
                          };
                          const route = routeCoords[selectedRoute as keyof typeof routeCoords];
                          if (route) {
                            getDirections(route.lat, route.lng, route.name);
                          }
                        } else {
                          // Default to temple location
                          getDirections(23.1815, 75.7682, 'Mahakaleshwar Temple');
                        }
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                      data-testid="get-directions-btn"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>

                  {/* 3D View Toggle */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <Button
                      variant="outline"
                      className="bg-white/90 backdrop-blur-sm shadow-lg"
                      onClick={() => {
                        toast({
                          title: "🌍 3D View",
                          description: "3D route visualization is active! Click on routes to see detailed paths.",
                        });
                      }}
                      data-testid="3d-view-toggle"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      3D Routes
                    </Button>
                  </div>
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
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start" 
                    data-testid="emergency-police"
                    onClick={() => makeEmergencyCall("Police", "100")}
                    disabled={isCallingEmergency === "Police"}
                  >
                    {isCallingEmergency === "Police" ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="h-4 w-4 mr-2" />
                    )}
                    {isCallingEmergency === "Police" ? "Calling..." : "Police: 100"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-red-200 hover:bg-red-50 text-red-700" 
                    data-testid="emergency-medical"
                    onClick={() => makeEmergencyCall("Medical", "108")}
                    disabled={isCallingEmergency === "Medical"}
                  >
                    {isCallingEmergency === "Medical" ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Heart className="h-4 w-4 mr-2" />
                    )}
                    {isCallingEmergency === "Medical" ? "Calling..." : "Medical: 108"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-orange-200 hover:bg-orange-50 text-orange-700" 
                    data-testid="emergency-control-room"
                    onClick={() => makeEmergencyCall("Control Room", "1950")}
                    disabled={isCallingEmergency === "Control Room"}
                  >
                    {isCallingEmergency === "Control Room" ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Home className="h-4 w-4 mr-2" />
                    )}
                    {isCallingEmergency === "Control Room" ? "Calling..." : "Control Room: 1950"}
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
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                    data-testid="report-crowd"
                    onClick={handleReportCrowd}
                    disabled={reportCrowdMutation.isPending}
                  >
                    {reportCrowdMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 mr-2" />
                    )}
                    {reportCrowdMutation.isPending ? "Reporting..." : "Report Overcrowding"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
                    data-testid="request-help"
                    onClick={handleRequestAssistance}
                    disabled={requestAssistanceMutation.isPending}
                  >
                    {requestAssistanceMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4 mr-2" />
                    )}
                    {requestAssistanceMutation.isPending ? "Requesting..." : "Request Assistance"}
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