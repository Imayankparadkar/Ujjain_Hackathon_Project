import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Map } from "@/components/ui/map";
import { Layout } from "@/components/Layout";
import { getDocuments, subscribeToCollection } from "@/lib/firebase";
import { Route, Navigation, Shield, Leaf, Microchip, Phone, Search, AlertTriangle, Calendar, MapPin, QrCode, MessageSquare, Bell } from "lucide-react";
import { Link } from "wouter";

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
  const [stats, setStats] = useState<Stats>({
    liveVisitors: 245786,
    safetyAlerts: 12,
    activeRoutes: 847,
    languages: 12,
  });
  const [spiritualEvents, setSpiritualEvents] = useState<SpiritualEvent[]>([]);
  const [crowdData, setCrowdData] = useState<any[]>([]);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    // Load initial data
    loadSpiritualEvents();
    loadCrowdData();

    // Simulate real-time stats updates
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        liveVisitors: prev.liveVisitors + Math.floor(Math.random() * 100) - 50,
        safetyAlerts: Math.floor(Math.random() * 20),
      }));
    }, 30000);

    return () => clearInterval(statsInterval);
  }, []);

  const loadSpiritualEvents = async () => {
    try {
      const events = await getDocuments("spiritualEvents");
      setSpiritualEvents((events as SpiritualEvent[]).slice(0, 3)); // Show only top 3
    } catch (error) {
      console.error("Error loading spiritual events:", error);
      // Set default events if Firebase fails
      setSpiritualEvents([
        {
          id: "1",
          name: "Maha Aarti",
          location: "Har Ki Pauri",
          dateTime: { toDate: () => new Date(Date.now() + 2 * 60 * 60 * 1000) },
          isLive: false,
        },
        {
          id: "2",
          name: "Ganga Puja",
          location: "Triveni Sangam",
          dateTime: { toDate: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
          isLive: false,
        },
        {
          id: "3",
          name: "Shahi Snan",
          location: "Main Bathing Ghat",
          dateTime: { toDate: () => new Date("2024-01-29T04:00:00") },
          isLive: false,
        }
      ]);
    }
  };

  const loadCrowdData = async () => {
    try {
      const data = await getDocuments("crowdData");
      setCrowdData(data);
    } catch (error) {
      console.error("Error loading crowd data:", error);
      // Set default crowd data if Firebase fails
      setCrowdData([
        { location: "Har Ki Pauri", latitude: "29.9457", longitude: "78.1642", crowdCount: 8500, densityLevel: "high" },
        { location: "Triveni Sangam", latitude: "25.4358", longitude: "81.8463", crowdCount: 3200, densityLevel: "medium" },
        { location: "Chandi Devi Temple", latitude: "29.9759", longitude: "78.1354", crowdCount: 1800, densityLevel: "low" },
      ]);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <section id="home" className="min-h-screen relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            SmartKumbh
            <span className="block text-accent">AI Powered Pilgrim Navigation & Safety</span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={() => scrollToSection("features")}
              className="bg-primary text-primary-foreground hover:bg-secondary transform hover:scale-105 transition-all"
              data-testid="explore-features-button"
            >
              <Navigation className="mr-2 h-5 w-5" />
              Explore Features
            </Button>
            <Button
              onClick={() => setShowDemoModal(true)}
              variant="outline"
              className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20"
              data-testid="watch-demo-button"
            >
              <div className="mr-2">▶️</div>
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2" data-testid="live-visitors-count">
                  {stats.liveVisitors.toLocaleString()}
                </div>
                <div className="text-muted-foreground">Live Visitors</div>
                <div className="flex items-center justify-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                  <span className="text-xs text-green-600">Live</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-destructive mb-2" data-testid="safety-alerts-count">
                  {stats.safetyAlerts}
                </div>
                <div className="text-muted-foreground">Safety Alerts</div>
                <div className="text-xs text-destructive mt-2">3 High Priority</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2" data-testid="active-routes-count">
                  {stats.activeRoutes}
                </div>
                <div className="text-muted-foreground">Active Routes</div>
                <div className="text-xs text-green-600 mt-2">24/7 Available</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-accent mb-2" data-testid="languages-count">
                  {stats.languages}
                </div>
                <div className="text-muted-foreground">Supported Languages</div>
                <div className="text-xs text-muted-foreground mt-2">Including Regional</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section id="map" className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Live Crowd & Route Navigation</h2>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            <div className="lg:col-span-7">
              <Card>
                <CardContent className="p-0">
                  <Map
                    className="h-96 rounded-lg"
                    crowdData={crowdData}
                    showHeatmap={true}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Quick Access</h3>

                  <Link href="/login">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-secondary mb-4" data-testid="generate-qr-button">
                      <QrCode className="mr-2 h-5 w-5" />
                      Generate My QR ID
                    </Button>
                  </Link>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Emergency Contacts</span>
                      <Phone className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Nearest Facilities</span>
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Language Settings</span>
                      <span className="h-4 w-4 text-accent">🌐</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Lost & Found Section */}
      <section id="lost-found" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Lost & Found Service</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/login">
              <Card className="group bg-gradient-to-br from-primary to-secondary text-white hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-2">Search Found</h3>
                  <p className="text-primary-foreground/80">Find your lost belongings or loved ones</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/login">
              <Card className="group bg-gradient-to-br from-accent to-primary text-white hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-2">Report Missing</h3>
                  <p className="text-primary-foreground/80">Report missing persons or items immediately</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Cleanliness Heatmap */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Community Cleanliness Monitor</h2>

          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="h-64 bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 heatmap-overlay" />
                  <div className="absolute top-4 left-4 bg-card p-3 rounded-lg border border-border">
                    <div className="text-sm font-medium mb-2">Cleanliness Rating</div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-xs">Excellent (90-100%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-xs">Good (70-89%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="text-xs">Needs Attention (Below 70%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Sample data points */}
                  <div className="absolute top-16 left-32 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg" />
                  <div className="absolute top-24 right-24 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg" />
                  <div className="absolute bottom-16 left-16 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg" />
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link href="/login">
                <Button className="bg-primary text-primary-foreground hover:bg-secondary" data-testid="submit-feedback-button">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Submit Feedback
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Spiritual Engagement */}
      <section id="spiritual" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Spiritual Engagement</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Live Spiritual Streaming</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm">LIVE</span>
                    </div>
                  </div>
                </div>
                <div
                  className="aspect-video bg-cover bg-center relative"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450')"
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button className="bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/30" data-testid="play-live-stream">
                      <div className="text-white text-2xl">▶️</div>
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                    Ganga Aarti - Har Ki Pauri
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Upcoming Rituals & Events</h3>

                <div className="space-y-4">
                  {spiritualEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                      <div>
                        <div className="font-medium" data-testid={`event-name-${event.id}`}>{event.name}</div>
                        <div className="text-sm text-muted-foreground" data-testid={`event-time-${event.id}`}>
                          {event.dateTime?.toDate ? event.dateTime.toDate().toLocaleString() : "Time TBD"}
                        </div>
                        <div className="text-xs text-muted-foreground" data-testid={`event-location-${event.id}`}>{event.location}</div>
                      </div>
                      <Link href="/login">
                        <Button variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/80" data-testid={`set-reminder-${event.id}`}>
                          <Bell className="mr-1 h-4 w-4" />
                          Set Reminder
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section id="features" className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Four Pillars of SmartKumbh</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Route className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Navigation</h3>
                <p className="text-sm text-muted-foreground">AI-powered route optimization and real-time crowd guidance</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-destructive/20 transition-colors">
                  <Shield className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">Safety</h3>
                <p className="text-sm text-muted-foreground">24/7 monitoring, emergency alerts and rapid response system</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Sanitation</h3>
                <p className="text-sm text-muted-foreground">Community-driven cleanliness monitoring and feedback system</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <Microchip className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Digital Ecosystem</h3>
                <p className="text-sm text-muted-foreground">Integrated digital services for seamless pilgrim experience</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Offline Banner */}
      <section className="py-8 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center text-primary-foreground">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Offline Assistance Available</h3>
            <p className="text-primary-foreground/90">
              Dial <strong>*123#</strong> or SMS <strong>HELP</strong> to <strong>12345</strong> for offline assistance
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">About SmartKumbh Initiative</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                SmartKumbh represents a revolutionary digital transformation of the world's largest spiritual gathering.
                Leveraging cutting-edge AI technology, real-time crowd management, and comprehensive safety systems,
                we ensure every pilgrim's journey is safe, spiritual, and seamless.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our platform integrates with government initiatives to provide multilingual support,
                emergency response systems, and digital identity management for millions of devotees.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">AI-Powered</div>
                <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm">24/7 Support</div>
                <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">Multilingual</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">Government & Partners</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-3xl text-primary mb-2">🏛️</div>
                    <div className="text-sm font-medium">Ministry of Culture</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-3xl text-accent mb-2">🇮🇳</div>
                    <div className="text-sm font-medium">Govt. of Uttar Pradesh</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-3xl text-secondary mb-2">🛰️</div>
                    <div className="text-sm font-medium">ISRO</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-3xl text-primary mb-2">💻</div>
                    <div className="text-sm font-medium">Digital India</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>SmartKumbh Demo</DialogTitle>
          </DialogHeader>
          <div
            className="aspect-video bg-cover bg-center rounded-lg relative"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675')"
            }}
          >
            <div className="absolute inset-0 bg-black/40 rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button className="bg-primary text-primary-foreground p-6 rounded-full hover:bg-secondary" data-testid="play-demo-video">
                <div className="text-3xl">▶️</div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
