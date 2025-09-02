import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "@/components/ui/map";
import { QRCodeGenerator } from "@/components/ui/qr-code";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { getDocuments, subscribeToCollection, addDocument } from "@/lib/firebase";
import { Download, Printer, Star, Bell, MapPin, Search, AlertTriangle, Settings, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavedRoute {
  id: string;
  name: string;
  location: string;
}

interface Alert {
  id: string;
  title: string;
  message: string;
  priority: string;
  createdAt: any;
}

interface Report {
  id: string;
  type: string;
  location: string;
  status: string;
  createdAt: any;
}

export default function UserDashboard() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([
    { id: "1", name: "Har Ki Pauri", location: "Main Ghat" },
    { id: "2", name: "Triveni Sangam", location: "Confluence" },
    { id: "3", name: "Chandi Devi", location: "Temple" },
  ]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [crowdData, setCrowdData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    
    // Subscribe to real-time updates
    const unsubscribeAlerts = subscribeToCollection(
      "safetyAlerts",
      (data) => setAlerts(data.filter((alert: any) => alert.isActive)),
      [/* orderBy("createdAt", "desc") */]
    );

    const unsubscribeCrowd = subscribeToCollection(
      "crowdData",
      (data) => setCrowdData(data)
    );

    return () => {
      unsubscribeAlerts();
      unsubscribeCrowd();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load user reports
      const userReports = await getDocuments("cleanlinessReports");
      setReports((userReports as Report[]).slice(0, 5)); // Show recent 5 reports

      // Load upcoming events
      const upcomingEvents = await getDocuments("spiritualEvents");
      setEvents(upcomingEvents.slice(0, 3));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `SmartKumbh-QR-${userProfile?.qrId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
    toast({
      title: "QR Code Downloaded",
      description: "Your QR code has been saved to your device.",
    });
  };

  const printQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>SmartKumbh QR Code</title></head>
            <body style="text-align: center; padding: 20px;">
              <h2>SmartKumbh Pilgrim ID</h2>
              <p>Name: ${userProfile?.name}</p>
              <p>QR ID: ${userProfile?.qrId}</p>
              <img src="${canvas.toDataURL()}" style="margin: 20px 0;" />
              <p>Keep this QR code safe for identification</p>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
    toast({
      title: "QR Code Printed",
      description: "Your QR code is being printed.",
    });
  };

  const addRoute = async (routeName: string) => {
    try {
      // In a real app, this would update the user's savedRoutes in Firebase
      const newRoute = {
        id: Date.now().toString(),
        name: routeName,
        location: "Location TBD"
      };
      setSavedRoutes(prev => [...prev, newRoute]);
      
      toast({
        title: "Route Added",
        description: `${routeName} has been added to your saved routes.`,
      });
    } catch (error) {
      console.error("Error adding route:", error);
    }
  };

  const setEventReminder = async (eventId: string, eventName: string) => {
    try {
      // In a real app, this would update the event's reminderUserIds in Firebase
      toast({
        title: "Reminder Set",
        description: `You'll be notified before ${eventName} begins.`,
      });
    } catch (error) {
      console.error("Error setting reminder:", error);
    }
  };

  return (
    <Layout>
      {/* Quick Panel */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* My QR ID */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <div className="text-primary mr-2">📱</div>
                  My QR ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <QRCodeGenerator
                    value={userProfile?.qrId || "KMB-2024-DEMO"}
                    size={120}
                  />
                  <div className="text-xs text-muted-foreground mt-2" data-testid="user-qr-id">
                    ID: {userProfile?.qrId || "KMB-2024-DEMO"}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={downloadQR}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-secondary text-sm"
                    data-testid="download-qr-button"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    onClick={printQR}
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/80 text-sm"
                    data-testid="print-qr-button"
                  >
                    <Printer className="mr-1 h-4 w-4" />
                    Printer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Saved Routes */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Star className="text-accent mr-2 h-5 w-5" />
                  Saved Routes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {savedRoutes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm" data-testid={`saved-route-${route.id}`}>{route.name}</span>
                      <Star className="h-4 w-4 text-accent" />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => addRoute("New Favorite")}
                  variant="ghost"
                  className="w-full mt-3 text-primary hover:text-secondary text-sm"
                  data-testid="add-route-button"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add New Route
                </Button>
              </CardContent>
            </Card>

            {/* Alerts & Notifications */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="text-destructive mr-2 h-5 w-5" />
                  Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 2).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded text-sm border ${
                        alert.priority === "high" || alert.priority === "critical"
                          ? "bg-destructive/10 border-destructive/20"
                          : "bg-accent/10 border-accent/20"
                      }`}
                    >
                      <div className={`font-medium ${
                        alert.priority === "high" || alert.priority === "critical"
                          ? "text-destructive"
                          : "text-accent"
                      }`} data-testid={`alert-title-${alert.id}`}>
                        {alert.title}
                      </div>
                      <div className="text-xs text-muted-foreground" data-testid={`alert-message-${alert.id}`}>
                        {alert.message}
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      No active alerts
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Event Reminders */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <div className="text-primary mr-2">🗓️</div>
                  Event Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 2).map((event) => (
                    <div key={event.id} className="p-2 bg-muted rounded text-sm">
                      <div className="font-medium" data-testid={`event-name-${event.id}`}>{event.name}</div>
                      <div className="text-xs text-muted-foreground" data-testid={`event-time-${event.id}`}>
                        {event.dateTime?.toDate ? event.dateTime.toDate().toLocaleString() : "Time TBD"}
                      </div>
                      <Button
                        onClick={() => setEventReminder(event.id, event.name)}
                        variant="ghost"
                        size="sm"
                        className="mt-1 p-0 h-6 text-xs text-primary"
                        data-testid={`set-reminder-${event.id}`}
                      >
                        🔔 Set Reminder
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            <div className="lg:col-span-7">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Personalized Navigation Map</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Map
                    className="h-96 rounded-b-lg"
                    crowdData={crowdData}
                    showHeatmap={true}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-6">
              {/* My Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div key={report.id} className="p-3 bg-muted rounded border-l-4 border-l-accent">
                        <div className="text-sm font-medium" data-testid={`report-type-${report.id}`}>
                          {report.type} Report
                        </div>
                        <div className="text-xs text-muted-foreground" data-testid={`report-location-${report.id}`}>
                          {report.location} - Submitted recently
                        </div>
                        <div className={`text-xs mt-1 ${
                          report.status === "resolved" ? "text-green-600" : "text-accent"
                        }`} data-testid={`report-status-${report.id}`}>
                          {report.status === "resolved" ? "✓ Resolved" : "⏳ Under Review"}
                        </div>
                      </div>
                    ))}
                    {reports.length === 0 && (
                      <div className="text-center text-sm text-muted-foreground py-4">
                        No reports submitted yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Spiritual Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Spiritual Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/10 rounded border border-accent/20">
                      <div className="text-sm font-medium">Daily Aarti</div>
                      <div className="text-xs text-muted-foreground">6:30 PM - Har Ki Pauri</div>
                      <Button variant="ghost" size="sm" className="mt-2 p-0 h-6 text-xs text-accent" data-testid="aarti-reminder">
                        🔔 Reminder Set
                      </Button>
                    </div>
                    <div className="p-3 bg-primary/10 rounded border border-primary/20">
                      <div className="text-sm font-medium">Personal Prayer Time</div>
                      <div className="text-xs text-muted-foreground">Customized for you</div>
                      <Button variant="ghost" size="sm" className="mt-2 p-0 h-6 text-xs text-primary" data-testid="customize-prayer">
                        ⚙️ Customize
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Actions */}
      <section className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="report-missing-button">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Report Missing
              </Button>
              <Button className="bg-green-600 text-white hover:bg-green-700" data-testid="search-found-button">
                <Search className="mr-2 h-5 w-5" />
                Search Found
              </Button>
            </div>

            <Button className="bg-accent text-accent-foreground hover:bg-accent/80" data-testid="profile-settings-button">
              <Settings className="mr-2 h-5 w-5" />
              Profile Settings
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
