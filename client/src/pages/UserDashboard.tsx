import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import QRGenerator from "@/components/QRGenerator";
import QRScanner from "@/components/QRScanner";
import { UserProfile } from "@/lib/qrcode";
import { getDocuments, subscribeToCollection } from "@/lib/firebase";
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
  });

  useEffect(() => {
    loadDashboardData();
    
    // Real-time data subscriptions
    const unsubscribeAlerts = subscribeToCollection(
      "safetyAlerts",
      (data) => {
        const activeAlerts = data.filter((alert: any) => alert.isActive).slice(0, 3);
        setAlerts(activeAlerts);
        setRealTimeStats(prev => ({ ...prev, activeAlerts: activeAlerts.length }));
      }
    );

    const unsubscribeCrowd = subscribeToCollection(
      "crowdData",
      (data) => {
        setCrowdData(data);
        const totalVisitors = data.reduce((sum: number, item: any) => sum + (item.crowdCount || 0), 0);
        setRealTimeStats(prev => ({ ...prev, totalVisitors }));
      }
    );

    const unsubscribeEvents = subscribeToCollection(
      "spiritualEvents",
      (data) => {
        const upcoming = data.filter((event: any) => new Date(event.dateTime.seconds * 1000) > new Date()).slice(0, 3);
        setEvents(upcoming);
        setRealTimeStats(prev => ({ ...prev, upcomingEvents: upcoming.length }));
      }
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
      const [lostFoundData] = await Promise.all([
        getDocuments("lostAndFound")
      ]);
      
      setLostFoundCases(lostFoundData.slice(0, 3));
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
    switch (level) {
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
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🕉️ Namaste, {userProfile?.name || user?.email}!
          </h1>
          <p className="text-gray-600">Welcome to your SmartKumbh pilgrim dashboard - Your spiritual journey companion</p>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Live Visitors</p>
                  <p className="text-2xl font-bold text-blue-700">{realTimeStats.totalVisitors.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+2.4% today</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-700">{realTimeStats.activeAlerts}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />
                    <span className="text-xs text-red-600">Live</span>
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Upcoming Events</p>
                  <p className="text-2xl font-bold text-purple-700">{realTimeStats.upcomingEvents}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 text-purple-500 mr-1" />
                    <span className="text-xs text-purple-600">Next in 1h</span>
                  </div>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">My QR Status</p>
                  <p className="text-2xl font-bold text-green-700">{userProfile?.qrId ? 'Active' : 'Pending'}</p>
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-1 ${userProfile?.qrId ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <span className={`text-xs ${userProfile?.qrId ? 'text-green-600' : 'text-orange-600'}`}>
                      {userProfile?.qrId ? 'Generated' : 'Generate Now'}
                    </span>
                  </div>
                </div>
                <QrCode className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <QrCode className="h-6 w-6" />
                My SmartKumbh QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-orange-100">
                <p className="text-sm text-gray-600 mb-2">Your unique pilgrim identification</p>
                <p className="font-mono text-lg font-bold text-orange-600">
                  {userProfile?.qrId || 'Not Generated'}
                </p>
              </div>
              <p className="text-gray-600 text-sm">
                Generate your emergency QR code containing contact information, medical details, and pilgrim ID for quick identification during the Kumbh Mela.
              </p>
              <Dialog open={showQRGenerator} onOpenChange={setShowQRGenerator}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    {userProfile?.qrId ? 'View My QR Code' : 'Generate QR Code'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Your SmartKumbh QR Code</DialogTitle>
                  </DialogHeader>
                  <QRGenerator userProfile={getQRProfile()} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Scan className="h-6 w-6" />
                QR Code Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
                Scan other pilgrims' QR codes to view their emergency contact information. Helpful for assisting lost persons or medical emergencies.
              </p>
              <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Scan className="h-4 w-4 mr-2" />
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
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-800">Recently Scanned:</p>
                  <p className="text-sm text-blue-700">{scannedProfile.name}</p>
                  <p className="text-xs text-blue-600">ID: {scannedProfile.qrId}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Live Safety Alerts */}
        <Card className="mb-8 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-6 w-6" />
              Live Safety Alerts
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">LIVE</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${getAlertPriorityColor(alert.priority)}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{alert.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>📍 {alert.location}</span>
                          <span>⏰ {new Date(alert.createdAt?.seconds * 1000).toLocaleTimeString()}</span>
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
              <p className="text-gray-500 text-center py-4">No active alerts at the moment</p>
            )}
          </CardContent>
        </Card>

        {/* Real-time Crowd Data */}
        <Card className="mb-8 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Users className="h-6 w-6" />
              Live Crowd Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crowdData.slice(0, 6).map((location, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getCrowdStatusColor(location.densityLevel)}`}>
                  <h4 className="font-semibold text-gray-800 text-sm">{location.location}</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Current Count:</span>
                      <span className="font-bold">{location.crowdCount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Wait Time:</span>
                      <span className="font-bold">{location.waitTime}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Status:</span>
                      <span className="font-bold capitalize">{location.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-purple-200 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
            <CardContent className="p-6 text-center">
              <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Interactive Map</h3>
              <p className="text-sm text-gray-600 mb-4">Navigate with AI-powered route optimization and real-time crowd density</p>
              <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                Open Live Map
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Lost & Found</h3>
              <p className="text-sm text-gray-600 mb-4">Report missing persons/items or search our database with AI matching</p>
              <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50">
                Access Service
              </Button>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Spiritual Events</h3>
              <p className="text-sm text-gray-600 mb-4">Live streaming, event reminders, and sacred ceremony schedules</p>
              <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                View Live Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}