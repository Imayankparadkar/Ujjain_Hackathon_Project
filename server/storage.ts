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
    // Initialize with some dummy data for demonstration
    const dummyUser: User = {
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
    this.users.set(dummyUser.id, dummyUser);

    // Add sample safety alerts
    const alert1: SafetyAlert = {
      id: randomUUID(),
      title: "High Crowd Alert",
      message: "Har Ki Pauri experiencing high crowd density. Please use alternate routes.",
      alertType: "crowd",
      priority: "high",
      location: "Har Ki Pauri",
      isActive: true,
      createdBy: "System",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    this.safetyAlerts.set(alert1.id, alert1);

    // Add sample spiritual events
    const event1: SpiritualEvent = {
      id: randomUUID(),
      name: "Maha Aarti",
      description: "Grand evening aarti ceremony at the holy ghats",
      location: "Har Ki Pauri",
      dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      duration: 60,
      isLive: false,
      liveStreamUrl: "",
      reminderUserIds: [],
      createdAt: new Date(),
    };
    this.spiritualEvents.set(event1.id, event1);

    // Add sample crowd data
    const crowdData1: CrowdData = {
      id: randomUUID(),
      location: "Har Ki Pauri",
      latitude: "29.9457",
      longitude: "78.1642",
      crowdCount: 8500,
      densityLevel: "high",
      timestamp: new Date(),
    };
    this.crowdData.set(crowdData1.id, crowdData1);

    // Add sample help booth
    const booth1: HelpBooth = {
      id: randomUUID(),
      name: "Main Help Center",
      location: "Har Ki Pauri Gate 1",
      latitude: "29.9457",
      longitude: "78.1642",
      volunteers: ["Volunteer A", "Volunteer B"],
      isActive: true,
      contactNumber: "+91-1800-KUMBH",
      services: ["Information", "First Aid", "Lost & Found"],
    };
    this.helpBooths.set(booth1.id, booth1);
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
      reminderUserIds: insertEvent.reminderUserIds || [],
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
      volunteers: insertBooth.volunteers || [],
      contactNumber: insertBooth.contactNumber || null,
      services: insertBooth.services || [],
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
