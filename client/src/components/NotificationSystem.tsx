import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, AlertTriangle, Info, CheckCircle, MapPin, Users, Calendar } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  timestamp: Date;
  isRead: boolean;
  location?: string;
  actionUrl?: string;
}

interface NotificationSystemProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUnreadCountChange?: (count: number) => void;
}

export function NotificationSystem({ isOpen = false, onOpenChange, onUnreadCountChange }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Generate real-time notifications with dummy data
    generateDummyNotifications();
    
    // Simulate real-time notifications
    const interval = setInterval(() => {
      generateRandomNotification();
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const count = notifications.filter(n => !n.isRead).length;
    setUnreadCount(count);
    onUnreadCountChange?.(count);
  }, [notifications, onUnreadCountChange]);

  const generateDummyNotifications = () => {
    const dummyNotifications: Notification[] = [
      {
        id: "1",
        title: "High Crowd Alert",
        message: "Mahakal Temple experiencing very high crowd density. Expected wait time: 45 minutes.",
        type: "warning",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false,
        location: "Mahakal Temple",
        actionUrl: "/map"
      },
      {
        id: "2", 
        title: "Weather Update",
        message: "Light rain expected between 6-8 PM. Carry umbrellas and use covered paths.",
        type: "info",
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        isRead: false,
        location: "All Areas"
      },
      {
        id: "3",
        title: "Route Optimization",
        message: "New faster route available to Mahakal Temple via Female Devotee Path (35 min).",
        type: "success", 
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: true,
        location: "Navigation System"
      },
      {
        id: "4",
        title: "Live Stream Starting",
        message: "Bhasma Aarti ceremony will begin in 10 minutes. Join the live stream now.",
        type: "info",
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        isRead: false,
        actionUrl: "/spiritual"
      },
      {
        id: "5",
        title: "Emergency Alert",
        message: "Medical assistance requested at Section B-12. Avoid the area temporarily.",
        type: "urgent",
        timestamp: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
        isRead: false,
        location: "Section B-12"
      }
    ];

    setNotifications(dummyNotifications);
  };

  const generateRandomNotification = () => {
    const randomNotifications = [
      {
        title: "Crowd Update",
        message: "Crowd levels decreasing at Main Gate. Good time to visit!",
        type: "success" as const,
        location: "Main Gate"
      },
      {
        title: "Lost & Found Update", 
        message: "3 new items reported found in the past hour. Check if any belong to you.",
        type: "info" as const,
        actionUrl: "/lost-found"
      },
      {
        title: "Facility Alert",
        message: "Toilet Block C temporarily closed for maintenance. Use Block D nearby.",
        type: "warning" as const,
        location: "Toilet Block C"
      },
      {
        title: "Spiritual Reminder",
        message: "Sandhya Aarti ceremony starting in 15 minutes at riverside.",
        type: "info" as const,
        actionUrl: "/spiritual"
      }
    ];

    const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...randomNotif,
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only latest 10
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'urgent': return 'bg-red-50 border-red-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <>
      {/* Notification Panel - Positioned under header */}
      {isOpen && (
        <div className="fixed top-16 right-4 w-80 max-h-96 z-50">
          <Card className="shadow-2xl border-2">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  onClick={() => onOpenChange?.(false)}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b last:border-b-0 ${getNotificationColor(notification.type)} ${
                      !notification.isRead ? 'border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <Button
                            onClick={() => removeNotification(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6 opacity-50 hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{formatTime(notification.timestamp)}</span>
                            {notification.location && (
                              <>
                                <span>•</span>
                                <MapPin className="h-3 w-3" />
                                <span>{notification.location}</span>
                              </>
                            )}
                          </div>
                          {!notification.isRead && (
                            <Button
                              onClick={() => markAsRead(notification.id)}
                              variant="ghost"
                              size="sm"
                              className="text-xs px-2 py-1 h-6"
                            >
                              Mark read
                            </Button>
                          )}
                        </div>
                        {notification.actionUrl && (
                          <Button
                            onClick={() => {
                              markAsRead(notification.id);
                              // Navigate to action URL
                            }}
                            variant="outline"
                            size="sm"
                            className="mt-2 text-xs px-3 py-1 h-7"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}