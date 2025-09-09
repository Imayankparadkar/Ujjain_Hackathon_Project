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
import { Search, AlertTriangle, Clock, MapPin, Phone, User, Package, CheckCircle } from "lucide-react";
import { getDocuments, addDocument, subscribeToCollection } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
}

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

  useEffect(() => {
    loadLostFoundCases();
    // Set up real-time subscription for updates
    const unsubscribe = subscribeToCollection("lostAndFound", (data: any[]) => {
      const formattedCases: LostFoundCase[] = data.map(item => ({
        id: item.id,
        type: (item.type === "missing_person" || item.type === "missing_child" ? "person" : "item") as "person" | "item",
        name: item.name,
        description: item.description,
        lastSeen: formatTimeAgo(item.lastSeenTime || item.foundTime || item.createdAt),
        location: item.lastSeenLocation || item.foundLocation || "Unknown",
        contact: item.contactInfo || "N/A",
        status: (item.status === "reunited" || item.status === "claimed" ? "resolved" : item.status) as "active" | "found" | "resolved",
        reportedAt: item.createdAt?.toDate?.() || new Date(item.createdAt),
        category: item.category || "General"
      }));
      setCases(formattedCases);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadLostFoundCases = async () => {
    try {
      const data = await getDocuments("lostAndFound");
      const formattedCases: LostFoundCase[] = data.map((item: any) => ({
        id: item.id,
        type: (item.type === "missing_person" || item.type === "missing_child" ? "person" : "item") as "person" | "item",
        name: item.name,
        description: item.description,
        lastSeen: formatTimeAgo(item.lastSeenTime || item.foundTime || item.createdAt),
        location: item.lastSeenLocation || item.foundLocation || "Unknown",
        contact: item.contactInfo || "N/A",
        status: (item.status === "reunited" || item.status === "claimed" ? "resolved" : item.status) as "active" | "found" | "resolved",
        reportedAt: item.createdAt?.toDate?.() || new Date(item.createdAt),
        category: item.category || "General"
      }));
      setCases(formattedCases);
    } catch (error) {
      console.error("Error loading lost & found cases:", error);
      // Fallback to mock data if Firebase fails
      loadMockData();
    }
  };

  const loadMockData = () => {
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
    setCases(mockCases);
  };

  const formatTimeAgo = (date: any) => {
    if (!date) return "Unknown";
    const now = new Date();
    const then = date.toDate ? date.toDate() : new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const handleSubmitReport = async (formData: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to report missing items or persons.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await addDocument("lostAndFound", {
        type: reportType === "person" ? "missing_person" : "missing_item",
        name: formData.name,
        description: formData.description,
        lastSeenLocation: formData.location,
        lastSeenTime: new Date(),
        contactInfo: formData.contact,
        reportedBy: user.email,
        status: "active",
        priority: reportType === "person" ? "critical" : "medium",
        caseNumber: `LF-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
        createdAt: new Date()
      });

      toast({
        title: "✅ Report Submitted Successfully",
        description: `Your ${reportType === "person" ? "missing person" : "lost item"} report has been submitted. We'll notify you with any updates.`,
      });
      
      setShowReportModal(false);
    } catch (error) {
      toast({
        title: "❌ Submission Failed",
        description: "Unable to submit your report. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
    { label: "Total Cases", value: cases.length, color: "text-primary" },
    { label: "Active Cases", value: cases.filter(c => c.status === "active").length, color: "text-red-600" },
    { label: "Found Today", value: cases.filter(c => c.status === "found").length, color: "text-yellow-600" },
    { label: "Resolved", value: cases.filter(c => c.status === "resolved").length, color: "text-green-600" }
  ];

  return (
    <Layout>
      {/* Header */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Lost & Found Service</h1>
          <p className="text-primary-foreground/90">Report and search for missing persons and items</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-6 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                  data-testid="report-missing-button"
                  onClick={() => setReportType("person")}
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Report Missing Person
                </Button>
              </DialogTrigger>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="report-item-button"
                  onClick={() => {
                    setReportType("item");
                    setShowReportModal(true);
                  }}
                >
                  <Package className="mr-2 h-5 w-5" />
                  Report Lost Item
                </Button>
              </DialogTrigger>
            </Dialog>

            <Button variant="outline" data-testid="emergency-contact-button">
              <Phone className="mr-2 h-5 w-5" />
              Emergency Contact: 1950
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                data-testid="search-input"
              />
            </div>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="person">Person</SelectItem>
                <SelectItem value="item">Item</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full md:w-40">
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

          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredCases.length} of {cases.length} cases
          </div>
        </div>
      </section>

      {/* Cases List */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((case_) => (
              <Card key={case_.id} className="group hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {case_.type === "person" ? 
                        <User className="h-5 w-5 text-primary" /> : 
                        <Package className="h-5 w-5 text-accent" />
                      }
                      <CardTitle className="text-lg">{case_.name}</CardTitle>
                    </div>
                    <Badge className={`${getStatusColor(case_.status)} flex items-center space-x-1`}>
                      {getStatusIcon(case_.status)}
                      <span className="capitalize">{case_.status}</span>
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">Case ID: {case_.id}</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{case_.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Last seen: {case_.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-accent" />
                      <span>{case_.lastSeen}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span>{case_.contact}</span>
                    </div>
                  </div>

                  {case_.status === "active" && (
                    <div className="pt-3 space-y-2">
                      <Button variant="outline" className="w-full text-sm" data-testid={`contact-${case_.id}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Reporter
                      </Button>
                      {case_.type === "person" && (
                        <Button className="w-full text-sm bg-green-600 text-white hover:bg-green-700" data-testid={`found-${case_.id}`}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Found
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No cases found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  placeholder={reportType === "person" ? "Person's name" : "Item name"}
                  data-testid="report-name"
                />
              </div>
              <div>
                <Label htmlFor="contact">Contact Number *</Label>
                <Input id="contact" placeholder="+91 9876543210" data-testid="report-contact" />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                placeholder={reportType === "person" ? 
                  "Physical description, clothing, any medical conditions..." : 
                  "Item description, color, brand, distinctive features..."
                }
                rows={3}
                data-testid="report-description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Last Seen Location *</Label>
                <Input id="location" placeholder="Specific area or landmark" data-testid="report-location" />
              </div>
              <div>
                <Label htmlFor="time">When Last Seen</Label>
                <Input id="time" type="datetime-local" data-testid="report-time" />
              </div>
            </div>

            {reportType === "item" && (
              <div>
                <Label htmlFor="category">Item Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="religious">Religious Items</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <Button 
                className="flex-1 bg-primary text-primary-foreground" 
                data-testid="submit-report"
                disabled={isLoading}
                onClick={() => {
                  const formData = {
                    name: (document.getElementById('name') as HTMLInputElement)?.value || '',
                    contact: (document.getElementById('contact') as HTMLInputElement)?.value || '',
                    description: (document.getElementById('description') as HTMLTextAreaElement)?.value || '',
                    location: (document.getElementById('location') as HTMLInputElement)?.value || '',
                  };
                  
                  if (!formData.name || !formData.contact || !formData.description || !formData.location) {
                    toast({
                      title: "Missing Information",
                      description: "Please fill in all required fields.",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  handleSubmitReport(formData);
                }}
              >
                {isLoading ? "Submitting..." : "Submit Report"}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowReportModal(false)}>
                Cancel
              </Button>
            </div>

            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <strong>Important:</strong> For immediate emergencies, call 100 (Police) or 108 (Medical Emergency)
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}