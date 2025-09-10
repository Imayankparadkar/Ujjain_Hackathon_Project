import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import QRGenerator from "@/components/QRGenerator";
import QRScanner from "@/components/QRScanner";
import { UserProfile } from "@/lib/qrcode";
import { api, createPollingSubscription } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { QrCode, Scan, MapPin, AlertTriangle, Calendar, Phone, Route, Shield, Bell, Users, Clock, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserDashboard() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedProfile, setScannedProfile] = useState<UserProfile | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [crowdData, setCrowdData] = useState<any[]>([]);
  const [lostFoundCases, setLostFoundCases] = useState<any[]>([]);
  const [realTimeStats, setRealTimeStats] = useState({
    totalVisitors: 245672,
    activeAlerts: 3,
    upcomingEvents: 5,
    crowdLevel: "High",
    lostFoundCases: 2,
  });

  useEffect(() => {
    loadDashboardData();
    
    // Real-time data subscriptions using polling
    const unsubscribeAlerts = createPollingSubscription(
      "/api/safety-alerts",
      (data) => {
        const activeAlerts = data.filter((alert: any) => alert.isActive).slice(0, 3);
        setAlerts(activeAlerts);
        setRealTimeStats(prev => ({ ...prev, activeAlerts: activeAlerts.length }));
      },
      5000
    );

    const unsubscribeCrowd = createPollingSubscription(
      "/api/crowd-data",
      (data) => {
        setCrowdData(data);
        const totalVisitors = data.reduce((sum: number, item: any) => sum + (item.crowdCount || 0), 0);
        setRealTimeStats(prev => ({ ...prev, totalVisitors }));
      },
      3000
    );

    const unsubscribeEvents = createPollingSubscription(
      "/api/spiritual-events",
      (data) => {
        const upcoming = data.filter((event: any) => {
          const eventDate = new Date(event.dateTime);
          return eventDate > new Date();
        }).slice(0, 3);
        setEvents(upcoming);
        setRealTimeStats(prev => ({ ...prev, upcomingEvents: upcoming.length }));
      },
      5000
    );

    // Simulate real-time visitor count updates
    const statsInterval = setInterval(() => {
      setRealTimeStats(prev => ({
        ...prev,
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 20) - 10,
      }));
    }, 10000);

    return () => {
      unsubscribeAlerts();
      unsubscribeCrowd();
      unsubscribeEvents();
      clearInterval(statsInterval);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const [lostFoundData, dashboardStats] = await Promise.all([
        api.getLostFoundCases(),
        api.getDashboardStats()
      ]);
      
      setLostFoundCases(lostFoundData.slice(0, 3));
      
      // Update stats with real data
      if (dashboardStats) {
        setRealTimeStats(prev => ({
          ...prev,
          totalVisitors: dashboardStats.totalUsers || prev.totalVisitors,
          activeAlerts: dashboardStats.activeAlerts || prev.activeAlerts,
          lostFoundCases: dashboardStats.lostFoundCases || prev.lostFoundCases
        }));
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleScanResult = (profile: UserProfile) => {
    setScannedProfile(profile);
    setShowQRScanner(false);
    toast({
      title: "QR Code Scanned",
      description: `Successfully scanned ${profile.name}'s profile`,
    });
  };

  const getQRProfile = (): UserProfile => {
    return {
      uid: userProfile?.uid || user?.uid || '',
      name: userProfile?.name || '',
      email: userProfile?.email || user?.email || '',
      phone: userProfile?.phone || '',
      qrId: userProfile?.qrId || '',
      emergencyContact: userProfile?.emergencyContact || '',
      age: userProfile?.age || undefined,
      bloodGroup: userProfile?.bloodGroup || '',
      guardianContact: userProfile?.guardianContact || '',
    };
  };

  const getCrowdStatusColor = (level: string) => {
    const normalizedLevel = level.toLowerCase();
    switch (normalizedLevel) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getAlertPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            🕉️ Namaste, {userProfile?.name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">Your personalized SmartKumbh dashboard - Experience your spiritual journey with live insights</p>
        </div>
      </section>

      {/* Real-time Stats */}
      <section className="py-16 bg-gray-50 -mt-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Live Dashboard Statistics</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real-time updates from your SmartKumbh experience and the sacred grounds</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <Card className="text-center p-10 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl">
            <CardContent className="p-0">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-4">{realTimeStats.totalVisitors.toLocaleString()}</div>
              <div className="text-lg text-gray-700 font-semibold mb-2">Live Visitors</div>
              <div className="flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-green-600 font-medium">+2.4% today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center p-10 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl">
            <CardContent className="p-0">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <div className="text-4xl font-bold text-red-600 mb-4">{realTimeStats.activeAlerts}</div>
              <div className="text-lg text-gray-700 font-semibold mb-2">Active Alerts</div>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                <span className="text-sm text-red-600 font-medium">Live Updates</span>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center p-10 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl">
            <CardContent className="p-0">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-4">{realTimeStats.upcomingEvents}</div>
              <div className="text-lg text-gray-700 font-semibold mb-2">Upcoming Events</div>
              <div className="flex items-center justify-center">
                <Clock className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-sm text-purple-600 font-medium">Next in 1h</span>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center p-10 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl">
            <CardContent className="p-0">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-4">{userProfile?.qrId ? 'Active' : 'Pending'}</div>
              <div className="text-lg text-gray-700 font-semibold mb-2">My QR Status</div>
              <div className="flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${userProfile?.qrId ? 'bg-green-500' : 'bg-orange-500'}`} />
                <span className={`text-sm font-medium ${userProfile?.qrId ? 'text-green-600' : 'text-orange-600'}`}>
                  {userProfile?.qrId ? 'Generated' : 'Generate Now'}
                </span>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </section>

      {/* QR Code Management */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">QR Code Management</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Generate and scan QR codes for enhanced safety and quick identification during your pilgrimage</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-10">
                  <CardTitle className="text-3xl flex items-center gap-3 text-gray-800">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
                      <QrCode className="h-8 w-8 text-orange-600" />
                    </div>
                    My SmartKumbh QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-0 space-y-6">
                  <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-100">
                    <p className="text-base text-gray-600 mb-3 font-medium">Your unique pilgrim identification</p>
                    <p className="font-mono text-2xl font-bold text-orange-600">
                      {userProfile?.qrId || 'Not Generated'}
                    </p>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Generate your emergency QR code containing contact information, medical details, and pilgrim ID for quick identification during the Kumbh Mela.
                  </p>
                  <Dialog open={showQRGenerator} onOpenChange={setShowQRGenerator}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-xl font-semibold rounded-2xl shadow-lg">
                        {userProfile?.qrId ? 'View My QR Code' : 'Generate QR Code'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Your SmartKumbh QR Code</DialogTitle>
                      </DialogHeader>
                      <QRGenerator userProfile={getQRProfile()} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-10">
                  <CardTitle className="text-3xl flex items-center gap-3 text-gray-800">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                      <Scan className="h-8 w-8 text-blue-600" />
                    </div>
                    QR Code Scanner
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-0 space-y-6">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Scan other pilgrims' QR codes to view their emergency contact information. Helpful for assisting lost persons or medical emergencies.
                  </p>
                  <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-xl font-semibold rounded-2xl shadow-lg">
                        <Scan className="h-6 w-6 mr-3" />
                        Scan QR Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <QRScanner 
                        onScanResult={handleScanResult} 
                        onClose={() => setShowQRScanner(false)} 
                      />
                    </DialogContent>
                  </Dialog>
                  
                  {scannedProfile && (
                    <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
                      <p className="text-base font-semibold text-blue-800 mb-2">Recently Scanned:</p>
                      <p className="text-base text-blue-700 font-medium">{scannedProfile.name}</p>
                      <p className="text-sm text-blue-600 mt-1">ID: {scannedProfile.qrId}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
          </div>
        </div>
      </section>

      {/* Live Safety Alerts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Live Safety Alerts</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real-time safety updates and important notifications for your pilgrimage journey</p>
          </div>
          <Card className="bg-white border-0 rounded-3xl shadow-2xl">
          <CardHeader className="p-10">
            <CardTitle className="text-3xl flex items-center gap-3 text-gray-800">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              Live Safety Alerts
              <span className="text-base bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold">LIVE</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 pt-0">
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className={`p-6 rounded-2xl border-l-4 ${getAlertPriorityColor(alert.priority)} hover:shadow-lg transition-shadow`} data-testid={`alert-${index}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-2">{alert.title}</h4>
                        <p className="text-base text-gray-600 leading-relaxed">{alert.message}</p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                          <span>📍 {alert.location}</span>
                          <span>⏰ {new Date(alert.createdAt).toLocaleTimeString()}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getAlertPriorityColor(alert.priority)}`}>
                            {alert.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
                <p className="text-xl text-gray-500 font-medium">All Clear! No active alerts at the moment</p>
                <p className="text-base text-gray-400 mt-2">Your pilgrimage path is safe and secure</p>
              </div>
            )}
          </CardContent>
          </Card>
        </div>
      </section>

      {/* Real-time Crowd Data */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Live Crowd Monitoring</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real-time crowd density and wait time information across all sacred locations</p>
          </div>
          <Card className="bg-white border-0 rounded-3xl shadow-2xl">
          <CardHeader className="p-10">
            <CardTitle className="text-3xl flex items-center gap-3 text-gray-800">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              Live Crowd Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crowdData.slice(0, 6).map((location, index) => (
                <div key={index} className={`p-6 rounded-2xl border-2 ${getCrowdStatusColor(location.densityLevel)} hover:shadow-xl transition-all duration-300 hover:scale-105`} data-testid={`crowd-location-${index}`}>
                  <h4 className="font-bold text-gray-800 text-lg mb-4">{location.location}</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Current Count:</span>
                      <span className="font-bold" data-testid={`crowd-count-${index}`}>{location.crowdCount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Wait Time:</span>
                      <span className="font-bold" data-testid={`wait-time-${index}`}>{location.waitTime || 'No wait'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Status:</span>
                      <span className="font-bold capitalize" data-testid={`status-${index}`}>{location.status || location.densityLevel}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Density:</span>
                      <span className={`font-bold capitalize ${getCrowdStatusColor(location.densityLevel).split(' ')[0]}`}>
                        {location.densityLevel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Navigate to key features and services with a single click</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Card className="p-12 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group cursor-pointer" onClick={() => window.location.href = '/map'}>
              <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-purple-200 transition-colors">
                <MapPin className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Interactive Map</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">Navigate with AI-powered route optimization and real-time crowd density</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-xl font-semibold rounded-2xl shadow-lg" data-testid="open-map-button">
                Open Live Map
              </Button>
            </Card>

            <Card className="p-12 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group cursor-pointer" onClick={() => window.location.href = '/lost-found'}>
              <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-red-200 transition-colors">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Lost & Found</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">Report missing persons/items or search our database with AI matching</p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-xl font-semibold rounded-2xl shadow-lg" data-testid="access-lost-found-button">
                Access Service
              </Button>
            </Card>

            <Card className="p-12 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 rounded-3xl group cursor-pointer" onClick={() => window.location.href = '/spiritual'}>
              <div className="bg-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-indigo-200 transition-colors">
                <Calendar className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Spiritual Events</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">Live streaming, event reminders, and sacred ceremony schedules</p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 text-xl font-semibold rounded-2xl shadow-lg" data-testid="view-events-button">
                View Live Events
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}