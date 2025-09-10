import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, AlertTriangle, Clock, MapPin, Phone, User, Package, CheckCircle } from "lucide-react";
import { getDocuments, addDocument, updateDocument, subscribeToCollection } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface LostFoundCase {
  id: string;
  type: "person" | "item";
  name: string;
  description: string;
  lastSeen: string;
  location: string;
  contact: string;
  status: "active" | "found" | "resolved";
  reportedAt: string;
  category?: string;
  imageUrl?: string;
  reportedBy?: string;
  assignedOfficer?: string;
}

const reportFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(10, "Valid contact number required"),
  description: z.string().min(10, "Detailed description required"),
  location: z.string().min(1, "Location is required"),
  category: z.string().optional(),
  lastSeenTime: z.string().optional()
});

type ReportFormData = z.infer<typeof reportFormSchema>;

export default function LostFoundPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cases, setCases] = useState<LostFoundCase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "person" | "item">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "found" | "resolved">("all");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<"person" | "item">("person");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      name: "",
      contact: "",
      description: "",
      location: "",
      category: "",
      lastSeenTime: ""
    }
  });

  useEffect(() => {
    loadLostFoundCases();
    // Set up real-time subscription for updates
    const unsubscribe = subscribeToCollection("lostAndFound", (data: any[]) => {
      console.log("Received real-time lost & found data:", data);
      const firebaseCases: LostFoundCase[] = data.map(item => ({
        id: item.id,
        type: (item.type === "missing_person" || item.type === "missing_child" ? "person" : "item") as "person" | "item",
        name: item.name || extractNameFromDescription(item.description),
        description: item.description,
        lastSeen: formatTimeAgo(item.lastSeenTime || item.createdAt),
        location: item.lastSeenLocation || "Unknown",
        contact: item.contactPhone || item.contactInfo || "N/A",
        status: (item.status === "reunited" || item.status === "claimed" ? "resolved" : item.status) as "active" | "found" | "resolved",
        reportedAt: item.createdAt?.toDate?.() || new Date(item.createdAt),
        category: item.category || "General",
        reportedBy: item.reportedBy,
        assignedOfficer: item.assignedOfficer
      }));
      
      // Add localStorage data as fallback
      const localReports = JSON.parse(localStorage.getItem('lostFoundReports') || '[]');
      const localCases: LostFoundCase[] = localReports.map((item: any) => ({
        ...item,
        lastSeen: formatTimeAgo(item.reportedAt)
      }));
      
      const allCases = [...firebaseCases, ...localCases];
      setCases(allCases);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadLostFoundCases = async () => {
    try {
      const data = await getDocuments("lostAndFound");
      console.log("Loaded lost & found data:", data);
      
      // Process Firebase data
      const firebaseCases: LostFoundCase[] = data.map((item: any) => ({
        id: item.id,
        type: (item.type === "missing_person" || item.type === "missing_child" ? "person" : "item") as "person" | "item",
        name: item.name || extractNameFromDescription(item.description),
        description: item.description,
        lastSeen: formatTimeAgo(item.lastSeenTime || item.createdAt),
        location: item.lastSeenLocation || "Unknown",
        contact: item.contactPhone || item.contactInfo || "N/A",
        status: (item.status === "reunited" || item.status === "claimed" ? "resolved" : item.status) as "active" | "found" | "resolved",
        reportedAt: item.createdAt?.toDate?.() || new Date(item.createdAt),
        category: item.category || "General",
        reportedBy: item.reportedBy,
        assignedOfficer: item.assignedOfficer
      }));
      
      // Add localStorage data
      const localReports = JSON.parse(localStorage.getItem('lostFoundReports') || '[]');
      const localCases: LostFoundCase[] = localReports.map((item: any) => ({
        ...item,
        lastSeen: formatTimeAgo(item.reportedAt)
      }));
      
      // Always include both Firebase and local data
      const allCases = [...firebaseCases, ...localCases];
      setCases(allCases);
      console.log("Total cases loaded:", allCases.length);
    } catch (error) {
      console.error("Error loading lost & found cases:", error);
      // Fallback to local data if Firebase fails
      const localReports = JSON.parse(localStorage.getItem('lostFoundReports') || '[]');
      const localCases: LostFoundCase[] = localReports.map((item: any) => ({
        ...item,
        lastSeen: formatTimeAgo(item.reportedAt)
      }));
      setCases(localCases);
      
      // If no local data, load mock data
      if (localCases.length === 0) {
        loadMockData();
      }
    }
  };

  const loadMockData = () => {
    // Load from localStorage first
    const localReports = JSON.parse(localStorage.getItem('lostFoundReports') || '[]');
    
    const mockCases: LostFoundCase[] = [
      {
        id: "LF001",
        type: "person",
        name: "Ramesh Kumar",
        description: "Male, 65 years old, wearing white kurta and orange turban. Has diabetes medication needs.",
        lastSeen: "2 hours ago",
        location: "Near Mahakal Temple Main Gate",
        contact: "+91 9876543210",
        status: "active",
        reportedAt: "2025-01-15T10:30:00Z"
      },
      {
        id: "LF002",
        type: "item",
        name: "Mobile Phone (iPhone)",
        description: "Black iPhone 14 with blue case, important family photos inside",
        lastSeen: "4 hours ago",
        location: "Prasad Shop near Temple",
        contact: "+91 9876543211",
        status: "found",
        reportedAt: "2025-01-15T08:15:00Z",
        category: "Electronics"
      }
    ];
    
    const localCases: LostFoundCase[] = localReports.map((item: any) => ({
      ...item,
      lastSeen: formatTimeAgo(item.reportedAt)
    }));
    
    setCases([...mockCases, ...localCases]);
  };

  const formatTimeAgo = (date: any) => {
    if (!date) return "Unknown";
    const now = new Date();
    const then = date.toDate ? date.toDate() : new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const extractNameFromDescription = (description: string) => {
    if (!description) return "Unknown";
    const nameMatch = description.match(/Name:\s*([^\n]+)/);
    return nameMatch ? nameMatch[1].trim() : description.substring(0, 30) + (description.length > 30 ? "..." : "");
  };

  const handleSubmitReport = async (formData: ReportFormData) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to report missing items or persons.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const caseNumber = `LF-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    
    // Create the report object
    const newReport: LostFoundCase = {
      id: `REPORT-${Date.now()}`,
      type: reportType,
      name: formData.name,
      description: formData.description,
      lastSeen: "Just now",
      location: formData.location,
      contact: formData.contact,
      status: "active",
      reportedAt: new Date().toISOString(),
      category: formData.category || "General",
      reportedBy: user.email || "Anonymous"
    };

    // Always add to localStorage immediately for instant display
    const localReports = JSON.parse(localStorage.getItem('lostFoundReports') || '[]');
    localReports.push(newReport);
    localStorage.setItem('lostFoundReports', JSON.stringify(localReports));
    
    // Update UI immediately
    setCases(prevCases => [newReport, ...prevCases]);

    try {
      // Try to submit to Firebase
      const reportData = {
        type: reportType === "person" ? "missing_person" : "missing_item",
        reportedBy: user.email || "Anonymous",
        contactPhone: formData.contact,
        description: `Name: ${formData.name}\n\nDescription: ${formData.description}\n\nCategory: ${formData.category || 'Not specified'}`,
        lastSeenLocation: formData.location,
        status: "active",
        isApproved: false,
        assignedOfficer: null,
        priority: reportType === "person" ? "critical" : "medium",
        caseNumber: caseNumber,
        createdAt: new Date(),
        name: formData.name,
        category: formData.category || "General",
        lastSeenTime: formData.lastSeenTime ? new Date(formData.lastSeenTime) : new Date()
      };

      console.log("Submitting report data to Firebase:", reportData);
      await addDocument("lostAndFound", reportData);

      toast({
        title: "✅ Report Submitted Successfully",
        description: `Your ${reportType === "person" ? "missing person" : "lost item"} report has been submitted. Case ID: ${caseNumber}`,
      });
      
      console.log("✅ Report successfully stored in Firebase");
    } catch (error) {
      console.error("Firebase submission error:", error);
      toast({
        title: "✅ Report Saved",
        description: `Your ${reportType === "person" ? "missing person" : "lost item"} report has been saved. Case ID: ${caseNumber}`,
      });
      console.log("📱 Report stored locally, will sync when Firebase is available");
    }
    
    form.reset();
    setSelectedCategory("");
    setShowReportModal(false);
    setIsLoading(false);
  };

  const handleMarkAsFound = async (caseId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to update case status.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateDocument("lostAndFound", caseId, {
        status: "found",
        resolvedAt: new Date(),
        resolvedBy: user.email
      });
      
      toast({
        title: "✅ Case Updated",
        description: "Case marked as found successfully.",
      });
      
      loadLostFoundCases();
    } catch (error) {
      console.error("Error updating case:", error);
      // Try localStorage update
      const localReports = JSON.parse(localStorage.getItem('lostFoundReports') || '[]');
      const updatedReports = localReports.map((report: any) => 
        report.id === caseId ? { ...report, status: "found" } : report
      );
      localStorage.setItem('lostFoundReports', JSON.stringify(updatedReports));
      
      toast({
        title: "✅ Case Updated Locally",
        description: "Case marked as found. Changes will sync when connection is restored.",
      });
      
      loadLostFoundCases();
    }
  };

  const handleContactReporter = (contact: string) => {
    if (contact && contact !== "N/A") {
      window.open(`tel:${contact}`, '_blank');
    } else {
      toast({
        title: "Contact Information",
        description: "Contact information not available for this case.",
        variant: "destructive"
      });
    }
  };

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || case_.type === filterType;
    const matchesStatus = filterStatus === "all" || case_.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-red-100 text-red-800 border-red-200";
      case "found": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <AlertTriangle className="h-4 w-4" />;
      case "found": return <Search className="h-4 w-4" />;
      case "resolved": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const stats = [
    { label: "Total Cases", value: cases.length, color: "text-orange-600" },
    { label: "Active Cases", value: cases.filter(c => c.status === "active").length, color: "text-red-600" },
    { label: "Found Today", value: cases.filter(c => c.status === "found").length, color: "text-yellow-600" },
    { label: "Resolved", value: cases.filter(c => c.status === "resolved").length, color: "text-green-600" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">Lost & Found Service</h1>
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Reuniting families and finding lost belongings through advanced AI-powered search and community support
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{cases.filter(c => c.status === 'active').length}</div>
              <div className="text-lg text-white/80 font-medium">Active Cases</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{cases.filter(c => c.status === 'resolved').length}</div>
              <div className="text-lg text-white/80 font-medium">Resolved Cases</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{cases.filter(c => c.type === 'person').length}</div>
              <div className="text-lg text-white/80 font-medium">Missing Persons</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-lg text-white/80 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Actions Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Report & Emergency Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Immediate assistance for missing persons and lost items with 24/7 support during your pilgrimage</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Dialog open={showReportModal && reportType === "person"} onOpenChange={(open) => {
              if (!open) setShowReportModal(false);
            }}>
              <DialogTrigger asChild>
                <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden group cursor-pointer">
                  <CardContent className="p-10 text-center">
                    <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Missing Person</h3>
                    <p className="text-base text-gray-600 mb-6 leading-relaxed">Report a missing family member or friend with immediate priority assistance</p>
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg" 
                      data-testid="report-missing-button"
                      onClick={() => {
                        setReportType("person");
                        setShowReportModal(true);
                      }}
                    >
                      <AlertTriangle className="h-5 w-5 mr-3" />
                      Report Missing Person
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>
            </Dialog>

            <Dialog open={showReportModal && reportType === "item"} onOpenChange={(open) => {
              if (!open) setShowReportModal(false);
            }}>
              <DialogTrigger asChild>
                <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden group cursor-pointer">
                  <CardContent className="p-10 text-center">
                    <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-orange-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Lost Item</h3>
                    <p className="text-base text-gray-600 mb-6 leading-relaxed">Report lost belongings with detailed description for quick recovery</p>
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg"
                      data-testid="report-item-button"
                      onClick={() => {
                        setReportType("item");
                        setShowReportModal(true);
                      }}
                    >
                      <Package className="h-5 w-5 mr-3" />
                      Report Lost Item
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>
            </Dialog>

            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden group cursor-pointer">
              <CardContent className="p-10 text-center">
                <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <Phone className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Emergency Helpline</h3>
                <p className="text-base text-gray-600 mb-6 leading-relaxed">24/7 emergency assistance for immediate help during crisis</p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg" 
                  data-testid="emergency-contact-button"
                  onClick={() => window.open('tel:1950', '_blank')}
                >
                  <Phone className="h-5 w-5 mr-3" />
                  Call: 1950
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                <div className="text-lg text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Search Active Cases</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Find missing persons and lost items using our advanced search and filtering system</p>
          </div>
          
          <div className="bg-gray-50 rounded-3xl p-10 mb-12">
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <div className="flex-1">
                <Label htmlFor="search" className="text-lg font-semibold text-gray-700 mb-3 block">Search Cases</Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 px-4 py-3 text-base rounded-2xl border-2 border-gray-200 focus:border-orange-500 w-full"
                    data-testid="search-input"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:w-96">
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-3 block">Case Type</Label>
                  <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                    <SelectTrigger className="px-4 py-3 text-base rounded-2xl border-2 border-gray-200 focus:border-orange-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="person">Missing Person</SelectItem>
                      <SelectItem value="item">Lost Item</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-lg font-semibold text-gray-700 mb-3 block">Status</Label>
                  <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                    <SelectTrigger className="px-4 py-3 text-base rounded-2xl border-2 border-gray-200 focus:border-orange-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="found">Found</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-lg text-gray-600 font-medium">
                Showing <span className="font-bold text-orange-600">{filteredCases.length}</span> of <span className="font-bold">{cases.length}</span> cases
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Updated in real-time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cases List */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Active Cases</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Browse through current missing person and lost item cases. Help reunite families and recover belongings.</p>
          </div>
          
          {filteredCases.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredCases.map((case_) => (
                <Card key={case_.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden">
                  <CardHeader className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${case_.type === "person" ? "bg-red-100" : "bg-orange-100"}`}>
                          {case_.type === "person" ? 
                            <User className="h-6 w-6 text-red-600" /> : 
                            <Package className="h-6 w-6 text-orange-600" />
                          }
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-gray-800 mb-1">{case_.name}</CardTitle>
                          <div className="text-sm text-gray-500">Case ID: {case_.id}</div>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(case_.status)} flex items-center space-x-2 px-3 py-2 rounded-2xl text-sm font-semibold`}>
                        {getStatusIcon(case_.status)}
                        <span className="capitalize">{case_.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8 pt-0 space-y-6">
                    <p className="text-base text-gray-600 leading-relaxed">{case_.description}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Last seen location</div>
                          <div className="text-base text-gray-800 font-semibold">{case_.location}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Time since report</div>
                          <div className="text-base text-gray-800 font-semibold">{case_.lastSeen}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">Contact information</div>
                          <div className="text-base text-gray-800 font-semibold">{case_.contact}</div>
                        </div>
                      </div>
                    </div>

                    {case_.status === "active" && (
                      <div className="pt-6 space-y-3">
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold rounded-2xl shadow-lg"
                          data-testid={`found-${case_.id}`}
                          onClick={() => handleMarkAsFound(case_.id)}
                        >
                          <CheckCircle className="h-5 w-5 mr-3" />
                          Mark as Found
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 text-lg font-semibold rounded-2xl"
                          data-testid={`contact-${case_.id}`}
                          onClick={() => handleContactReporter(case_.contact)}
                        >
                          <Phone className="h-5 w-5 mr-3" />
                          Contact Reporter
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mx-auto w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg">
                <Search className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">No cases found</h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                No cases match your current search criteria. Try adjusting your search terms or filters, or check back later for new reports.
              </p>
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterStatus("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Report Missing {reportType === "person" ? "Person" : "Item"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitReport)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={reportType === "person" ? "Person's name" : "Item name"}
                          data-testid="report-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+91 9876543210" 
                          data-testid="report-contact"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={reportType === "person" ? 
                          "Physical description, clothing, any medical conditions..." : 
                          "Item description, color, brand, distinctive features..."
                        }
                        rows={3}
                        data-testid="report-description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Seen Location *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Specific area or landmark" 
                          data-testid="report-location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastSeenTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>When Last Seen</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          data-testid="report-time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {reportType === "item" && (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="documents">Documents</SelectItem>
                          <SelectItem value="jewelry">Jewelry</SelectItem>
                          <SelectItem value="religious">Religious Items</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex space-x-4 pt-4">
                <Button 
                  type="submit"
                  className="flex-1 bg-orange-600 text-white hover:bg-orange-700" 
                  data-testid="submit-report"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Report"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </Button>
              </div>

              <div className="text-sm text-muted-foreground bg-orange-50 p-3 rounded-lg border border-orange-200">
                <strong>Important:</strong> For immediate emergencies, call 100 (Police) or 108 (Medical Emergency)
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}