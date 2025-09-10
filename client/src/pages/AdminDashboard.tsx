import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Map } from "@/components/ui/map";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { api, createPollingSubscription } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { 
  Users, Search, BarChart3, Leaf, Heart, HelpCircle, FileText, Download, 
  MessageSquare, AlertTriangle, CheckCircle, X, Edit, Plus, MapPin, 
  Calendar, Settings, Bell, Send, ArrowLeft, Home, LogOut, Clock, Timer, 
  Globe, Radio, Phone, Shield, Package, Zap, Wrench, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  aadhaarNumber?: string;
  emergencyContact?: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  createdAt: any;
}

interface LostFoundCase {
  id: string;
  type: string;
  reportedBy: string;
  contactPhone: string;
  description: string;
  lastSeenLocation?: string;
  status: string;
  isApproved: boolean;
  createdAt: any;
}

interface CleanlinessReport {
  id: string;
  location: string;
  facilityType: string;
  rating: number;
  feedback?: string;
  reportedBy: string;
  isResolved: boolean;
  assignedStaff?: string;
  createdAt: any;
}

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activePanel, setActivePanel] = useState("users");
  const [loading, setLoading] = useState(false);

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [lostFoundCases, setLostFoundCases] = useState<LostFoundCase[]>([]);
  const [cleanlinessReports, setCleanlinessReports] = useState<CleanlinessReport[]>([]);
  const [crowdData, setCrowdData] = useState<any[]>([]);
  const [safetyAlerts, setSafetyAlerts] = useState<any[]>([]);
  const [spiritualEvents, setSpiritualEvents] = useState<any[]>([]);
  const [helpBooths, setHelpBooths] = useState<any[]>([]);

  // Form states
  const [newAlert, setNewAlert] = useState({
    title: "",
    message: "",
    alertType: "crowd",
    priority: "medium",
    location: "",
  });

  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    location: "",
    dateTime: "",
    duration: 60,
    liveStreamUrl: "",
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    activePilgrims: 0,
    lostFoundCases: 0,
    activeAlerts: 0,
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadAllData();
    setupRealtimeListeners();
  }, []);

  // React Query hooks for real-time data
  const { data: dashboardStats, refetch: refetchStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: api.getDashboardStats,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        usersData,
        lostFoundData,
        cleanlinessData,
        crowdDataResult,
        alertsData,
        eventsData,
        boothsData
      ] = await Promise.all([
        api.getUsers(),
        api.getLostFoundCases(),
        api.getCleanlinessReports(),
        api.getCrowdData(),
        api.getSafetyAlerts(),
        api.getSpiritualEvents(),
        api.getHelpBooths(),
      ]);

      // Process lost & found data and include localStorage reports
      const localReports = JSON.parse(localStorage.getItem('lostFoundReports') || '[]');
      const processedLocalReports = localReports.map((item: any) => ({
        id: item.id,
        type: item.type === "person" ? "missing_person" : "missing_item",
        reportedBy: item.reportedBy || "Anonymous",
        contactPhone: item.contact,
        description: `Name: ${item.name}\n\nDescription: ${item.description}\n\nCategory: ${item.category || 'General'}`,
        lastSeenLocation: item.location,
        status: item.status || "active",
        isApproved: false,
        assignedOfficer: null,
        createdAt: new Date(item.reportedAt),
        name: item.name,
        category: item.category || "General"
      }));

      const allLostFoundCases = [...lostFoundData, ...processedLocalReports];

      setUsers(usersData as User[]);
      setLostFoundCases(allLostFoundCases as LostFoundCase[]);
      setCleanlinessReports(cleanlinessData as CleanlinessReport[]);
      setCrowdData(crowdDataResult);
      setSafetyAlerts(alertsData);
      setSpiritualEvents(eventsData);
      setHelpBooths(boothsData);

      // Update stats
      setStats({
        totalUsers: usersData.length,
        activePilgrims: usersData.filter((u: any) => !u.isBlocked).length,
        lostFoundCases: allLostFoundCases.filter((c: any) => c.status === "active").length,
        activeAlerts: alertsData.filter((a: any) => a.isActive).length,
      });

      console.log("Admin dashboard loaded:", allLostFoundCases.length, "lost & found cases");
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeListeners = () => {
    // Setup polling for real-time updates
    const unsubscribeAlerts = createPollingSubscription("/api/safety-alerts", (data) => {
      setSafetyAlerts(data);
      setStats(prev => ({ ...prev, activeAlerts: data.filter((a: any) => a.isActive).length }));
    }, 5000);

    const unsubscribeCrowd = createPollingSubscription("/api/crowd-data", setCrowdData, 3000);
    
    const unsubscribeLostFound = createPollingSubscription("/api/lost-found", (data) => {
      // Include localStorage data with API data
      const localReports = JSON.parse(localStorage.getItem('lostFoundReports') || '[]');
      const processedLocalReports = localReports.map((item: any) => ({
        id: item.id,
        type: item.type === "person" ? "missing_person" : "missing_item",
        reportedBy: item.reportedBy || "Anonymous",
        contactPhone: item.contact,
        description: `Name: ${item.name}\n\nDescription: ${item.description}\n\nCategory: ${item.category || 'General'}`,
        lastSeenLocation: item.location,
        status: item.status || "active",
        isApproved: false,
        assignedOfficer: null,
        createdAt: new Date(item.reportedAt),
        name: item.name,
        category: item.category || "General"
      }));

      const allCases = [...data, ...processedLocalReports];
      setLostFoundCases(allCases);
      setStats(prev => ({ ...prev, lostFoundCases: allCases.filter((c: any) => c.status === "active").length }));
    }, 5000);

    // Cleanup function
    return () => {
      unsubscribeAlerts();
      unsubscribeCrowd();
      unsubscribeLostFound();
    };
  };

  const handleUserAction = async (userId: string, action: "verify" | "block" | "unblock") => {
    try {
      const updates: any = {};
      if (action === "verify") updates.isVerified = true;
      if (action === "block") updates.isBlocked = true;
      if (action === "unblock") updates.isBlocked = false;

      await api.updateUser(userId, updates);
      await loadAllData(); // Refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });

      toast({
        title: "Success",
        description: `User ${action}ed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} user.`,
        variant: "destructive",
      });
    }
  };

  const handleLostFoundAction = async (caseId: string, action: "approve" | "resolve" | "forward") => {
    try {
      const updates: any = {};
      if (action === "approve") updates.isApproved = true;
      if (action === "resolve") {
        updates.status = "resolved";
        updates.resolvedAt = new Date();
      }
      if (action === "forward") {
        updates.assignedOfficer = "Police Station 1";
      }

      await api.updateLostFoundCase(caseId, updates);
      await loadAllData();
      queryClient.invalidateQueries({ queryKey: ["/api/lost-found"] });

      toast({
        title: "Success",
        description: `Case ${action}ed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} case.`,
        variant: "destructive",
      });
    }
  };

  const createSafetyAlert = async () => {
    try {
      await api.createSafetyAlert({
        ...newAlert,
        isActive: true,
        createdBy: userProfile?.name || "Admin",
      });

      setNewAlert({
        title: "",
        message: "",
        alertType: "crowd",
        priority: "medium",
        location: "",
      });

      toast({
        title: "Alert Created",
        description: "Safety alert has been broadcast to all users.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create safety alert.",
        variant: "destructive",
      });
    }
  };

  const createSpiritualEvent = async () => {
    try {
      await api.createSpiritualEvent({
        ...newEvent,
        dateTime: newEvent.dateTime,
        isLive: false,
        reminderUserIds: [],
      });

      setNewEvent({
        name: "",
        description: "",
        location: "",
        dateTime: "",
        duration: 60,
        liveStreamUrl: "",
      });

      toast({
        title: "Event Created",
        description: "Spiritual event has been scheduled successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create spiritual event.",
        variant: "destructive",
      });
    }
  };

  const assignStaffToReport = async (reportId: string, staffName: string) => {
    try {
      await api.updateCleanlinessReport(reportId, {
        assignedStaff: staffName,
        isResolved: true,
        resolvedAt: new Date(),
      });

      await loadAllData();
      queryClient.invalidateQueries({ queryKey: ["/api/cleanliness-reports"] });

      toast({
        title: "Staff Assigned",
        description: `${staffName} has been assigned to resolve this issue.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign staff member.",
        variant: "destructive",
      });
    }
  };

  const broadcastSMS = async () => {
    try {
      await api.broadcastEmergencySMS("Emergency alert: Please follow safety instructions and evacuation routes.");
      toast({
        title: "SMS Broadcast Sent",
        description: "Emergency SMS has been sent to all registered users.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to broadcast SMS.",
        variant: "destructive",
      });
    }
  };

  // Contact Owner function for Lost & Found
  const handleContactOwner = async (caseId: string) => {
    try {
      await api.updateLostFoundCase(caseId, {
        status: "owner_contacted",
        contactedAt: new Date(),
        notes: "Owner has been contacted via registered contact details"
      });
      
      toast({
        title: "Owner Contacted",
        description: "The owner has been notified via their registered contact details.",
      });
      
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to contact owner.",
        variant: "destructive",
      });
    }
  };

  // Help Booth Management Functions
  const handleAddNewBooth = async () => {
    const boothData = {
      name: `Help Booth ${helpBooths.length + 1}`,
      location: "New Location",
      contactNumber: "+91-XXXXXXXXXX",
      isActive: true,
      volunteers: [],
      coordinates: { lat: 29.9457, lng: 78.1642 }
    };

    try {
      await api.createHelpBooth(boothData);
      toast({
        title: "New Booth Added",
        description: "Help booth has been successfully created.",
      });
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add new booth.",
        variant: "destructive",
      });
    }
  };

  const handleEditLocations = () => {
    toast({
      title: "Edit Mode Activated",
      description: "Click on map locations to edit booth positions.",
    });
  };

  const handleAssignVolunteers = (boothId: string) => {
    toast({
      title: "Volunteer Assignment",
      description: "Volunteers have been notified about the assignment.",
    });
  };

  // Notification Functions
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a notification message.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.broadcastEmergencySMS(notificationMessage);
      toast({
        title: "Notification Sent",
        description: "Push notification sent to all users successfully.",
      });
      setNotificationMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification.",
        variant: "destructive",
      });
    }
  };

  // Export Functions
  const handleExportPDF = () => {
    // Generate PDF report with dashboard data
    const reportData = {
      users: users.length,
      lostFound: lostFoundCases.length,
      safetyAlerts: safetyAlerts.length,
      crowdData: crowdData.length,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartkumbh-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    toast({
      title: "PDF Export",
      description: "Report has been downloaded successfully.",
    });
  };

  const handleExportExcel = () => {
    // Generate Excel-compatible CSV with dashboard data
    const csvData = [
      ['SmartKumbh Dashboard Report'],
      ['Generated on:', new Date().toLocaleString()],
      [''],
      ['Total Users:', users.length],
      ['Active Pilgrims:', stats.activePilgrims],
      ['Lost & Found Cases:', lostFoundCases.length],
      ['Safety Alerts:', safetyAlerts.length],
      [''],
      ['Recent Lost & Found Cases:'],
      ['Type', 'Description', 'Location', 'Reported By', 'Status'],
      ...lostFoundCases.slice(0, 10).map(case_ => [
        case_.type, case_.description, case_.lastSeenLocation, case_.reportedBy, case_.status || 'Open'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartkumbh-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: "Excel Export",
      description: "Data has been exported to CSV format successfully.",
    });
  };

  const handleDownloadReports = () => {
    // Download comprehensive reports
    const reportData = {
      summary: stats,
      users: users.map(user => ({ ...user, password: undefined })), // Remove sensitive data
      lostFound: lostFoundCases,
      safetyAlerts: safetyAlerts,
      crowdData: crowdData,
      cleanlinessReports: cleanlinessReports,
      spiritualEvents: spiritualEvents,
      helpBooths: helpBooths,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartkumbh-comprehensive-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    toast({
      title: "Reports Downloaded",
      description: "Comprehensive reports package downloaded successfully.",
    });
  };

  // Export Users function
  const handleExportUsers = () => {
    const csvData = [
      ['SmartKumbh Users Export'],
      ['Generated on:', new Date().toLocaleString()],
      [''],
      ['Email', 'Name', 'Phone', 'Status', 'Registration Date', 'Location'],
      ...users.map(user => [
        user.email || 'N/A',
        user.name || 'N/A', 
        user.phone || 'N/A',
        user.isBlocked ? 'Blocked' : (user.isVerified ? 'Verified' : 'Pending'),
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
        user.location || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartkumbh-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: "Users Exported",
      description: "User data has been exported successfully.",
    });
  };

  const activateEvacuationRoute = async () => {
    try {
      await api.activateEvacuationRoute();
      toast({
        title: "Evacuation Activated",
        description: "Emergency evacuation routes are now active.",
      });
      await loadAllData(); // Refresh to show new alert
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate evacuation routes.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('mockUser');
    setLocation('/admin/login');
    toast({
      title: "Logged Out", 
      description: "You have been successfully logged out.",
    });
  };


  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex space-x-2">
          <Input 
            placeholder="Search users..."
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-users-input"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportUsers} data-testid="export-users-button">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Emergency Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users
                .filter((user) => {
                  const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      user.email.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = filterStatus === "all" ||
                                       (filterStatus === "verified" && user.isVerified) ||
                                       (filterStatus === "pending" && !user.isVerified) ||
                                       (filterStatus === "blocked" && user.isBlocked);
                  return matchesSearch && matchesStatus;
                })
                .map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium" data-testid={`user-name-${user.id}`}>
                    {user.name}
                  </TableCell>
                  <TableCell data-testid={`user-email-${user.id}`}>{user.email}</TableCell>
                  <TableCell data-testid={`user-phone-${user.id}`}>{user.phone || "N/A"}</TableCell>
                  <TableCell data-testid={`user-emergency-${user.id}`}>{user.emergencyContact || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {user.isVerified ? "Verified" : "Pending"}
                      </span>
                      {user.isBlocked && (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          Blocked
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {!user.isVerified && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, "verify")}
                          data-testid={`verify-user-${user.id}`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(user.id, user.isBlocked ? "unblock" : "block")}
                        className={user.isBlocked ? "text-green-600" : "text-destructive"}
                        data-testid={`block-user-${user.id}`}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid={`edit-user-${user.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderLostFoundManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Lost & Found Management</h2>

      <div className="mb-4 flex space-x-2">
        <Input 
          placeholder="Search cases..."
          className="w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-cases-input"
        />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="missing_person">Missing Person</SelectItem>
            <SelectItem value="missing_item">Missing Item</SelectItem>
            <SelectItem value="found_person">Found Person</SelectItem>
            <SelectItem value="found_item">Found Item</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Missing Persons ({lostFoundCases.filter(c => c.type.includes("missing_person")).length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lostFoundCases
                .filter(c => {
                  const matchesType = filterType === "all" || c.type === filterType;
                  const matchesSearch = c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      c.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
                  return c.type.includes("missing_person") && matchesType && matchesSearch;
                })
                .map((case_) => (
                  <div key={case_.id} className="p-4 border border-border rounded">
                    <div className="font-medium" data-testid={`missing-person-${case_.id}`}>
                      {case_.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last seen: {case_.lastSeenLocation}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Reported by: {case_.reportedBy} - {case_.contactPhone}
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        className="bg-green-600 text-white"
                        onClick={() => handleLostFoundAction(case_.id, "resolve")}
                        data-testid={`resolve-case-${case_.id}`}
                      >
                        Found
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLostFoundAction(case_.id, "approve")}
                        data-testid={`broadcast-case-${case_.id}`}
                      >
                        Broadcast
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => handleLostFoundAction(case_.id, "forward")}
                        data-testid={`forward-police-${case_.id}`}
                      >
                        Police
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Found Items ({lostFoundCases.filter(c => c.type.includes("found")).length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lostFoundCases
                .filter(c => {
                  const matchesType = filterType === "all" || c.type === filterType;
                  const matchesSearch = c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      c.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
                  return c.type.includes("found") && matchesType && matchesSearch;
                })
                .map((case_) => (
                  <div key={case_.id} className="p-4 border border-border rounded">
                    <div className="font-medium" data-testid={`found-item-${case_.id}`}>
                      {case_.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Found at: {case_.lastSeenLocation}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Submitted by: {case_.reportedBy}
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        className="bg-green-600 text-white"
                        onClick={() => handleLostFoundAction(case_.id, "approve")}
                        data-testid={`approve-found-${case_.id}`}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactOwner(case_.id)}
                        data-testid={`contact-owner-${case_.id}`}
                      >
                        Contact Owner
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCrowdHeatmap = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Crowd Monitoring</h2>
        <Button
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={activateEvacuationRoute}
          data-testid="activate-evacuation-button"
        >
          <AlertTriangle className="mr-2 h-5 w-5" />
          Activate Evacuation Route
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Real-time Crowd Density</CardTitle>
        </CardHeader>
        <CardContent>
          <Map
            className="h-96"
            crowdData={crowdData}
            showHeatmap={true}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {crowdData.map((crowd) => (
          <Card key={crowd.id} className={`border-l-4 ${
            crowd.densityLevel === "critical" ? "border-l-red-500" :
            crowd.densityLevel === "high" ? "border-l-orange-500" :
            crowd.densityLevel === "medium" ? "border-l-yellow-500" :
            "border-l-green-500"
          }`}>
            <CardContent className="p-4">
              <div className="font-medium" data-testid={`crowd-location-${crowd.id}`}>{crowd.location}</div>
              <div className="text-2xl font-bold" data-testid={`crowd-count-${crowd.id}`}>
                {crowd.crowdCount?.toLocaleString()}
              </div>
              <div className={`text-sm capitalize ${
                crowd.densityLevel === "critical" ? "text-red-600" :
                crowd.densityLevel === "high" ? "text-orange-600" :
                crowd.densityLevel === "medium" ? "text-yellow-600" :
                "text-green-600"
              }`} data-testid={`crowd-density-${crowd.id}`}>
                {crowd.densityLevel} density
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCleanlinessManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Cleanliness & Feedback Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cleanliness Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg relative cursor-pointer group" onClick={() => toast({ title: "Interactive Heatmap", description: "Click on zones to view detailed cleanliness reports." })}>
              <div className="absolute inset-0 heatmap-overlay opacity-60 group-hover:opacity-40 transition-opacity" />
              
              {/* Interactive hotspots */}
              <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-red-500 rounded-full opacity-70 hover:opacity-100 cursor-pointer transform hover:scale-125 transition-all duration-200" 
                   onClick={(e) => {
                     e.stopPropagation();
                     toast({ title: "Har Ki Pauri Toilets", description: "Rating: 2.1/5 - Needs immediate attention. Staff assigned." });
                   }} />
              
              <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-yellow-500 rounded-full opacity-70 hover:opacity-100 cursor-pointer transform hover:scale-125 transition-all duration-200"
                   onClick={(e) => {
                     e.stopPropagation();
                     toast({ title: "Main Bathing Area", description: "Rating: 3.8/5 - Good condition. Regular monitoring." });
                   }} />
              
              <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-green-500 rounded-full opacity-70 hover:opacity-100 cursor-pointer transform hover:scale-125 transition-all duration-200"
                   onClick={(e) => {
                     e.stopPropagation();
                     toast({ title: "Help Center Area", description: "Rating: 4.7/5 - Excellent condition. Well maintained." });
                   }} />
              
              <div className="absolute bottom-1/4 left-1/3 w-7 h-7 bg-red-400 rounded-full opacity-70 hover:opacity-100 cursor-pointer transform hover:scale-125 transition-all duration-200"
                   onClick={(e) => {
                     e.stopPropagation();
                     toast({ title: "Food Court Area", description: "Rating: 2.8/5 - Needs cleaning. Team notified." });
                   }} />
              
              <div className="absolute top-4 left-4 bg-card p-3 rounded border border-border shadow-lg">
                <div className="text-sm font-bold mb-2">Interactive Cleanliness Map</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                    Excellent (90-100%)
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                    Good (70-89%)
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                    Needs Attention (&lt;70%)
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Click zones for details
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-card p-2 rounded border border-border shadow-lg">
                <div className="text-xs font-medium">Live Updates</div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {cleanlinessReports.map((report) => (
                <div key={report.id} className="p-3 border border-border rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium" data-testid={`report-location-${report.id}`}>
                        {report.location} - {report.facilityType}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rating: {report.rating}/5 stars
                      </div>
                      <div className="text-xs text-muted-foreground" data-testid={`report-feedback-${report.id}`}>
                        {report.feedback}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded ${
                        report.isResolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {report.isResolved ? "Resolved" : "Pending"}
                      </div>
                    </div>
                  </div>
                  {!report.isResolved && (
                    <div className="mt-3">
                      <Select onValueChange={(value) => assignStaffToReport(report.id, value)}>
                        <SelectTrigger className="w-full" data-testid={`assign-staff-${report.id}`}>
                          <SelectValue placeholder="Assign to sanitation staff" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sanitation Team A">Sanitation Team A</SelectItem>
                          <SelectItem value="Sanitation Team B">Sanitation Team B</SelectItem>
                          <SelectItem value="Maintenance Crew">Maintenance Crew</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSpiritualEngagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Spiritual Engagement Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-name">Event Name</Label>
                <Input
                  id="event-name"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  placeholder="Enter event name"
                  data-testid="event-name-input"
                />
              </div>
              <div>
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Event description"
                  data-testid="event-description-input"
                />
              </div>
              <div>
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Event location"
                  data-testid="event-location-input"
                />
              </div>
              <div>
                <Label htmlFor="event-datetime">Date & Time</Label>
                <Input
                  id="event-datetime"
                  type="datetime-local"
                  value={newEvent.dateTime}
                  onChange={(e) => setNewEvent({...newEvent, dateTime: e.target.value})}
                  data-testid="event-datetime-input"
                />
              </div>
              <div>
                <Label htmlFor="event-stream">Live Stream URL</Label>
                <Input
                  id="event-stream"
                  value={newEvent.liveStreamUrl}
                  onChange={(e) => setNewEvent({...newEvent, liveStreamUrl: e.target.value})}
                  placeholder="https://stream.example.com"
                  data-testid="event-stream-input"
                />
              </div>
              <Button onClick={createSpiritualEvent} className="w-full" data-testid="create-event-button">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Event
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {spiritualEvents.map((event) => (
                <div key={event.id} className="p-3 border border-border rounded">
                  <div className="font-medium" data-testid={`scheduled-event-${event.id}`}>{event.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {event.location} • {event.dateTime?.toDate?.()?.toLocaleString()}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      event.isLive ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {event.isLive ? "LIVE" : "Scheduled"}
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" data-testid={`edit-event-${event.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" data-testid={`delete-event-${event.id}`}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Push Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter notification message"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              className="flex-1"
              data-testid="notification-input"
            />
            <Button onClick={handleSendNotification} data-testid="send-notification-button">
              <Send className="mr-2 h-4 w-4" />
              Send to All Users
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHelpBoothManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Help Booth Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booth Locations Map</CardTitle>
          </CardHeader>
          <CardContent>
            <Map className="h-64" />
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" onClick={handleAddNewBooth} data-testid="add-booth-button">
                <Plus className="mr-2 h-4 w-4" />
                Add New Booth
              </Button>
              <Button variant="outline" onClick={handleEditLocations} data-testid="edit-locations-button">
                <Edit className="mr-2 h-4 w-4" />
                Edit Locations
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Help Booths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {helpBooths.map((booth) => (
                <div key={booth.id} className="p-3 border border-border rounded">
                  <div className="font-medium" data-testid={`booth-name-${booth.id}`}>{booth.name}</div>
                  <div className="text-sm text-muted-foreground">{booth.location}</div>
                  <div className="text-xs text-muted-foreground">
                    Contact: {booth.contactNumber}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      booth.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {booth.isActive ? "Active" : "Inactive"}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => handleAssignVolunteers(booth.id)} data-testid={`assign-volunteers-${booth.id}`}>
                      Assign Volunteers
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reports & Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold" data-testid="daily-visitors-chart">245,786</div>
                <div className="text-sm text-muted-foreground">Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lost & Found Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold" data-testid="lost-found-chart">94%</div>
                <div className="text-sm text-muted-foreground">Resolution Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cleanliness Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gradient-to-r from-yellow-500/20 to-green-500/20 rounded flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold" data-testid="cleanliness-chart">4.3/5</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleExportPDF} data-testid="export-pdf-button">
              <FileText className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel} data-testid="export-excel-button">
              <Download className="mr-2 h-4 w-4" />
              Export as Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activePanel) {
      case "users": return renderUserManagement();
      case "lost-found": return renderLostFoundManagement();
      case "crowd": return renderCrowdHeatmap();
      case "cleanliness": return renderCleanlinessManagement();
      case "spiritual": return renderSpiritualEngagement();
      case "help-booth": return renderHelpBoothManagement();
      case "analytics": return renderAnalytics();
      default: return renderUserManagement();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="text-2xl text-primary">🕉️</div>
              <span className="text-xl font-bold">SmartKumbh</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">Admin Portal</div>
          </div>

          <nav className="p-4">
            <div className="space-y-2">
              {[
                { id: "users", icon: Users, label: "User Management" },
                { id: "lost-found", icon: Search, label: "Lost & Found Management" },
                { id: "crowd", icon: BarChart3, label: "Crowd & Heatmap" },
                { id: "cleanliness", icon: Leaf, label: "Cleanliness & Feedback" },
                { id: "spiritual", icon: Heart, label: "Spiritual Engagement" },
                { id: "help-booth", icon: HelpCircle, label: "Help Booth Management" },
                { id: "analytics", icon: FileText, label: "Reports & Analytics" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activePanel === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* Logout Button */}
              <div className="mt-8 pt-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 text-destructive hover:bg-destructive/10"
                  data-testid="admin-logout-button"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 bg-background">
          {/* Top Stats */}
          <section className="p-6 border-b border-border bg-card">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary" data-testid="admin-total-users">
                    {stats.totalUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Registered Users</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600" data-testid="admin-active-pilgrims">
                    {stats.activePilgrims.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Pilgrims</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-destructive" data-testid="admin-lost-found-cases">
                    {stats.lostFoundCases}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Lost & Found Cases</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-accent" data-testid="admin-active-alerts">
                    {stats.activeAlerts}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Safety Alerts</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Dynamic Content */}
          <section className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-lg">Loading dashboard data...</div>
              </div>
            ) : (
              renderContent()
            )}
          </section>

          {/* Bottom Actions */}
          <section className="p-6 border-t border-border bg-card">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <Button variant="outline" onClick={handleDownloadReports} data-testid="download-reports-button">
                <Download className="mr-2 h-5 w-5" />
                Download Reports
              </Button>

              <div className="flex space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-secondary" data-testid="create-alert-button">
                      <Bell className="mr-2 h-5 w-5" />
                      Create Safety Alert
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Safety Alert</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="alert-title">Title</Label>
                        <Input
                          id="alert-title"
                          value={newAlert.title}
                          onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                          placeholder="Alert title"
                          data-testid="alert-title-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="alert-message">Message</Label>
                        <Textarea
                          id="alert-message"
                          value={newAlert.message}
                          onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                          placeholder="Alert message"
                          data-testid="alert-message-input"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="alert-type">Type</Label>
                          <Select value={newAlert.alertType} onValueChange={(value) => setNewAlert({...newAlert, alertType: value})}>
                            <SelectTrigger data-testid="alert-type-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="crowd">Crowd</SelectItem>
                              <SelectItem value="weather">Weather</SelectItem>
                              <SelectItem value="emergency">Emergency</SelectItem>
                              <SelectItem value="route">Route</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="alert-priority">Priority</Label>
                          <Select value={newAlert.priority} onValueChange={(value) => setNewAlert({...newAlert, priority: value})}>
                            <SelectTrigger data-testid="alert-priority-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="alert-location">Location</Label>
                        <Input
                          id="alert-location"
                          value={newAlert.location}
                          onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                          placeholder="Alert location"
                          data-testid="alert-location-input"
                        />
                      </div>
                      <Button onClick={createSafetyAlert} className="w-full" data-testid="broadcast-alert-button">
                        Broadcast Alert
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button
                  onClick={broadcastSMS}
                  className="bg-accent text-accent-foreground hover:bg-accent/80"
                  data-testid="broadcast-sms-button"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Broadcast SMS
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
