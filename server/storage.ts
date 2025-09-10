import { 
  type User, type InsertUser,
  type LostAndFound, type InsertLostAndFound,
  type SafetyAlert, type InsertSafetyAlert,
  type SpiritualEvent, type InsertSpiritualEvent,
  type CleanlinessReport, type InsertCleanlinessReport,
  type CrowdData, type InsertCrowdData,
  type HelpBooth, type InsertHelpBooth,
  type ChatMessage, type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Safety Alerts
  getAllSafetyAlerts(): Promise<SafetyAlert[]>;
  createSafetyAlert(alert: InsertSafetyAlert): Promise<SafetyAlert>;
  updateSafetyAlert(id: string, updates: Partial<SafetyAlert>): Promise<SafetyAlert>;
  
  // Spiritual Events
  getAllSpiritualEvents(): Promise<SpiritualEvent[]>;
  createSpiritualEvent(event: InsertSpiritualEvent): Promise<SpiritualEvent>;
  updateSpiritualEvent(id: string, updates: Partial<SpiritualEvent>): Promise<SpiritualEvent>;
  
  // Lost & Found
  getAllLostFoundCases(): Promise<LostAndFound[]>;
  createLostFoundCase(case_: InsertLostAndFound): Promise<LostAndFound>;
  updateLostFoundCase(id: string, updates: Partial<LostAndFound>): Promise<LostAndFound>;
  
  // Cleanliness Reports
  getAllCleanlinessReports(): Promise<CleanlinessReport[]>;
  createCleanlinessReport(report: InsertCleanlinessReport): Promise<CleanlinessReport>;
  updateCleanlinessReport(id: string, updates: Partial<CleanlinessReport>): Promise<CleanlinessReport>;
  
  // Crowd Data
  getAllCrowdData(): Promise<CrowdData[]>;
  createCrowdData(data: InsertCrowdData): Promise<CrowdData>;
  
  // Help Booths
  getAllHelpBooths(): Promise<HelpBooth[]>;
  createHelpBooth(booth: InsertHelpBooth): Promise<HelpBooth>;
  updateHelpBooth(id: string, updates: Partial<HelpBooth>): Promise<HelpBooth>;
  
  // Chat Messages
  getChatMessages(userId?: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Dashboard Stats
  getDashboardStats(): Promise<{
    totalUsers: number;
    activePilgrims: number;
    lostFoundCases: number;
    activeAlerts: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private safetyAlerts: Map<string, SafetyAlert> = new Map();
  private spiritualEvents: Map<string, SpiritualEvent> = new Map();
  private lostFoundCases: Map<string, LostAndFound> = new Map();
  private cleanlinessReports: Map<string, CleanlinessReport> = new Map();
  private crowdData: Map<string, CrowdData> = new Map();
  private helpBooths: Map<string, HelpBooth> = new Map();
  private chatMessages: Map<string, ChatMessage> = new Map();

  constructor() {
    this.initializeWithDummyData();
  }

  private initializeWithDummyData() {
    // Initialize with comprehensive dummy data for full admin demo
    const adminUser: User = {
      id: randomUUID(),
      email: "admin@smartkumbh.com",
      password: "admin123",
      name: "Admin User",
      phone: "+91-9876543210",
      aadhaarNumber: "1234-5678-9012",
      emergencyContact: "+91-9876543211",
      qrId: "KMB-2024-ADMIN",
      isVerified: true,
      isBlocked: false,
      role: "admin",
      currentLocation: "Control Center",
      savedRoutes: ["Har Ki Pauri", "Triveni Sangam"],
      language: "en",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Add multiple sample users for management demo
    const sampleUsers = [
      {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@gmail.com",
        phone: "+91-9876543211",
        aadhaarNumber: "2345-6789-0123",
        emergencyContact: "+91-9876543212",
        currentLocation: "Har Ki Pauri",
        isVerified: true,
        isBlocked: false
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@gmail.com",
        phone: "+91-9876543213",
        aadhaarNumber: "3456-7890-1234",
        emergencyContact: "+91-9876543214",
        currentLocation: "Triveni Sangam",
        isVerified: false,
        isBlocked: false
      },
      {
        name: "Amit Gupta",
        email: "amit.gupta@gmail.com",
        phone: "+91-9876543215",
        aadhaarNumber: "4567-8901-2345",
        emergencyContact: "+91-9876543216",
        currentLocation: "Dashashwamedh Ghat",
        isVerified: true,
        isBlocked: true
      },
      {
        name: "Sunita Devi",
        email: "sunita.devi@gmail.com",
        phone: "+91-9876543217",
        aadhaarNumber: "5678-9012-3456",
        emergencyContact: "+91-9876543218",
        currentLocation: "Assi Ghat",
        isVerified: false,
        isBlocked: false
      },
      {
        name: "Rohit Singh",
        email: "rohit.singh@gmail.com",
        phone: "+91-9876543219",
        aadhaarNumber: "6789-0123-4567",
        emergencyContact: "+91-9876543220",
        currentLocation: "Manikarnika Ghat",
        isVerified: true,
        isBlocked: false
      }
    ];

    sampleUsers.forEach(userData => {
      const userId = randomUUID();
      const user: User = {
        id: userId,
        email: userData.email,
        password: "user123",
        name: userData.name,
        phone: userData.phone,
        aadhaarNumber: userData.aadhaarNumber,
        emergencyContact: userData.emergencyContact,
        qrId: `KMB-2024-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        isVerified: userData.isVerified,
        isBlocked: userData.isBlocked,
        role: "user",
        currentLocation: userData.currentLocation,
        savedRoutes: [],
        language: "en",
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      };
      this.users.set(userId, user);
    });

    // Add multiple sample safety alerts
    const alerts = [
      {
        title: "High Crowd Alert",
        message: "Har Ki Pauri experiencing high crowd density. Please use alternate routes.",
        alertType: "crowd",
        priority: "high",
        location: "Har Ki Pauri",
        isActive: true
      },
      {
        title: "Weather Advisory",
        message: "Heavy rain expected after 6 PM. Carry umbrellas and use covered areas.",
        alertType: "weather",
        priority: "medium",
        location: "All Areas",
        isActive: true
      },
      {
        title: "Route Closure",
        message: "Main road to Dashashwamedh Ghat temporarily closed for maintenance.",
        alertType: "route",
        priority: "high",
        location: "Dashashwamedh Ghat",
        isActive: true
      },
      {
        title: "Emergency Drill",
        message: "Emergency evacuation drill completed successfully. All routes operational.",
        alertType: "emergency",
        priority: "low",
        location: "Control Center",
        isActive: false
      }
    ];

    alerts.forEach(alertData => {
      const alert: SafetyAlert = {
        ...alertData,
        id: randomUUID(),
        createdBy: alertData.alertType === "emergency" ? "Emergency Team" : "System",
        createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        location: alertData.location,
        isActive: alertData.isActive,
      };
      this.safetyAlerts.set(alert.id, alert);
    });

    // Add multiple sample spiritual events
    const events = [
      {
        name: "Maha Aarti",
        description: "Grand evening aarti ceremony at the holy ghats",
        location: "Har Ki Pauri",
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        duration: 60,
        isLive: false,
        liveStreamUrl: "https://stream.example.com/maha-aarti"
      },
      {
        name: "Morning Bhajan",
        description: "Devotional songs and prayers to start the day",
        location: "Dashashwamedh Ghat",
        dateTime: new Date(Date.now() + 14 * 60 * 60 * 1000),
        duration: 45,
        isLive: true,
        liveStreamUrl: "https://stream.example.com/morning-bhajan"
      },
      {
        name: "Ganga Aarti",
        description: "Sacred evening prayers to River Ganga",
        location: "Assi Ghat",
        dateTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
        duration: 90,
        isLive: false,
        liveStreamUrl: "https://stream.example.com/ganga-aarti"
      },
      {
        name: "Satsang",
        description: "Spiritual discourse by renowned saints",
        location: "Triveni Sangam",
        dateTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
        duration: 120,
        isLive: false,
        liveStreamUrl: ""
      }
    ];

    events.forEach(eventData => {
      const event: SpiritualEvent = {
        ...eventData,
        id: randomUUID(),
        reminderUserIds: [],
        createdAt: new Date(),
      };
      this.spiritualEvents.set(event.id, event);
    });

    // Add comprehensive sample crowd data
    const crowdDataPoints = [
      {
        location: "Har Ki Pauri",
        latitude: "29.9457",
        longitude: "78.1642",
        crowdCount: 8500,
        densityLevel: "high"
      },
      {
        location: "Dashashwamedh Ghat",
        latitude: "25.3176",
        longitude: "82.9739",
        crowdCount: 12000,
        densityLevel: "critical"
      },
      {
        location: "Triveni Sangam",
        latitude: "25.4358",
        longitude: "81.8463",
        crowdCount: 6500,
        densityLevel: "medium"
      },
      {
        location: "Assi Ghat",
        latitude: "25.2677",
        longitude: "82.9910",
        crowdCount: 3200,
        densityLevel: "low"
      },
      {
        location: "Manikarnika Ghat",
        latitude: "25.3072",
        longitude: "82.9731",
        crowdCount: 4800,
        densityLevel: "medium"
      },
      {
        location: "Ram Ghat",
        latitude: "25.3190",
        longitude: "82.9650",
        crowdCount: 2100,
        densityLevel: "low"
      }
    ];

    crowdDataPoints.forEach(crowdPoint => {
      const crowdData: CrowdData = {
        ...crowdPoint,
        id: randomUUID(),
        timestamp: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
      };
      this.crowdData.set(crowdData.id, crowdData);
    });

    // Add multiple help booths
    const helpBooths = [
      {
        name: "Main Help Center",
        location: "Har Ki Pauri Gate 1",
        latitude: "29.9457",
        longitude: "78.1642",
        volunteers: ["Rajesh Volunteer", "Priya Volunteer"],
        isActive: true,
        contactNumber: "+91-1800-KUMBH",
        services: ["Information", "First Aid", "Lost & Found"]
      },
      {
        name: "Medical Aid Station",
        location: "Dashashwamedh Ghat",
        latitude: "25.3176",
        longitude: "82.9739",
        volunteers: ["Dr. Kumar", "Nurse Sharma"],
        isActive: true,
        contactNumber: "+91-1800-MEDICAL",
        services: ["Medical Aid", "Emergency Response", "Ambulance"]
      },
      {
        name: "Information Kiosk",
        location: "Triveni Sangam",
        latitude: "25.4358",
        longitude: "81.8463",
        volunteers: ["Guide Singh", "Helper Devi"],
        isActive: true,
        contactNumber: "+91-1800-INFO",
        services: ["Tourist Information", "Route Guidance", "Language Support"]
      },
      {
        name: "Security Post",
        location: "Assi Ghat",
        latitude: "25.2677",
        longitude: "82.9910",
        volunteers: ["Officer Yadav", "Constable Mishra"],
        isActive: true,
        contactNumber: "+91-100",
        services: ["Security", "Crowd Control", "Emergency Response"]
      }
    ];

    helpBooths.forEach(boothData => {
      const booth: HelpBooth = {
        ...boothData,
        id: randomUUID(),
      };
      this.helpBooths.set(booth.id, booth);
    });

    // Add sample lost & found cases
    const lostFoundCases = [
      {
        type: "missing_person",
        reportedBy: "Rajesh Kumar",
        contactPhone: "+91-9876543211",
        description: "Missing: 8-year-old boy, Arjun Kumar. Last seen wearing blue shirt and khaki shorts.",
        lastSeenLocation: "Har Ki Pauri",
        status: "active",
        isApproved: false,
        assignedOfficer: null
      },
      {
        type: "missing_item",
        reportedBy: "Priya Sharma",
        contactPhone: "+91-9876543213",
        description: "Lost mobile phone - Samsung Galaxy S21, black color with floral phone case.",
        lastSeenLocation: "Dashashwamedh Ghat",
        status: "active",
        isApproved: true,
        assignedOfficer: "Officer Yadav"
      },
      {
        type: "found_item",
        reportedBy: "Volunteer Team",
        contactPhone: "+91-1800-KUMBH",
        description: "Found: Gold bracelet with initials 'SK' engraved. Found near prayer area.",
        lastSeenLocation: "Triveni Sangam",
        status: "active",
        isApproved: true,
        assignedOfficer: null
      },
      {
        type: "missing_person",
        reportedBy: "Sunita Devi",
        contactPhone: "+91-9876543217",
        description: "Missing: Elderly man, 70 years old, wearing white dhoti and orange shawl.",
        lastSeenLocation: "Manikarnika Ghat",
        status: "resolved",
        isApproved: true,
        assignedOfficer: "Officer Mishra"
      }
    ];

    lostFoundCases.forEach(caseData => {
      const lostFoundCase: LostAndFound = {
        ...caseData,
        id: randomUUID(),
        createdAt: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000),
        resolvedAt: caseData.status === "resolved" ? new Date() : null,
        status: caseData.status,
        lastSeenLocation: caseData.lastSeenLocation,
        isApproved: caseData.isApproved,
        assignedOfficer: caseData.assignedOfficer,
      };
      this.lostFoundCases.set(lostFoundCase.id, lostFoundCase);
    });

    // Add sample cleanliness reports
    const cleanlinessReports = [
      {
        location: "Har Ki Pauri Toilets",
        facilityType: "toilet",
        rating: 2,
        feedback: "Toilets need immediate cleaning and maintenance. Water supply is irregular.",
        reportedBy: "Rajesh Kumar",
        isResolved: false,
        assignedStaff: null
      },
      {
        location: "Dashashwamedh Ghat",
        facilityType: "ghat",
        rating: 4,
        feedback: "Ghat is generally clean but could use more waste bins.",
        reportedBy: "Priya Sharma",
        isResolved: true,
        assignedStaff: "Cleaning Team A"
      },
      {
        location: "Triveni Sangam Area",
        facilityType: "general",
        rating: 3,
        feedback: "Area is moderately clean but has some plastic waste near the shore.",
        reportedBy: "Amit Gupta",
        isResolved: false,
        assignedStaff: "Cleaning Team B"
      },
      {
        location: "Assi Ghat Facilities",
        facilityType: "toilet",
        rating: 5,
        feedback: "Excellent maintenance and cleanliness. Very satisfied.",
        reportedBy: "Sunita Devi",
        isResolved: true,
        assignedStaff: "Cleaning Team C"
      }
    ];

    cleanlinessReports.forEach(reportData => {
      const report: CleanlinessReport = {
        ...reportData,
        id: randomUUID(),
        createdAt: new Date(Date.now() - Math.random() * 72 * 60 * 60 * 1000),
        resolvedAt: reportData.isResolved ? new Date() : null,
        assignedStaff: reportData.assignedStaff,
      };
      this.cleanlinessReports.set(report.id, report);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      qrId: `KMB-2024-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      isVerified: false,
      isBlocked: false,
      role: insertUser.role || "user",
      savedRoutes: [],
      language: "en",
      createdAt: new Date(),
      phone: insertUser.phone || null,
      aadhaarNumber: insertUser.aadhaarNumber || null,
      emergencyContact: insertUser.emergencyContact || null,
      currentLocation: insertUser.currentLocation || null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Safety Alert methods
  async getAllSafetyAlerts(): Promise<SafetyAlert[]> {
    return Array.from(this.safetyAlerts.values());
  }

  async createSafetyAlert(insertAlert: InsertSafetyAlert): Promise<SafetyAlert> {
    const id = randomUUID();
    const alert: SafetyAlert = {
      ...insertAlert,
      id,
      createdAt: new Date(),
      expiresAt: insertAlert.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
      location: insertAlert.location || null,
      isActive: insertAlert.isActive || null,
    };
    this.safetyAlerts.set(id, alert);
    return alert;
  }

  async updateSafetyAlert(id: string, updates: Partial<SafetyAlert>): Promise<SafetyAlert> {
    const alert = this.safetyAlerts.get(id);
    if (!alert) throw new Error("Safety alert not found");
    
    const updatedAlert = { ...alert, ...updates };
    this.safetyAlerts.set(id, updatedAlert);
    return updatedAlert;
  }

  // Spiritual Event methods
  async getAllSpiritualEvents(): Promise<SpiritualEvent[]> {
    return Array.from(this.spiritualEvents.values());
  }

  async createSpiritualEvent(insertEvent: InsertSpiritualEvent): Promise<SpiritualEvent> {
    const id = randomUUID();
    const event: SpiritualEvent = {
      ...insertEvent,
      id,
      createdAt: new Date(),
      description: insertEvent.description || null,
      duration: insertEvent.duration || null,
      liveStreamUrl: insertEvent.liveStreamUrl || null,
      isLive: insertEvent.isLive || null,
      reminderUserIds: (insertEvent.reminderUserIds || []) as string[],
    };
    this.spiritualEvents.set(id, event);
    return event;
  }

  async updateSpiritualEvent(id: string, updates: Partial<SpiritualEvent>): Promise<SpiritualEvent> {
    const event = this.spiritualEvents.get(id);
    if (!event) throw new Error("Spiritual event not found");
    
    const updatedEvent = { ...event, ...updates };
    this.spiritualEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  // Lost & Found methods
  async getAllLostFoundCases(): Promise<LostAndFound[]> {
    return Array.from(this.lostFoundCases.values());
  }

  async createLostFoundCase(insertCase: InsertLostAndFound): Promise<LostAndFound> {
    const id = randomUUID();
    const case_: LostAndFound = {
      ...insertCase,
      id,
      createdAt: new Date(),
      resolvedAt: null,
      status: insertCase.status || null,
      lastSeenLocation: insertCase.lastSeenLocation || null,
      isApproved: insertCase.isApproved || null,
      assignedOfficer: insertCase.assignedOfficer || null,
    };
    this.lostFoundCases.set(id, case_);
    return case_;
  }

  async updateLostFoundCase(id: string, updates: Partial<LostAndFound>): Promise<LostAndFound> {
    const case_ = this.lostFoundCases.get(id);
    if (!case_) throw new Error("Lost & Found case not found");
    
    const updatedCase = { ...case_, ...updates };
    this.lostFoundCases.set(id, updatedCase);
    return updatedCase;
  }

  // Cleanliness Report methods
  async getAllCleanlinessReports(): Promise<CleanlinessReport[]> {
    return Array.from(this.cleanlinessReports.values());
  }

  async createCleanlinessReport(insertReport: InsertCleanlinessReport): Promise<CleanlinessReport> {
    const id = randomUUID();
    const report: CleanlinessReport = {
      ...insertReport,
      id,
      createdAt: new Date(),
      resolvedAt: null,
      feedback: insertReport.feedback || null,
      isResolved: insertReport.isResolved || null,
      assignedStaff: insertReport.assignedStaff || null,
    };
    this.cleanlinessReports.set(id, report);
    return report;
  }

  async updateCleanlinessReport(id: string, updates: Partial<CleanlinessReport>): Promise<CleanlinessReport> {
    const report = this.cleanlinessReports.get(id);
    if (!report) throw new Error("Cleanliness report not found");
    
    const updatedReport = { ...report, ...updates };
    this.cleanlinessReports.set(id, updatedReport);
    return updatedReport;
  }

  // Crowd Data methods
  async getAllCrowdData(): Promise<CrowdData[]> {
    return Array.from(this.crowdData.values());
  }

  async createCrowdData(insertData: InsertCrowdData): Promise<CrowdData> {
    const id = randomUUID();
    const data: CrowdData = {
      ...insertData,
      id,
      timestamp: new Date(),
    };
    this.crowdData.set(id, data);
    return data;
  }

  // Help Booth methods
  async getAllHelpBooths(): Promise<HelpBooth[]> {
    return Array.from(this.helpBooths.values());
  }

  async createHelpBooth(insertBooth: InsertHelpBooth): Promise<HelpBooth> {
    const id = randomUUID();
    const booth: HelpBooth = {
      ...insertBooth,
      id,
      isActive: insertBooth.isActive || null,
      volunteers: (insertBooth.volunteers || []) as string[],
      contactNumber: insertBooth.contactNumber || null,
      services: (insertBooth.services || []) as string[],
    };
    this.helpBooths.set(id, booth);
    return booth;
  }

  async updateHelpBooth(id: string, updates: Partial<HelpBooth>): Promise<HelpBooth> {
    const booth = this.helpBooths.get(id);
    if (!booth) throw new Error("Help booth not found");
    
    const updatedBooth = { ...booth, ...updates };
    this.helpBooths.set(id, updatedBooth);
    return updatedBooth;
  }

  // Chat Message methods
  async getChatMessages(userId?: string): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values());
    if (userId) {
      return messages.filter(msg => msg.userId === userId);
    }
    return messages;
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
      language: insertMessage.language || null,
      userId: insertMessage.userId || null,
      response: insertMessage.response || null,
      sessionId: insertMessage.sessionId || null,
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    totalUsers: number;
    activePilgrims: number;
    lostFoundCases: number;
    activeAlerts: number;
  }> {
    const users = Array.from(this.users.values());
    const alerts = Array.from(this.safetyAlerts.values());
    const cases = Array.from(this.lostFoundCases.values());

    return {
      totalUsers: users.length,
      activePilgrims: users.filter(u => !u.isBlocked).length,
      lostFoundCases: cases.filter(c => c.status === "active").length,
      activeAlerts: alerts.filter(a => a.isActive).length,
    };
  }
}

export const storage = new MemStorage();
