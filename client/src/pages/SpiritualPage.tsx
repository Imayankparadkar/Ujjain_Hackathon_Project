import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Clock, MapPin, Bell, Play, Users, Heart, Sun, Moon, Grid, List, Loader2, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import type { SpiritualEvent } from "@shared/schema";

// Extended interface for UI-specific properties
interface SpiritualEventUI extends SpiritualEvent {
  attendees?: number;
  category?: "aarti" | "puja" | "snan" | "procession" | "discourse";
  significance?: string;
  streamUrl?: string;
}

interface LiveStream {
  id: string;
  title: string;
  isLive: boolean;
  viewers: number;
  location: string;
  thumbnail: string;
  streamUrl?: string;
}

export default function SpiritualPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SpiritualEventUI | null>(null);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [playingStream, setPlayingStream] = useState<string | null>(null);

  // Debug log to check viewMode state - can be removed after testing
  console.log('🔄 Current viewMode:', viewMode);
  const [reminderEvents, setReminderEvents] = useState<Set<string>>(new Set());

  // Helper functions to infer category and significance from event name
  const getCategoryFromName = (name: string): "aarti" | "puja" | "snan" | "procession" | "discourse" => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('aarti')) return 'aarti';
    if (nameLower.includes('snan') || nameLower.includes('bath')) return 'snan';
    if (nameLower.includes('procession') || nameLower.includes('naga')) return 'procession';
    if (nameLower.includes('discourse') || nameLower.includes('teaching')) return 'discourse';
    return 'puja';
  };

  const getSignificanceFromName = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('mahakal') || nameLower.includes('bhasma')) {
      return 'Sacred ritual performed with blessed ash, one of the most divine experiences.';
    }
    if (nameLower.includes('ganga') || nameLower.includes('aarti')) {
      return 'Sacred evening worship with oil lamps and devotional songs.';
    }
    if (nameLower.includes('snan')) {
      return 'Sacred bathing ritual for purification and spiritual cleansing.';
    }
    if (nameLower.includes('procession')) {
      return 'Sacred procession of holy men and devotees to the bathing ghats.';
    }
    return 'Ancient Vedic ritual for spiritual growth and divine blessings.';
  };

  // Fetch spiritual events from backend
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['/api/spiritual-events'],
    select: (data: SpiritualEvent[]) => {
      // Convert backend data to UI format and add UI-specific properties
      return data.map(event => ({
        ...event,
        dateTime: new Date(event.dateTime),
        attendees: Math.floor(Math.random() * 5000) + 500, // Generate realistic attendee count
        category: getCategoryFromName(event.name),
        significance: getSignificanceFromName(event.name),
        streamUrl: event.liveStreamUrl || `live_stream_${event.id}`,
      })) as SpiritualEventUI[];
    },
  });
  
  // Convert duration from minutes to readable format
  const formatDuration = (minutes?: number | null): string => {
    if (!minutes) return 'Duration TBD';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Initialize live streams data
  useEffect(() => {
    setLiveStreams([
      {
        id: "LS001",
        title: "Mahakal Temple Live Darshan",
        isLive: true,
        viewers: 45000,
        location: "Main Sanctum",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        streamUrl: "_RoV-sueMWs"
      },
      {
        id: "LS002", 
        title: "Shipra Ghat Live View",
        isLive: true,
        viewers: 12000,
        location: "Shipra River",
        thumbnail: "https://images.unsplash.com/photo-1544913580-877b069acc7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        streamUrl: "y90qP3MTG3c"
      }
    ]);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "aarti": return <Sun className="h-4 w-4" />;
      case "puja": return <Heart className="h-4 w-4" />;
      case "snan": return <MapPin className="h-4 w-4" />;
      case "procession": return <Users className="h-4 w-4" />;
      case "discourse": return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "aarti": return "bg-orange-100 text-orange-800 border-orange-200";
      case "puja": return "bg-red-100 text-red-800 border-red-200";
      case "snan": return "bg-blue-100 text-blue-800 border-blue-200";
      case "procession": return "bg-purple-100 text-purple-800 border-purple-200";
      case "discourse": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const setEventReminder = (event: SpiritualEventUI) => {
    const newReminders = new Set(reminderEvents);
    
    if (reminderEvents.has(event.id)) {
      newReminders.delete(event.id);
      toast({
        title: "🔕 Reminder Removed",
        description: `Reminder for ${event.name} has been cancelled.`,
      });
    } else {
      newReminders.add(event.id);
      
      // Calculate time until event
      const now = new Date();
      const eventTime = new Date(event.dateTime);
      const timeDiff = eventTime.getTime() - now.getTime();
      
      // Set browser notification if supported and permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        const reminderTime = Math.max(timeDiff - (15 * 60 * 1000), 5000); // 15 minutes before or 5 seconds if event is soon
        
        setTimeout(() => {
          new Notification(`🕉️ ${event.name} starts in 15 minutes!`, {
            body: `Location: ${event.location}`,
            icon: '/favicon.ico',
            tag: event.id
          });
        }, reminderTime);
      }
      
      toast({
        title: "🔔 Reminder Set!",
        description: `You'll be notified 15 minutes before ${event.name} starts.`,
      });
    }
    
    setReminderEvents(newReminders);
    localStorage.setItem('smartkumbh_reminders', JSON.stringify(Array.from(newReminders)));
  };

  // Load saved reminders on component mount
  useEffect(() => {
    const savedReminders = localStorage.getItem('smartkumbh_reminders');
    if (savedReminders) {
      try {
        const reminderArray = JSON.parse(savedReminders);
        setReminderEvents(new Set(reminderArray));
      } catch (error) {
        console.error('Error loading saved reminders:', error);
      }
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const getTimeUntilEvent = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff < 0) return "Event passed";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} away`;
    }
    
    if (hours > 0) {
      return `${hours}h ${minutes}m away`;
    }
    
    return `${minutes}m away`;
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <Layout>
        <section className="py-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Spiritual Engagement</h1>
            <p className="text-orange-50">Live streams, events, and spiritual experiences</p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading spiritual events...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <section className="py-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Spiritual Engagement</h1>
            <p className="text-orange-50">Live streams, events, and spiritual experiences</p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-500 mb-4">Failed to load spiritual events</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/spiritual-events'] })}>
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

  const liveEvents = events.filter(e => e.isLive);
  const upcomingEvents = events.filter(e => !e.isLive && e.dateTime > new Date());

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">Spiritual Events & Live Streams</h1>
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Experience divine ceremonies and spiritual gatherings in real-time during your sacred journey
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{events?.length || 0}</div>
              <div className="text-lg text-white/80 font-medium">Live Events</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{liveStreams.filter(s => s.isLive).length}</div>
              <div className="text-lg text-white/80 font-medium">Live Streams</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{reminderEvents.size}</div>
              <div className="text-lg text-white/80 font-medium">Your Reminders</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-lg text-white/80 font-medium">Live Coverage</div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'secondary' : 'outline'}
              size="lg"
              className={viewMode === 'list' ? "bg-white text-orange-600" : "border-white text-white hover:bg-white hover:text-orange-600"}
              data-testid="view-list"
            >
              <List className="h-5 w-5 mr-2" />
              List View
            </Button>
            <Button 
              onClick={() => setViewMode('calendar')}
              variant={viewMode === 'calendar' ? 'secondary' : 'outline'}
              size="lg"
              className={viewMode === 'calendar' ? "bg-white text-orange-600" : "border-white text-white hover:bg-white hover:text-orange-600"}
              data-testid="view-calendar"
            >
              <Grid className="h-5 w-5 mr-2" />
              Calendar View
            </Button>
          </div>
        </div>
      </section>

      {/* Live Streams Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-4"></div>
              Live Streams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience sacred ceremonies in real-time from the comfort of your location</p>
            <div className="mt-6">
              <Badge className="bg-red-500 text-white px-6 py-3 text-lg font-semibold rounded-2xl">
                🔴 {liveStreams.reduce((total, stream) => total + stream.viewers, 0).toLocaleString()} people watching live
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {liveStreams.map((stream) => (
              <Card key={stream.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden">
                <div className="relative">
                  {playingStream === stream.id ? (
                    <div className="aspect-video relative">
                      <iframe
                        src={`https://www.youtube.com/embed/${stream.streamUrl}?autoplay=1&rel=0&modestbranding=1`}
                        title={stream.title}
                        className="w-full h-full rounded-t-3xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        data-testid={`video-player-${stream.id}`}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                        onClick={() => setPlayingStream(null)}
                        data-testid={`close-video-${stream.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="aspect-video bg-cover bg-center cursor-pointer"
                      style={{ backgroundImage: `url('${stream.thumbnail}')` }}
                      onClick={() => {
                        setPlayingStream(stream.id);
                        toast({
                          title: "🔴 Live Stream Started",
                          description: `Now watching: ${stream.title} • ${stream.viewers.toLocaleString()} viewers`,
                        });
                      }}
                    >
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button 
                          className="bg-white/20 backdrop-blur-md w-20 h-20 rounded-full hover:bg-white/30 group-hover:scale-110 transition-all duration-300 shadow-2xl"
                          data-testid={`play-stream-${stream.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingStream(stream.id);
                            toast({
                              title: "🔴 Live Stream Started",
                              description: `Now watching: ${stream.title} • ${stream.viewers.toLocaleString()} viewers`,
                            });
                          }}
                        >
                          <Play className="text-white h-8 w-8" />
                        </Button>
                      </div>
                      <div className="absolute top-6 left-6 flex items-center space-x-2">
                        <div className="bg-red-500 text-white px-4 py-2 rounded-2xl text-base font-bold flex items-center shadow-lg">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2"></div>
                          LIVE
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 bg-black/70 text-white px-4 py-2 rounded-2xl font-semibold">
                        👥 {stream.viewers.toLocaleString()} viewers
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{stream.title}</h3>
                  <div className="flex items-center text-base text-gray-600">
                    <div className="bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <MapPin className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="font-medium">{stream.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Events */}
      {liveEvents.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse mr-4"></div>
                Happening Now
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Join spiritual ceremonies and rituals currently taking place</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {liveEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden">
                  <CardHeader className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                          {getCategoryIcon(event.category || 'puja')}
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-gray-800 mb-1">{event.name}</CardTitle>
                          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 rounded-2xl text-sm font-semibold">
                            🔴 LIVE NOW
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8 pt-0 space-y-6">
                    <p className="text-base text-gray-600 leading-relaxed">{event.description}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Location</div>
                          <div className="text-base text-gray-800 font-semibold">{event.location}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Attending</div>
                          <div className="text-base text-gray-800 font-semibold">{(event.attendees || 0).toLocaleString()} people</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Duration</div>
                          <div className="text-base text-gray-800 font-semibold">{formatDuration(event.duration)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg"
                        data-testid={`watch-live-${event.id}`}
                        onClick={() => {
                          const streamUrl = event.liveStreamUrl || `https://www.youtube.com/watch?v=${event.id}`;
                          const streamWindow = window.open(streamUrl, '_blank', 'width=1200,height=700,scrollbars=yes,resizable=yes');
                          if (streamWindow) {
                            streamWindow.focus();
                          } else {
                            window.location.href = streamUrl;
                          }
                          toast({
                            title: "🔴 Joining Live Event",
                            description: `Now watching: ${event.name} live stream`,
                          });
                        }}
                      >
                        <Play className="h-5 w-5 mr-3" />
                        Watch Live Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events & Rituals</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover sacred ceremonies and spiritual gatherings planned for your journey</p>
          </div>
          
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-3xl p-3 shadow-lg">
              <div className="flex items-center space-x-3">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                    viewMode === 'list' 
                      ? 'bg-orange-600 text-white shadow-lg' 
                      : 'bg-transparent text-gray-600 hover:bg-orange-50'
                  }`}
                  data-testid="list-view-toggle"
                >
                  <List className="h-5 w-5 mr-2" />
                  List View
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  onClick={() => setViewMode('calendar')}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                    viewMode === 'calendar' 
                      ? 'bg-orange-600 text-white shadow-lg' 
                      : 'bg-transparent text-gray-600 hover:bg-orange-50'
                  }`}
                  data-testid="calendar-view-toggle"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Calendar View
                </Button>
              </div>
            </div>
          </div>

          {viewMode === 'calendar' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border-0"
                      modifiers={{
                        eventDay: events.map(event => new Date(event.dateTime.toDateString())),
                        today: new Date()
                      }}
                      modifiersStyles={{
                        eventDay: {
                          backgroundColor: 'hsl(var(--primary))',
                          color: 'hsl(var(--primary-foreground))',
                          fontWeight: 'bold',
                          borderRadius: '6px',
                          transform: 'scale(1.05)',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        },
                        today: {
                          backgroundColor: 'hsl(var(--secondary))',
                          color: 'hsl(var(--secondary-foreground))',
                          fontWeight: 'bold',
                          border: '2px solid hsl(var(--primary))',
                          borderRadius: '6px'
                        }
                      }}
                    />
                    <div className="mt-4 space-y-3">
                      <p className="font-semibold text-sm text-foreground">📅 Calendar Legend:</p>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-primary rounded-md shadow-sm"></div>
                          <span className="text-muted-foreground">Events scheduled</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-secondary border-2 border-primary rounded-md"></div>
                          <span className="text-muted-foreground">Today</span>
                        </div>
                      </div>
                      {selectedDate && (
                        <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                          <p className="text-sm font-medium text-foreground">
                            📆 {selectedDate.toLocaleDateString('en-IN', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          {events.filter(event => 
                            new Date(event.dateTime.toDateString()).getTime() === 
                            new Date(selectedDate.toDateString()).getTime()
                          ).length > 0 ? (
                            <p className="text-xs text-primary mt-1 font-medium">
                              🎉 {events.filter(event => 
                                new Date(event.dateTime.toDateString()).getTime() === 
                                new Date(selectedDate.toDateString()).getTime()
                              ).length} event(s) scheduled
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-1">
                              No events scheduled
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Selected Date Events */}
              <div className="lg:col-span-2">
                <h3 className="font-semibold mb-4">
                  {selectedDate ? `Events on ${selectedDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` : 'Select a date to view events'}
                </h3>
                <div className="space-y-4">
                  {selectedDate && events
                    .filter(event => event.dateTime.toDateString() === selectedDate.toDateString())
                    .map((event) => (
                      <Card key={event.id} className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{event.name}</h4>
                            <Badge className={getCategoryColor(event.category || 'puja')}>
                              {event.category || 'puja'}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3" />
                              <span>{event.dateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-3 w-3" />
                              <span>{(event.attendees || 0).toLocaleString()} expected</span>
                            </div>
                          </div>
                          <p className="text-sm mt-2">{event.description}</p>
                          <div className="flex space-x-2 mt-3">
                            <Button 
                              size="sm" 
                              variant={reminderEvents.has(event.id) ? "default" : "outline"}
                              className={`flex-1 transition-colors ${
                                reminderEvents.has(event.id) 
                                  ? "bg-orange-500 text-white hover:bg-orange-600" 
                                  : "hover:bg-orange-500 hover:text-white border-orange-300"
                              }`}
                              onClick={() => setEventReminder(event)}
                            >
                              <Bell className={`h-3 w-3 mr-1 ${reminderEvents.has(event.id) ? 'animate-pulse' : ''}`} />
                              {reminderEvents.has(event.id) ? 'Reminder Set' : 'Set Reminder'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 hover:bg-orange-100 hover:text-orange-800 border-orange-300 transition-colors"
                              onClick={() => {
                                const coords = event.location.includes('Mahakaleshwar') ? '23.1828,75.7681' : '23.1765,75.7661';
                                window.open(`https://www.openstreetmap.org/directions?from=&to=${coords}`, '_blank');
                              }}
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              Get Directions
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-orange-500 text-white hover:bg-orange-600"
                              onClick={() => {
                                toast({
                                  title: "🎉 Event Joined!",
                                  description: `You've successfully joined ${event.name}. You'll receive updates about this event.`,
                                });
                              }}
                            >
                              Join Event
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  {selectedDate && events.filter(event => event.dateTime.toDateString() === selectedDate.toDateString()).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No events scheduled for this date</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden">
                  <CardHeader className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          event.category === 'aarti' ? 'bg-orange-100' :
                          event.category === 'puja' ? 'bg-red-100' :
                          event.category === 'snan' ? 'bg-blue-100' :
                          event.category === 'procession' ? 'bg-purple-100' :
                          'bg-green-100'
                        }`}>
                          {getCategoryIcon(event.category || 'puja')}
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-gray-800 mb-2">{event.name}</CardTitle>
                          <Badge className={`${getCategoryColor(event.category || 'puja')} px-3 py-1 rounded-2xl text-sm font-semibold`}>
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(event.category || 'puja')}
                              <span className="capitalize">{event.category || 'puja'}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8 pt-0 space-y-6">
                    <p className="text-base text-gray-600 leading-relaxed">{event.description}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                          <CalendarIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Date & Time</div>
                          <div className="text-base text-gray-800 font-semibold">{formatDateTime(event.dateTime)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Time until event</div>
                          <div className="text-base text-gray-800 font-semibold">{getTimeUntilEvent(event.dateTime)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Location</div>
                          <div className="text-base text-gray-800 font-semibold">{event.location}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Expected attendees</div>
                          <div className="text-base text-gray-800 font-semibold">{(event.attendees || 0).toLocaleString()} people</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant={reminderEvents.has(event.id) ? "default" : "outline"}
                          className={`py-3 rounded-2xl font-semibold transition-all ${
                            reminderEvents.has(event.id) 
                              ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg" 
                              : "border-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                          }`}
                          data-testid={`set-reminder-${event.id}`}
                          onClick={() => setEventReminder(event)}
                        >
                          <Bell className={`h-5 w-5 mr-2 ${reminderEvents.has(event.id) ? 'animate-pulse' : ''}`} />
                          {reminderEvents.has(event.id) ? 'Reminder Set' : 'Set Reminder'}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-2xl font-semibold"
                          onClick={() => {
                            const coords = event.location.includes('Mahakaleshwar') ? '23.1828,75.7681' : '23.1765,75.7661';
                            window.open(`https://www.openstreetmap.org/directions?from=&to=${coords}`, '_blank');
                          }}
                        >
                          <MapPin className="h-5 w-5 mr-2" />
                          Directions
                        </Button>
                      </div>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg"
                        onClick={() => {
                          toast({
                            title: "🎉 Event Joined!",
                            description: `You've successfully joined ${event.name}. You'll receive updates about this event.`,
                          });
                        }}
                      >
                        <Users className="h-5 w-5 mr-3" />
                        Join Event ({(event.attendees || 0).toLocaleString()}+ attending)
                      </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full text-muted-foreground hover:text-foreground" 
                          data-testid={`learn-more-${event.id}`}
                        >
                          Learn More About This Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Set Event Reminder</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="text-sm space-y-2">
                            <h4 className="font-semibold">{selectedEvent?.name}</h4>
                            <p><strong>Time:</strong> {selectedEvent && formatDateTime(selectedEvent.dateTime)}</p>
                            <p><strong>Location:</strong> {selectedEvent?.location}</p>
                            <p><strong>Duration:</strong> {formatDuration(selectedEvent?.duration)}</p>
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <h5 className="font-medium mb-2">Spiritual Significance:</h5>
                            <p className="text-sm text-muted-foreground">{selectedEvent?.significance}</p>
                          </div>
                          <div className="flex space-x-3">
                            <Button 
                              className="flex-1 bg-orange-500 text-white hover:bg-orange-600" 
                              data-testid="confirm-reminder"
                              onClick={() => {
                                if (selectedEvent) {
                                  setEventReminder(selectedEvent);
                                }
                              }}
                            >
                              <Bell className="h-4 w-4 mr-2" />
                              {selectedEvent && reminderEvents.has(selectedEvent.id) ? 'Remove Reminder' : 'Set Reminder'}
                            </Button>
                            <Button variant="outline" className="flex-1">Cancel</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="outline" 
                      className="w-full" 
                      data-testid={`learn-more-${event.id}`}
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Spiritual Timings */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Daily Spiritual Timings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Sun className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Mangal Aarti</h3>
                <p className="text-sm text-muted-foreground">4:00 AM - 5:00 AM</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Bhasma Aarti</h3>
                <p className="text-sm text-muted-foreground">6:00 AM - 7:00 AM</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Madhyan Aarti</h3>
                <p className="text-sm text-muted-foreground">12:00 PM - 1:00 PM</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Moon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Sandhya Aarti</h3>
                <p className="text-sm text-muted-foreground">7:00 PM - 8:00 PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}