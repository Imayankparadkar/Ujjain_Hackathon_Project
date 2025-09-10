import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { Map } from "@/components/ui/map";
import { MapPin, Navigation, Users, AlertTriangle, Clock, Phone, Shield, Heart, Home, Loader2, CheckCircle, XCircle, Train, Bus, Car, Languages, Target, Route, Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { locationService } from "@/lib/locationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function MapPage() {
  const [selectedRoute, setSelectedRoute] = useState<string>("all");
  const [arrivalMethod, setArrivalMethod] = useState<string>("");
  const [currentJourneyStep, setCurrentJourneyStep] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
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

    // Initialize arrival points and route data
    initializeArrivalPointsAndJourney();

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
    console.log('Report crowd button clicked', { userLocation });
    
    if (!userLocation) {
      toast({
        title: "📍 Location Required",
        description: "Getting your location to report overcrowding...",
        variant: "destructive"
      });
      getUserLocation();
      return;
    }

    const reportData = {
      location: `${userLocation.lat}, ${userLocation.lng}`,
      latitude: userLocation.lat.toString(),
      longitude: userLocation.lng.toString(),
      reportType: 'overcrowding',
      severity: 'high',
      description: 'User reported overcrowding via map interface',
      timestamp: new Date().toISOString(),
      reportedBy: 'mobile_user'
    };
    
    console.log('Submitting crowd report:', reportData);
    reportCrowdMutation.mutate(reportData);
  };

  const handleRequestAssistance = () => {
    console.log('Request assistance button clicked', { userLocation });
    
    if (!userLocation) {
      toast({
        title: "📍 Location Required", 
        description: "Getting your location to request assistance...",
        variant: "destructive"
      });
      getUserLocation();
      return;
    }

    const assistanceData = {
      location: `${userLocation.lat}, ${userLocation.lng}`,
      latitude: userLocation.lat.toString(),
      longitude: userLocation.lng.toString(),
      requestType: 'general_assistance',
      priority: 'medium',
      description: 'User requested assistance via map interface',
      timestamp: new Date().toISOString(),
      requestedBy: 'mobile_user'
    };
    
    console.log('Submitting assistance request:', assistanceData);
    requestAssistanceMutation.mutate(assistanceData);
  };

  // Multi-language content
  const translations = {
    en: {
      selectArrival: "How are you arriving?",
      railway: "Railway Station",
      bus: "Bus Stand", 
      car: "Private Vehicle",
      selectRoute: "Select Your Route",
      spiritualJourney: "Spiritual Journey Steps",
      bathingAreas: "Bathing Areas at Shipra Ghat",
      getDirections: "Get Directions",
      emergency: "Emergency",
      safety: "Safety Info"
    },
    hi: {
      selectArrival: "आप कैसे आ रहे हैं?",
      railway: "रेलवे स्टेशन",
      bus: "बस स्टैंड",
      car: "निजी वाहन",
      selectRoute: "अपना मार्ग चुनें",
      spiritualJourney: "आध्यात्मिक यात्रा के चरण",
      bathingAreas: "शिप्रा घाट पर स्नान क्षेत्र",
      getDirections: "दिशा प्राप्त करें",
      emergency: "आपातकाल",
      safety: "सुरक्षा जानकारी"
    }
  };

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  // Arrival points and parking zones
  const arrivalPoints = {
    railway: {
      name: "Ujjain Junction Railway Station",
      coordinates: [23.1794, 75.7849] as [number, number],
      routes: [
        { coords: [[23.1794, 75.7849], [23.1810, 75.7820], [23.1825, 75.7692]], type: "walking", time: "25 min" }
      ]
    },
    bus: {
      name: "Ujjain Bus Stand",
      coordinates: [23.1765, 75.7880] as [number, number],
      routes: [
        { coords: [[23.1765, 75.7880], [23.1785, 75.7790], [23.1825, 75.7692]], type: "walking", time: "30 min" }
      ]
    },
    car: {
      name: "Designated Parking Zones",
      coordinates: [23.1850, 75.7650] as [number, number],
      parkingZones: [
        { name: "Parking Zone A", coords: [23.1850, 75.7650], capacity: 500, available: 120 },
        { name: "Parking Zone B", coords: [23.1860, 75.7660], capacity: 300, available: 85 },
        { name: "VIP Parking", coords: [23.1840, 75.7640], capacity: 100, available: 45 }
      ],
      routes: [
        { coords: [[23.1850, 75.7650], [23.1825, 75.7670], [23.1825, 75.7692]], type: "walking", time: "15 min" }
      ]
    }
  };

  // Spiritual journey sequence
  const spiritualJourneySteps = [
    { 
      id: 1, 
      name: selectedLanguage === "hi" ? "आगमन और शुद्धीकरण" : "Arrival & Purification", 
      location: "Entrance Gates", 
      description: selectedLanguage === "hi" ? "सुरक्षा जाँच, हाथ साफ करना और प्रवेश प्रक्रिया" : "Security check, hand sanitization, and entry procedures",
      coords: [23.1820, 75.7695],
      estimatedTime: "10 min",
      priority: "high"
    },
    {
      id: 2,
      name: selectedLanguage === "hi" ? "कतार प्रबंधन" : "Queue Management",
      location: "Organized Queue Area",
      description: selectedLanguage === "hi" ? "मार्ग चयन के आधार पर निर्धारित कतार में शामिल हों" : "Join designated queue based on route selection",
      coords: [23.1818, 75.7698],
      estimatedTime: "20-45 min",
      priority: "high"
    },
    {
      id: 3,
      name: selectedLanguage === "hi" ? "मंदिर दर्शन" : "Temple Darshan",
      location: "Mahakaleshwar Sanctum",
      description: selectedLanguage === "hi" ? "भगवान महाकालेश्वर के पवित्र दर्शन" : "Sacred darshan of Lord Mahakaleshwar",
      coords: [23.1825, 75.7688],
      estimatedTime: "15 min",
      priority: "critical"
    },
    {
      id: 4,
      name: selectedLanguage === "hi" ? "प्रसाद और भेंट" : "Prasad & Offerings",
      location: "Prasad Counter",
      description: selectedLanguage === "hi" ? "प्रसाद लें और भेंट चढ़ाएं" : "Collect prasad and make offerings",
      coords: [23.1822, 75.7690],
      estimatedTime: "10 min",
      priority: "medium"
    },
    {
      id: 5,
      name: selectedLanguage === "hi" ? "पवित्र स्नान" : "Sacred Bath",
      location: "Shipra Ghat",
      description: selectedLanguage === "hi" ? "निर्धारित घाट पर शिप्रा नदी में पवित्र स्नान" : "Holy dip in river Shipra at designated ghat",
      coords: [23.1810, 75.7680],
      estimatedTime: "30 min",
      priority: "critical"
    },
    {
      id: 6,
      name: selectedLanguage === "hi" ? "आरती में भागीदारी" : "Aarti Participation",
      location: "Ghat Aarti Area",
      description: selectedLanguage === "hi" ? "सायंकालीन आरती समारोह में भाग लें" : "Participate in evening aarti ceremony",
      coords: [23.1805, 75.7685],
      estimatedTime: "20 min",
      priority: "medium"
    }
  ];

  // Enhanced bathing zones at Shipra Ghat
  const shipraBathingZones = [
    {
      id: "male-bathing",
      name: selectedLanguage === "hi" ? "पुरुष स्नान क्षेत्र" : "Men's Bathing Area",
      coords: [23.1810, 75.7680],
      capacity: 500,
      currentOccupancy: 320,
      facilities: ["Changing Rooms", "Lockers", "Fresh Water", "Security", "Medical Aid"],
      specialFeatures: ["Deep Water Section", "Shallow Area for Non-Swimmers", "Steps with Railings"],
      timings: "4:00 AM - 10:00 PM",
      crowdLevel: "high"
    },
    {
      id: "female-bathing", 
      name: selectedLanguage === "hi" ? "महिला स्नान क्षेत्र" : "Women's Bathing Area",
      coords: [23.1805, 75.7685],
      capacity: 300,
      currentOccupancy: 180,
      facilities: ["Private Changing", "Female Security", "Fresh Water", "Child Care", "First Aid"],
      specialFeatures: ["Privacy Screens", "Separate Entry/Exit", "Female Volunteers", "Baby Care Station"],
      timings: "5:00 AM - 9:00 PM",
      crowdLevel: "medium"
    },
    {
      id: "family-bathing",
      name: selectedLanguage === "hi" ? "पारिवारिक स्नान क्षेत्र" : "Family Bathing Area",
      coords: [23.1808, 75.7682],
      capacity: 400,
      currentOccupancy: 220,
      facilities: ["Family Rooms", "Child Safety", "Lockers", "Fresh Water", "Food Counter"],
      specialFeatures: ["Supervised Children's Area", "Life Guards", "Family Counselors"],
      timings: "6:00 AM - 8:00 PM",
      crowdLevel: "medium"
    },
    {
      id: "senior-bathing",
      name: selectedLanguage === "hi" ? "वरिष्ठ नागरिक क्षेत्र" : "Senior Citizens Area",
      coords: [23.1815, 75.7675],
      capacity: 200,
      currentOccupancy: 85,
      facilities: ["Wheelchair Access", "Assisted Bathing", "Medical Support", "Rest Areas"],
      specialFeatures: ["Priority Access", "Volunteer Assistance", "Medical Station", "Comfortable Seating"],
      timings: "6:00 AM - 7:00 PM",
      crowdLevel: "low"
    }
  ];

  // Safety and emergency information
  const emergencyServices = [
    { name: "Police", number: "100", coords: [23.1815, 75.7695] },
    { name: "Medical Emergency", number: "108", coords: [23.1822, 75.7675] },
    { name: "Fire Service", number: "101", coords: [23.1810, 75.7690] },
    { name: "Tourist Helpline", number: "1363", coords: [23.1825, 75.7685] }
  ];

  const safetyPoints = [
    { name: "Lost & Found Center", coords: [23.1820, 75.7690], contact: "+91-734-2550088" },
    { name: "Medical Station 1", coords: [23.1822, 75.7675], services: ["First Aid", "Emergency Care"] },
    { name: "Medical Station 2", coords: [23.1808, 75.7685], services: ["First Aid", "Child Care"] },
    { name: "Police Help Booth", coords: [23.1815, 75.7695], services: ["Security", "Information"] }
  ];

  // Initialize arrival points and journey
  const initializeArrivalPointsAndJourney = () => {
    // Set up enhanced facility data including arrival points
    const enhancedFacilityData = [
      ...facilityData,
      {
        type: "arrival",
        name: "Railway Station",
        latitude: "23.1794",
        longitude: "75.7849",
        status: "open",
        services: "Arrival Point for Train Passengers"
      },
      {
        type: "arrival",
        name: "Bus Stand", 
        latitude: "23.1765",
        longitude: "75.7880",
        status: "open",
        services: "Arrival Point for Bus Passengers"
      },
      {
        type: "parking",
        name: "Parking Zone A",
        latitude: "23.1850",
        longitude: "75.7650",
        status: "available",
        capacity: "500 vehicles"
      }
    ];
    setFacilityData(enhancedFacilityData);
  };

  // Generate customized route based on arrival method
  const generateCustomRoute = (method: string) => {
    setArrivalMethod(method);
    setCurrentJourneyStep(0);
    
    let customRoute = "custom-" + method;
    setSelectedRoute(customRoute);
    
    toast({
      title: `🚂 ${method.charAt(0).toUpperCase() + method.slice(1)} Route Selected`,
      description: `Customized journey plan generated for ${method} arrival. Follow the step-by-step guidance.`,
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
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">Interactive Smart Map</h1>
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            AI-powered real-time crowd monitoring and navigation assistance for your sacred journey
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{crowdData.length}</div>
              <div className="text-lg text-white/80 font-medium">Live Areas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{facilityData.length}</div>
              <div className="text-lg text-white/80 font-medium">Facilities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{ghatData.length}</div>
              <div className="text-lg text-white/80 font-medium">Bathing Ghats</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-lg text-white/80 font-medium">Monitoring</div>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="mt-12 flex items-center justify-center space-x-4">
            <Languages className="h-6 w-6" />
            <div className="flex space-x-4">
              <Button
                variant={selectedLanguage === "en" ? "secondary" : "outline"}
                size="lg"
                onClick={() => setSelectedLanguage("en")}
                className={selectedLanguage === "en" ? "bg-white text-orange-600" : "border-white text-white hover:bg-white hover:text-orange-600"}
                data-testid="lang-en"
              >
                English
              </Button>
              <Button
                variant={selectedLanguage === "hi" ? "secondary" : "outline"}
                size="lg"
                onClick={() => setSelectedLanguage("hi")}
                className={selectedLanguage === "hi" ? "bg-white text-orange-600" : "border-white text-white hover:bg-white hover:text-orange-600"}
                data-testid="lang-hi"
              >
                हिंदी
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Arrival Method Selection */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Arrival Method</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Select how you're arriving to get personalized route guidance and real-time navigation assistance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden cursor-pointer" onClick={() => generateCustomRoute("railway")}>
              <CardContent className="p-10 text-center">
                <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <Train className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Railway Station</h3>
                <p className="text-base text-gray-600 mb-6 leading-relaxed">Direct arrival from Ujjain Junction</p>
                <div className="text-lg font-semibold text-orange-600">25 min walk</div>
                <Button 
                  className={`w-full mt-6 py-3 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 ${
                    arrivalMethod === "railway" 
                      ? "bg-orange-600 hover:bg-orange-700 text-white" 
                      : "bg-gray-100 hover:bg-orange-600 hover:text-white text-gray-700"
                  }`}
                  data-testid="arrival-railway"
                >
                  Select Route
                </Button>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden cursor-pointer" onClick={() => generateCustomRoute("bus")}>
              <CardContent className="p-10 text-center">
                <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <Bus className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Bus Terminal</h3>
                <p className="text-base text-gray-600 mb-6 leading-relaxed">Arrive via state or private bus</p>
                <div className="text-lg font-semibold text-orange-600">30 min walk</div>
                <Button 
                  className={`w-full mt-6 py-3 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 ${
                    arrivalMethod === "bus" 
                      ? "bg-orange-600 hover:bg-orange-700 text-white" 
                      : "bg-gray-100 hover:bg-orange-600 hover:text-white text-gray-700"
                  }`}
                  data-testid="arrival-bus"
                >
                  Select Route
                </Button>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden cursor-pointer" onClick={() => generateCustomRoute("car")}>
              <CardContent className="p-10 text-center">
                <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <Car className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Private Vehicle</h3>
                <p className="text-base text-gray-600 mb-6 leading-relaxed">Car, taxi, or private transport</p>
                <div className="text-lg font-semibold text-orange-600">15 min from parking</div>
                <Button 
                  className={`w-full mt-6 py-3 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 ${
                    arrivalMethod === "car" 
                      ? "bg-orange-600 hover:bg-orange-700 text-white" 
                      : "bg-gray-100 hover:bg-orange-600 hover:text-white text-gray-700"
                  }`}
                  data-testid="arrival-car"
                >
                  Select Route
                </Button>
              </CardContent>
            </Card>
          </div>

          {arrivalMethod && (
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <Route className="h-4 w-4 mr-2" />
                {arrivalMethod === "railway" ? "Railway Station Route Plan" : 
                 arrivalMethod === "bus" ? "Bus Stand Route Plan" : 
                 "Private Vehicle Route Plan"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Starting Point:</strong> {arrivalPoints[arrivalMethod as keyof typeof arrivalPoints].name}
                </div>
                <div>
                  <strong>Estimated Time:</strong> {arrivalPoints[arrivalMethod as keyof typeof arrivalPoints].routes[0].time}
                </div>
                {arrivalMethod === "car" && (
                  <div className="md:col-span-2">
                    <strong>Available Parking:</strong>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {arrivalPoints.car.parkingZones?.map((zone, idx) => (
                        <div key={idx} className="bg-background rounded p-2 text-xs">
                          <div className="font-medium">{zone.name}</div>
                          <div className="text-green-600">{zone.available}/{zone.capacity} spots</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Button 
                        onClick={() => window.open('https://iit-indore-project.onrender.com/services', '_blank')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        data-testid="parking-assistant-btn"
                      >
                        <Car className="h-4 w-4 mr-2" />
                        Parking Assistant Services
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Spiritual Journey Steps */}
      {arrivalMethod && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Spiritual Journey Path</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Follow the sacred steps of your spiritual journey with guided navigation</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {spiritualJourneySteps.map((step, index) => (
                <Card key={step.id} className={`transition-all duration-200 ${
                  currentJourneyStep === index ? 'ring-2 ring-primary' : ''
                } ${
                  step.priority === 'critical' ? 'border-red-200' :
                  step.priority === 'high' ? 'border-orange-200' : 'border-blue-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center text-white font-bold ${
                        currentJourneyStep === index ? 'bg-primary' :
                        currentJourneyStep > index ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        {step.id}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{step.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{step.location}</p>
                        <p className="text-xs mb-2">{step.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant={step.priority === 'critical' ? 'destructive' : 'secondary'}>
                            {step.estimatedTime}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCurrentJourneyStep(index);
                              getDirections(step.coords[0], step.coords[1], step.name);
                            }}
                            data-testid={`journey-step-${step.id}`}
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            Navigate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shipra Ghat Bathing Areas */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sacred Bathing Ghats</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Real-time crowd monitoring and facility information for all major bathing areas</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {shipraBathingZones.map((zone) => {
              const occupancyRate = (zone.currentOccupancy / zone.capacity) * 100;
              return (
                <Card key={zone.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                      <Badge variant={occupancyRate > 80 ? 'destructive' : occupancyRate > 60 ? 'secondary' : 'default'}>
                        {zone.crowdLevel}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-800">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Capacity:</span>
                        <span className="font-medium text-gray-900">{zone.currentOccupancy}/{zone.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            occupancyRate > 80 ? 'bg-red-500' : 
                            occupancyRate > 60 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${occupancyRate}%` }}
                        ></div>
                      </div>
                      <div className="text-gray-700"><strong className="text-gray-900">Timings:</strong> {zone.timings}</div>
                      <div className="border-t pt-2">
                        <strong className="text-gray-900">Facilities:</strong>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {zone.facilities.slice(0, 3).map((facility, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs text-gray-700">
                              {facility}
                            </Badge>
                          ))}
                          {zone.facilities.length > 3 && (
                            <Badge variant="outline" className="text-xs text-gray-700">
                              +{zone.facilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => getDirections(zone.coords[0], zone.coords[1], zone.name)}
                        data-testid={`ghat-navigate-${zone.id}`}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        {t.getDirections}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Route Selection */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Sacred Route</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Select the most suitable spiritual path based on your needs and preferences</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-12">
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
            <Card className="max-w-4xl mx-auto rounded-3xl border-0 shadow-2xl">
              <CardContent className="p-10">
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
                <p className="text-lg text-gray-600 mt-6 text-center">
                  {routes.find(r => r.id === selectedRoute)?.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Safety and Emergency Information */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Safety & Emergency Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">24/7 emergency assistance and safety support for your pilgrimage</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Emergency Services */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold flex items-center text-gray-900">
                  <Phone className="h-6 w-6 mr-3 text-red-600" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-2 gap-4">
                  {emergencyServices.map((service, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="h-auto flex flex-col items-center p-6 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-2xl"
                      onClick={() => makeEmergencyCall(service.name, service.number)}
                      data-testid={`emergency-${service.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className="font-semibold text-red-600 mb-2">{service.name}</div>
                      <div className="text-2xl font-bold text-gray-900">{service.number}</div>
                      <div className="text-xs text-gray-500 mt-1">Tap to call</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safety Points */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold flex items-center text-gray-900">
                  <Heart className="h-6 w-6 mr-3 text-blue-600" />
                  Safety Points
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="space-y-4">
                  {safetyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start justify-between p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{point.name}</div>
                        {point.contact && (
                          <div className="text-sm text-blue-600 mt-1">{point.contact}</div>
                        )}
                        {point.services && (
                          <div className="text-xs text-gray-600 mt-1">
                            {point.services.join(', ')}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                        onClick={() => getDirections(point.coords[0], point.coords[1], point.name)}
                        data-testid={`safety-navigate-${idx}`}
                      >
                        <Navigation className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Safety Guidelines */}
          <Card className="rounded-3xl border-0 shadow-2xl bg-white max-w-4xl mx-auto">
            <CardContent className="p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 mr-3 text-orange-600" />
                Important Safety Guidelines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base">
                <div>
                  <strong className="text-lg text-gray-900 block mb-4">During Your Visit:</strong>
                  <ul className="list-disc list-inside space-y-3 text-gray-700">
                    <li>Stay hydrated and carry water</li>
                    <li>Follow crowd management instructions</li>
                    <li>Keep emergency contacts handy</li>
                    <li>Stay with your group</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-lg text-gray-900 block mb-4">In Case of Emergency:</strong>
                  <ul className="list-disc list-inside space-y-3 text-gray-700">
                    <li>Contact nearest security personnel</li>
                    <li>Use emergency exit routes</li>
                    <li>Call emergency services immediately</li>
                    <li>Follow evacuation procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    center={[23.1825, 75.7688]} // Mahakal Temple at riverbank
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
                          getDirections(23.1825, 75.7688, 'Mahakaleshwar Temple');
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
              <Card className="mt-6 rounded-3xl border-0 shadow-xl bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">Map Legend</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
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
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
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
              <Card className="rounded-3xl border-0 shadow-xl bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold flex items-center text-gray-900">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
                    Live Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                  {crowdData.slice(0, 3).map((point, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                      <div>
                        <div className="font-medium text-gray-900">{point.location}</div>
                        <div className="text-gray-600 text-sm">Wait: {point.waitTime}</div>
                      </div>
                      <Badge className={`${getCrowdColor(point.densityLevel)} text-white`}>
                        {point.crowdCount}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Ghat Status */}
              <Card className="rounded-3xl border-0 shadow-xl bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold flex items-center text-gray-900">
                    🛁 Bathing Ghats Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                  {ghatData.map((ghat, index) => {
                    const occupancyRate = (ghat.currentOccupancy / ghat.capacity) * 100;
                    let statusColor = "text-green-600";
                    if (occupancyRate > 80) statusColor = "text-red-600";
                    else if (occupancyRate > 60) statusColor = "text-orange-600";
                    
                    return (
                      <div key={index} className="p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm text-gray-900">{ghat.name}</div>
                          <Badge variant="outline" className={statusColor}>
                            {occupancyRate.toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
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
                        <div className="text-xs text-gray-600">
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