import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Clock, MapPin, Bell, Play, Users, Heart, Sun, Moon, Grid, List } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface SpiritualEvent {
  id: string;
  name: string;
  location: string;
  dateTime: Date;
  duration: string;
  isLive: boolean;
  attendees: number;
  description: string;
  category: "aarti" | "puja" | "snan" | "procession" | "discourse";
  significance: string;
  streamUrl?: string;
}

export default function SpiritualPage() {
  const [events, setEvents] = useState<SpiritualEvent[]>([]);
  const [liveStreams, setLiveStreams] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SpiritualEvent | null>(null);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');

  useEffect(() => {
    // Mock spiritual events data
    const mockEvents: SpiritualEvent[] = [
      {
        id: "SE001",
        name: "Mahakal Bhasma Aarti",
        location: "Mahakaleshwar Temple Sanctum",
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: "45 minutes",
        isLive: true,
        attendees: 2500,
        description: "Sacred ash ceremony performed at dawn, one of the most divine experiences at Mahakal",
        category: "aarti",
        significance: "This is the most sacred ritual of Lord Mahakaleshwar, performed with blessed ash from the cremation grounds.",
        streamUrl: "live_stream_1"
      },
      {
        id: "SE002",
        name: "Ganga Aarti",
        location: "Shipra Ghat",
        dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        duration: "30 minutes",
        isLive: false,
        attendees: 1800,
        description: "Evening prayer ceremony at the sacred Shipra river",
        category: "aarti",
        significance: "Daily evening worship of the sacred Shipra river with oil lamps and mantras.",
        streamUrl: "live_stream_2"
      },
      {
        id: "SE003",
        name: "Shahi Snan",
        location: "Triveni Sangam",
        dateTime: new Date("2025-01-29T04:00:00"),
        duration: "4 hours",
        isLive: false,
        attendees: 50000,
        description: "Royal bath ceremony - the most auspicious bathing day",
        category: "snan",
        significance: "The most sacred bathing ritual where devotees wash away sins and attain moksha.",
        streamUrl: "live_stream_3"
      },
      {
        id: "SE004",
        name: "Rudra Abhishek",
        location: "Mahakaleshwar Temple",
        dateTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
        duration: "90 minutes",
        isLive: false,
        attendees: 800,
        description: "Sacred ritual pouring of holy substances on Shiva Linga",
        category: "puja",
        significance: "Ancient Vedic ritual for purification and blessings of Lord Shiva.",
        streamUrl: "live_stream_4"
      },
      {
        id: "SE005",
        name: "Naga Sadhu Procession",
        location: "Main Processional Route",
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        duration: "2 hours",
        isLive: false,
        attendees: 15000,
        description: "Procession of revered Naga Sadhus to the bathing ghats",
        category: "procession",
        significance: "Sacred procession of holy men who have renounced worldly possessions.",
        streamUrl: "live_stream_5"
      },
      {
        id: "SE006",
        name: "Spiritual Discourse",
        location: "Kalidas Academy",
        dateTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
        duration: "2 hours",
        isLive: false,
        attendees: 500,
        description: "Discourse on Vedic philosophy and spiritual practices",
        category: "discourse",
        significance: "Teaching session on ancient wisdom and spiritual practices by renowned saints.",
        streamUrl: "live_stream_6"
      },
      // Add more events for calendar demonstration
      {
        id: "SE007",
        name: "Morning Meditation",
        location: "Harsiddhi Temple",
        dateTime: new Date(Date.now() + 10 * 60 * 60 * 1000),
        duration: "1 hour",
        isLive: false,
        attendees: 200,
        description: "Guided meditation session for inner peace",
        category: "puja",
        significance: "Daily meditation practice for spiritual growth",
        streamUrl: "live_stream_7"
      },
      {
        id: "SE008",
        name: "Bhajan Sandhya",
        location: "Ram Ghat",
        dateTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
        duration: "90 minutes",
        isLive: false,
        attendees: 1500,
        description: "Evening devotional songs and prayers",
        category: "aarti",
        significance: "Community singing of devotional songs",
        streamUrl: "live_stream_8"
      },
      {
        id: "SE009",
        name: "Yoga Session",
        location: "Sandipani Ashram",
        dateTime: new Date(Date.now() + 30 * 60 * 60 * 1000),
        duration: "75 minutes",
        isLive: false,
        attendees: 300,
        description: "Traditional yoga and pranayama practice",
        category: "puja",
        significance: "Ancient practice for physical and mental wellness",
        streamUrl: "live_stream_9"
      }
    ];

    setEvents(mockEvents.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()));

    // Mock live streams
    setLiveStreams([
      {
        id: "LS001",
        title: "Mahakal Temple Live Darshan",
        isLive: true,
        viewers: 45000,
        location: "Main Sanctum",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        id: "LS002", 
        title: "Shipra Ghat Live View",
        isLive: true,
        viewers: 12000,
        location: "Shipra River",
        thumbnail: "https://images.unsplash.com/photo-1544913580-877b069acc7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
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

  const liveEvents = events.filter(e => e.isLive);
  const upcomingEvents = events.filter(e => !e.isLive && e.dateTime > new Date());

  return (
    <Layout>
      {/* Header */}
      <section className="py-8 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Spiritual Engagement</h1>
          <p className="text-primary-foreground/90">Live streams, events, and spiritual experiences</p>
        </div>
      </section>

      {/* Live Streams Section */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-3"></div>
              Live Streams
            </h2>
            <Badge className="bg-red-500 text-white">
              {liveStreams.reduce((total, stream) => total + stream.viewers, 0).toLocaleString()} watching
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {liveStreams.map((stream) => (
              <Card key={stream.id} className="group hover:shadow-lg transition-all overflow-hidden">
                <div className="relative">
                  <div
                    className="aspect-video bg-cover bg-center"
                    style={{ backgroundImage: `url('${stream.thumbnail}')` }}
                  >
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button 
                        className="bg-white/20 backdrop-blur-md p-6 rounded-full hover:bg-white/30 group-hover:scale-110 transition-all"
                        data-testid={`play-stream-${stream.id}`}
                      >
                        <Play className="text-white text-2xl" />
                      </Button>
                    </div>
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                        LIVE
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded">
                      {stream.viewers.toLocaleString()} viewers
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{stream.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {stream.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Events */}
      {liveEvents.length > 0 && (
        <section className="py-8 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
              Happening Now
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-lg transition-all border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(event.category)}
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        LIVE
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-accent" />
                        <span>{event.attendees.toLocaleString()} attending</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.duration}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{event.description}</p>

                    <div className="space-y-2 pt-2">
                      <Button className="w-full bg-green-600 text-white hover:bg-green-700" data-testid={`watch-live-${event.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Watch Live
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
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Upcoming Events & Rituals</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center space-x-1"
                data-testid="list-view-toggle"
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="flex items-center space-x-1"
                data-testid="calendar-view-toggle"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Calendar</span>
              </Button>
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
                            <Badge className={getCategoryColor(event.category)}>
                              {event.category}
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
                              <span>{event.attendees.toLocaleString()} expected</span>
                            </div>
                          </div>
                          <p className="text-sm mt-2">{event.description}</p>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline">
                              <Bell className="h-3 w-3 mr-1" />
                              Remind Me
                            </Button>
                            <Button size="sm" variant="outline">
                              Learn More
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">{event.name}</CardTitle>
                      <Badge className={getCategoryColor(event.category)}>
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(event.category)}
                          <span className="capitalize">{event.category}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{formatDateTime(event.dateTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-accent" />
                      <span>{getTimeUntilEvent(event.dateTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span>{event.attendees.toLocaleString()} expected</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{event.description}</p>

                  <div className="space-y-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          data-testid={`set-reminder-${event.id}`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          Set Reminder
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
                            <p><strong>Duration:</strong> {selectedEvent?.duration}</p>
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <h5 className="font-medium mb-2">Spiritual Significance:</h5>
                            <p className="text-sm text-muted-foreground">{selectedEvent?.significance}</p>
                          </div>
                          <div className="flex space-x-3">
                            <Button className="flex-1" data-testid="confirm-reminder">
                              <Bell className="h-4 w-4 mr-2" />
                              Set Reminder
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