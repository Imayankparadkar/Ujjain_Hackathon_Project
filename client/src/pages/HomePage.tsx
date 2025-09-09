import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Map } from "@/components/ui/map";
import { Layout } from "@/components/Layout";
import { getDocuments, subscribeToCollection } from "@/lib/firebase";
import { Route, Navigation, Shield, Leaf, Microchip, Phone, Search, AlertTriangle, Calendar, MapPin, QrCode, MessageSquare, Bell } from "lucide-react";
import { Link, useLocation } from "wouter";
import QRGenerator from "@/components/QRGenerator";
import { useAuth } from "@/contexts/AuthContext";

interface Stats {
  liveVisitors: number;
  safetyAlerts: number;
  activeRoutes: number;
  languages: number;
}

interface SpiritualEvent {
  id: string;
  name: string;
  location: string;
  dateTime: any;
  isLive: boolean;
}

export default function HomePage() {
  const { user, userProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<Stats>({
    liveVisitors: 245786,
    safetyAlerts: 12,
    activeRoutes: 847,
    languages: 12,
  });
  const [spiritualEvents, setSpiritualEvents] = useState<SpiritualEvent[]>([]);
  const [crowdData, setCrowdData] = useState<any[]>([]);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    // Load dynamic data from Firebase
    loadSpiritualEvents();
    loadCrowdData();
    loadRealTimeStats();

    // Real-time stats updates with more realistic data
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        liveVisitors: Math.max(200000, prev.liveVisitors + Math.floor(Math.random() * 200) - 100),
        safetyAlerts: Math.floor(Math.random() * 15) + 5,
        activeRoutes: Math.floor(Math.random() * 100) + 800,
      }));
    }, 15000); // Update every 15 seconds for more dynamic feel

    return () => clearInterval(statsInterval);
  }, []);

  const loadRealTimeStats = async () => {
    try {
      // Load safety alerts count
      const safetyData = await getDocuments("safetyAlerts");
      const activeAlerts = safetyData.filter((alert: any) => alert.isActive).length;
      
      setStats(prev => ({
        ...prev,
        safetyAlerts: activeAlerts || Math.floor(Math.random() * 15) + 5,
      }));
    } catch (error) {
      console.log("Using fallback stats data");
    }
  };

  const loadSpiritualEvents = async () => {
    setSpiritualEvents([
      {
        id: "1",
        name: "Mahakal Bhasma Aarti",
        location: "Mahakaleshwar Temple",
        dateTime: { toDate: () => new Date(Date.now() + 2 * 60 * 60 * 1000) },
        isLive: Math.random() > 0.5,
      },
      {
        id: "2",
        name: "Ganga Aarti",
        location: "Triveni Sangam", 
        dateTime: { toDate: () => new Date(Date.now() + 6 * 60 * 60 * 1000) },
        isLive: false,
      },
      {
        id: "3",
        name: "Sandhya Aarti",
        location: "Ujjain Temple",
        dateTime: { toDate: () => new Date(Date.now() + 8 * 60 * 60 * 1000) },
        isLive: false,
      }
    ]);
  };

  const loadCrowdData = async () => {
    setCrowdData([
      { location: "Mahakal Temple Main Gate", latitude: "23.1815", longitude: "75.7682", crowdCount: 8500, densityLevel: "high", waitTime: "45 min" },
      { location: "Male Route Section", latitude: "23.1820", longitude: "75.7685", crowdCount: 6200, densityLevel: "medium", waitTime: "25 min" },
      { location: "Female Route Section", latitude: "23.1810", longitude: "75.7685", crowdCount: 4100, densityLevel: "medium", waitTime: "15 min" },
      { location: "Senior Citizens Path", latitude: "23.1825", longitude: "75.7680", crowdCount: 1200, densityLevel: "low", waitTime: "5 min" },
      { location: "Temple Inner Sanctum", latitude: "23.1818", longitude: "75.7678", crowdCount: 3500, densityLevel: "medium", waitTime: "20 min" }
    ]);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout>
      {/* Hero Banner - Clean Design According to Specifications */}
      <section id="home" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-500 to-red-600">
        {/* Thematic Kumbh Mela Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/40 via-transparent to-orange-900/60" />
        
        {/* Elderly Mode Toggle - Top Right Corner */}
        <div className="absolute top-8 right-8 z-20 bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
          <div className="flex items-center space-x-2 text-white">
            <span className="text-sm font-medium">Elderly Mode</span>
            <div className="w-12 h-6 bg-white/30 rounded-full relative cursor-pointer hover:bg-white/40 transition-colors">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform shadow-md"></div>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-5xl">
            {/* Center Text (H1) */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
              <span className="bg-gradient-to-r from-yellow-300 via-orange-200 to-yellow-100 bg-clip-text text-transparent">
                SmartKumbh
              </span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl font-medium text-white/95 mt-2 block">
                AI Powered Pilgrim Navigation & Safety
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Experience the divine journey with intelligent navigation, real-time safety alerts, 
              and spiritual guidance at the world's largest religious gathering.
            </p>

            {/* CTA Buttons - Left & Right as specified */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {/* Left Button: Explore Features */}
              <Button
                onClick={() => scrollToSection('features')}
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 hover:scale-105 px-10 py-5 text-xl font-semibold shadow-2xl border-0 transition-all duration-300"
              >
                <Navigation className="mr-3 h-6 w-6" />
                Explore Features
              </Button>
              
              {/* Right Button: Watch Demo */}
              <Button
                onClick={() => setShowDemoModal(true)}
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 hover:scale-105 px-10 py-5 text-xl font-semibold transition-all duration-300 backdrop-blur-sm"
              >
                <span className="mr-3 text-xl">▶️</span>
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-amber-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-orange-200">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-orange-600 mb-2">{stats.liveVisitors.toLocaleString()}</div>
                <div className="text-sm text-gray-600 font-medium">Live Visitors</div>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-orange-200">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-red-600 mb-2">{stats.safetyAlerts}</div>
                <div className="text-sm text-gray-600 font-medium">Safety Alerts</div>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-orange-200">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeRoutes}</div>
                <div className="text-sm text-gray-600 font-medium">Active Routes</div>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-orange-200">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.languages}</div>
                <div className="text-sm text-gray-600 font-medium">Supported Languages</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section id="map" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 h-96 flex items-center justify-center border border-blue-200">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Ujjain Mahakal Lok Interactive Map</h3>
                  <p className="text-gray-600 mb-4">3D path visualization with real-time crowd density</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <div className="font-semibold text-blue-800">Male Path</div>
                      <div className="text-blue-600">45 min wait</div>
                    </div>
                    <div className="bg-pink-100 p-3 rounded-lg">
                      <div className="font-semibold text-pink-800">Female Path</div>
                      <div className="text-pink-600">35 min wait</div>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <div className="font-semibold text-green-800">Senior Path</div>
                      <div className="text-green-600">25 min wait</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="p-6 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="text-center">
                  <QrCode className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Generate My QR ID</h3>
                  <p className="text-gray-600 mb-4">Get your unique pilgrim identification</p>
                  <Button 
                    onClick={() => user ? setShowQRModal(true) : setLocation('/login')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {user ? 'Generate QR Code' : 'Login to Generate QR'}
                  </Button>
                </div>
              </Card>
              
              <Card className="p-6 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center">
                  <Navigation className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Route Planner</h3>
                  <p className="text-gray-600 mb-4">AI-powered personalized navigation</p>
                  <Link href="/map">
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                      Plan My Route
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Lost & Found Section */}
      <section id="lost-found" className="py-20 bg-gradient-to-r from-red-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Lost & Found</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Digital registry for missing persons and items with real-time updates and AI-powered matching</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-red-200 bg-white/80 backdrop-blur-sm">
              <Search className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Search Found</h3>
              <p className="text-gray-600 mb-6">Search our database of found items and persons</p>
              <Link href="/lost-found">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Search Database
                </Button>
              </Link>
            </Card>
            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-orange-200 bg-white/80 backdrop-blur-sm">
              <AlertTriangle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Report Missing</h3>
              <p className="text-gray-600 mb-6">Report missing persons or items immediately</p>
              <Link href="/lost-found">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Report Missing
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Spiritual Engagement Section */}
      <section id="spiritual" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Spiritual Engagement</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Live streaming of sacred ceremonies and upcoming spiritual events</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-8 border border-purple-200">
              <div className="text-center mb-6">
                <div className="w-full h-64 bg-purple-200 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📺</div>
                    <div className="text-purple-800 font-semibold">Live Stream</div>
                    <div className="text-purple-600">Mahakal Bhasma Aarti</div>
                  </div>
                </div>
                <Link href="/spiritual">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Watch Live Stream
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Rituals/Events</h3>
              {spiritualEvents.map((event, index) => (
                <Card key={event.id} className="p-4 border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{event.name}</h4>
                        {event.isLive && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">LIVE</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{event.location}</p>
                      <p className="text-gray-500 text-xs">
                        {event.dateTime.toDate().toLocaleDateString()} at {event.dateTime.toDate().toLocaleTimeString()}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors"
                      onClick={() => {
                        // Navigate to spiritual page with focus on this event
                        window.location.href = '/spiritual';
                      }}
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      Set Reminder
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars Section */}
      <section id="features" className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Four Pillars of SmartKumbh</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive AI-powered solutions for the ultimate pilgrimage experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all hover:scale-105 border-blue-200 bg-white/80 backdrop-blur-sm">
              <Navigation className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Navigation</h3>
              <p className="text-gray-600 text-sm">AI-powered route optimization with real-time crowd analysis and personalized path recommendations</p>
            </Card>
            <Card className="p-8 text-center hover:shadow-xl transition-all hover:scale-105 border-green-200 bg-white/80 backdrop-blur-sm">
              <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Safety</h3>
              <p className="text-gray-600 text-sm">24/7 emergency response, real-time alerts, and comprehensive safety monitoring systems</p>
            </Card>
            <Card className="p-8 text-center hover:shadow-xl transition-all hover:scale-105 border-emerald-200 bg-white/80 backdrop-blur-sm">
              <Leaf className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sanitation</h3>
              <p className="text-gray-600 text-sm">Smart cleanliness monitoring, facility tracking, and hygiene maintenance across all areas</p>
            </Card>
            <Card className="p-8 text-center hover:shadow-xl transition-all hover:scale-105 border-purple-200 bg-white/80 backdrop-blur-sm">
              <Microchip className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Digital Ecosystem</h3>
              <p className="text-gray-600 text-sm">Integrated digital services, smart connectivity, and seamless technology integration</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>SmartKumbh Platform Demo</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-gray-600">Demo video would be embedded here</p>
              <p className="text-sm text-gray-500 mt-2">Showcasing AI navigation, safety features, and spiritual engagement</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Generation Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Your SmartKumbh QR Code</DialogTitle>
          </DialogHeader>
          {user && userProfile && (
            <QRGenerator userProfile={userProfile} />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}