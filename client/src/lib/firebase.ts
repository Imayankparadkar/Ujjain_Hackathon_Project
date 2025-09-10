import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";

// Use real Firebase credentials from environment variables
let firebaseConfig;
let useFirebase = false;

// Check if Firebase credentials are available
const hasFirebaseCredentials = import.meta.env.VITE_FIREBASE_API_KEY && 
                                import.meta.env.VITE_FIREBASE_PROJECT_ID &&
                                import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;

if (hasFirebaseCredentials) {
  console.log('🔥 Using Firebase for authentication and database');
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  useFirebase = true;
} else {
  console.log('🏠 Using advanced local storage database for full functionality');
  firebaseConfig = {
    apiKey: "demo-api-key",
    authDomain: "smartkumbh-demo.firebaseapp.com",
    projectId: "smartkumbh-demo",
    storageBucket: "smartkumbh-demo.firebasestorage.app",
    appId: "demo-app-id",
  };
  useFirebase = false;
}

// Initialize comprehensive local database
class LocalDatabase {
  private static instance: LocalDatabase;
  private dbName = 'SmartKumbhDB';
  
  static getInstance() {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }
  
  get(collection: string): any[] {
    const data = localStorage.getItem(`${this.dbName}_${collection}`);
    return data ? JSON.parse(data) : [];
  }
  
  set(collection: string, data: any[]): void {
    localStorage.setItem(`${this.dbName}_${collection}`, JSON.stringify(data));
  }
  
  add(collection: string, item: any): string {
    const items = this.get(collection);
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newItem = { ...item, id, createdAt: new Date().toISOString() };
    items.push(newItem);
    this.set(collection, items);
    return id;
  }
  
  update(collection: string, id: string, updates: any): boolean {
    const items = this.get(collection);
    const index = items.findIndex(item => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
      this.set(collection, items);
      return true;
    }
    return false;
  }
  
  delete(collection: string, id: string): boolean {
    const items = this.get(collection);
    const filtered = items.filter(item => item.id !== id);
    this.set(collection, filtered);
    return filtered.length < items.length;
  }
}

const localDB = LocalDatabase.getInstance();

// Initialize Firebase app with proper error handling for duplicate app
let app;
try {
  app = initializeApp(firebaseConfig, 'smartkumbh-app');
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    app = getApps().find((a: any) => a.name === 'smartkumbh-app') || initializeApp(firebaseConfig, 'smartkumbh-app-' + Date.now());
  } else {
    throw error;
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication functions
export const createUser = async (email: string, password: string, userData: any) => {
  // Generate unique QR ID
  const qrId = `KMB-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  
  if (!useFirebase) {
    // Mock user creation for demo
    const mockUser = {
      uid: `mock-${Date.now()}`,
      email: email,
      ...userData,
      qrId: qrId,
      createdAt: new Date(),
      isVerified: false,
      isBlocked: false,
    };
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    return { user: mockUser };
  }
  
  try {
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Prepare user data for Firestore
    const userDocData = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: userData.name,
      phone: userData.phone || '',
      emergencyContact: userData.emergencyContact || '',
      age: userData.age || null,
      bloodGroup: userData.bloodGroup || '',
      medicalConditions: userData.medicalConditions || [],
      guardianContact: userData.guardianContact || '',
      homeAddress: userData.homeAddress || '',
      qrId: qrId,
      role: userData.role || 'user',
      isVerified: false,
      isBlocked: false,
      savedRoutes: [],
      language: userData.language || 'en',
      createdAt: new Date(),
      lastLogin: new Date(),
    };
    
    // Add user data to Firestore
    await addDoc(collection(db, "users"), userDocData);
    
    return userCredential;
  } catch (error: any) {
    console.error('Firebase auth error:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Registration failed. Please try again.';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please use a different email or try logging in.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use at least 6 characters.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    }
    
    throw new Error(errorMessage);
  }
};

export const loginUser = async (email: string, password: string) => {
  if (!useFirebase) {
    // Mock login for demo - support multiple demo users
    const demoUsers = [
      {
        email: 'user@demo.com',
        password: 'demo123',
        uid: 'demo-user-1',
        name: 'Demo User',
        role: 'user'
      },
      {
        email: 'admin@smartkumbh.com',
        password: 'admin123',
        uid: 'demo-admin-1',
        name: 'Admin User',
        role: 'admin'
      }
    ];

    const demoUser = demoUsers.find(u => u.email === email && u.password === password);
    if (demoUser) {
      const mockUser = {
        ...demoUser,
        qrId: `KMB-2024-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        createdAt: new Date(),
        isVerified: true,
        isBlocked: false,
        savedRoutes: [],
        language: 'en'
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return { user: mockUser };
    } else {
      throw new Error('Invalid credentials');
    }
  }
  
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Firebase login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Clear all localStorage data for demo/mock users
    localStorage.removeItem('mockUser');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('SmartKumbhDB_users');
    localStorage.removeItem('SmartKumbhDB_safetyAlerts');
    localStorage.removeItem('SmartKumbhDB_spiritualEvents');
    localStorage.removeItem('SmartKumbhDB_crowdData');
    localStorage.removeItem('SmartKumbhDB_lostAndFound');
    localStorage.removeItem('SmartKumbhDB_cleanlinessReports');
    localStorage.removeItem('SmartKumbhDB_helpBooths');
    localStorage.removeItem('SmartKumbhDB_chatMessages');
    
    // Sign out from Firebase if available
    if (useFirebase) {
      await signOut(auth);
    }
    
    // Force page reload to clear all state
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    // Even if Firebase logout fails, clear localStorage and redirect
    localStorage.clear();
    window.location.href = '/login';
  }
};

// Firestore utility functions
export const addDocument = async (collectionName: string, data: any) => {
  if (!useFirebase) {
    const id = localDB.add(collectionName, data);
    return { id };
  }
  
  try {
    return await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
    });
  } catch (error: any) {
    // Check if it's a quota exceeded error and switch to local storage permanently
    if (error?.code === 'resource-exhausted' || error?.message?.includes('Quota exceeded')) {
      console.log('🏠 Firebase quota exceeded - switching to local storage for better performance');
      useFirebase = false; // Switch to local storage permanently for this session
    }
    // Always fallback to local storage on any error
    const id = localDB.add(collectionName, data);
    return { id };
  }
};

export const getDocuments = async (collectionName: string, conditions?: any) => {
  if (!useFirebase) {
    return localDB.get(collectionName);
  }
  
  try {
    let q = query(collection(db, collectionName));
    
    if (conditions) {
      q = query(collection(db, collectionName), ...conditions);
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    if (error?.code === 'resource-exhausted' || error?.message?.includes('Quota exceeded')) {
      console.log('🏠 Firebase quota exceeded - switching to local storage for better performance');
      useFirebase = false;
    }
    return localDB.get(collectionName);
  }
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  if (!useFirebase) {
    return localDB.update(collectionName, docId, data);
  }
  
  try {
    const docRef = doc(db, collectionName, docId);
    return await updateDoc(docRef, data);
  } catch (error: any) {
    if (error?.code === 'resource-exhausted' || error?.message?.includes('Quota exceeded')) {
      console.log('🏠 Firebase quota exceeded - switching to local storage for better performance');
      useFirebase = false;
    }
    return localDB.update(collectionName, docId, data);
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  if (!useFirebase) {
    return localDB.delete(collectionName, docId);
  }
  
  try {
    const docRef = doc(db, collectionName, docId);
    return await deleteDoc(docRef);
  } catch (error: any) {
    if (error?.code === 'resource-exhausted' || error?.message?.includes('Quota exceeded')) {
      console.log('🏠 Firebase quota exceeded - switching to local storage for better performance');
      useFirebase = false;
    }
    return localDB.delete(collectionName, docId);
  }
};

export const subscribeToCollection = (collectionName: string, callback: (data: any[]) => void, conditions?: any) => {
  if (!useFirebase) {
    // For local storage, simulate real-time updates by polling
    const interval = setInterval(() => {
      const data = localDB.get(collectionName);
      callback(data);
    }, 5000); // Update every 5 seconds
    
    // Return cleanup function
    return () => clearInterval(interval);
  }
  
  try {
    let q = query(collection(db, collectionName));
    
    if (conditions) {
      q = query(collection(db, collectionName), ...conditions);
    }
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  } catch (error) {
    console.error('Firebase subscription error:', error);
    // Fallback to local polling
    const interval = setInterval(() => {
      const data = localDB.get(collectionName);
      callback(data);
    }, 5000);
    return () => clearInterval(interval);
  }
};

// Generate comprehensive dummy data for hackathon demo
export const generateDummyData = async () => {
  try {
    // Generate comprehensive safety alerts
    const safetyAlerts = [
      {
        title: "🚨 Critical Crowd Alert",
        message: "Mahakaleshwar Temple experiencing extremely high crowd density (8,500+ pilgrims). Use alternate Male/Female routes for faster access.",
        alertType: "crowd",
        priority: "critical",
        location: "Mahakaleshwar Temple",
        isActive: true,
        createdBy: "AI System",
        affectedAreas: ["Main Gate", "Male Route", "Female Route"],
        estimatedWaitTime: "45 minutes",
        alternateRoutes: ["Senior Citizen Path", "VIP Entry"],
      },
      {
        title: "🌧️ Weather Update",
        message: "Light rain predicted from 6 PM onwards. Temple authorities have arranged covered walkways. Carry umbrellas.",
        alertType: "weather",
        priority: "medium",
        location: "All Areas",
        isActive: true,
        createdBy: "Weather Monitoring",
        temperature: "28°C",
        humidity: "75%",
        windSpeed: "12 km/h",
      },
      {
        title: "🚧 Route Closure",
        message: "East Gate temporarily closed for maintenance. Please use North or South gates for entry.",
        alertType: "infrastructure",
        priority: "high",
        location: "East Gate",
        isActive: true,
        createdBy: "Infrastructure Team",
        expectedDuration: "2 hours",
        alternateEntries: ["North Gate", "South Gate"],
      },
      {
        title: "📱 Network Congestion",
        message: "High mobile network usage in Mahakal area. Use WiFi hotspots available at information centers.",
        alertType: "network",
        priority: "low",
        location: "Mahakal Area",
        isActive: true,
        createdBy: "Network Team",
        wifiHotspots: ["Info Center 1", "Info Center 2", "Medical Station"],
      },
      {
        title: "🏥 Medical Alert",
        message: "Extra medical staff deployed due to high temperatures. Stay hydrated and seek shade regularly.",
        alertType: "medical",
        priority: "medium",
        location: "All Areas",
        isActive: true,
        createdBy: "Medical Team",
        medicalStations: 8,
        ambulancesOnStandby: 5,
      }
    ];

    for (const alert of safetyAlerts) {
      await addDocument("safetyAlerts", alert);
    }

    // Generate detailed spiritual events
    const spiritualEvents = [
      {
        name: "Mahakal Bhasma Aarti",
        description: "Sacred Bhasma Aarti performed with ash from cremation grounds. Only 50 devotees allowed inside sanctum.",
        location: "Mahakaleshwar Temple - Inner Sanctum",
        dateTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
        duration: 90,
        isLive: true,
        liveStreamUrl: "https://live.smartkumbh.com/bhasma-aarti",
        reminderUserIds: [],
        capacity: 50,
        currentAttendees: 47,
        specialInstructions: "Remove shoes, mobile phones not allowed",
        significance: "Most sacred ritual of Lord Shiva",
      },
      {
        name: "Ganga Aarti at Triveni",
        description: "Evening aarti at the sacred confluence of three rivers. Mass participation with floating diyas.",
        location: "Triveni Sangam Ghat",
        dateTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        duration: 60,
        isLive: false,
        liveStreamUrl: "",
        reminderUserIds: [],
        capacity: 2000,
        currentAttendees: 1250,
        ticketPrice: 0,
        amenities: ["Prasad Counter", "Photo Service", "Wheelchair Access"],
      },
      {
        name: "Ram Katha Pravachan",
        description: "Sacred discourse on Ramayana by renowned Sanskrit scholar Pandit Rajesh Shastri.",
        location: "Dharmic Sabha Ground",
        dateTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
        duration: 120,
        isLive: false,
        liveStreamUrl: "",
        reminderUserIds: [],
        capacity: 5000,
        currentAttendees: 3200,
        speaker: "Pandit Rajesh Shastri",
        languages: ["Hindi", "Sanskrit", "English translation available"],
      },
      {
        name: "Sadhus Procession",
        description: "Grand procession of Naga Sadhus and various akharas. Witness the ancient traditions of Kumbh Mela.",
        location: "Main Procession Route",
        dateTime: new Date(Date.now() + 18 * 60 * 60 * 1000),
        duration: 180,
        isLive: false,
        liveStreamUrl: "",
        reminderUserIds: [],
        participatingAkharas: 13,
        estimatedSadhus: 10000,
        routeLength: "5.2 km",
        viewingPoints: ["Point 1", "Point 2", "Point 3", "Point 4"],
      },
      {
        name: "Midnight Abhishek",
        description: "Special midnight abhishek (holy bath) of Lord Shiva. Limited entry with advance booking only.",
        location: "Mahakaleshwar Temple",
        dateTime: new Date(Date.now() + 14 * 60 * 60 * 1000),
        duration: 45,
        isLive: true,
        liveStreamUrl: "https://live.smartkumbh.com/midnight-abhishek",
        reminderUserIds: [],
        capacity: 30,
        currentAttendees: 30,
        bookingRequired: true,
        bookingFee: 500,
        includes: ["Prasad", "Sacred Thread", "Holy Water"],
      }
    ];

    for (const event of spiritualEvents) {
      await addDocument("spiritualEvents", event);
    }

    // Generate comprehensive crowd data for Ujjain locations
    const locations = [
      { name: "Mahakaleshwar Temple Main Gate", lat: "23.1815", lng: "75.7682", type: "temple", capacity: 10000 },
      { name: "Male Devotee Route", lat: "23.1820", lng: "75.7685", type: "route", capacity: 8000 },
      { name: "Female Devotee Route", lat: "23.1810", lng: "75.7685", type: "route", capacity: 6000 },
      { name: "Senior Citizens Priority Path", lat: "23.1825", lng: "75.7680", type: "route", capacity: 2000 },
      { name: "VIP Darshan Entry", lat: "23.1812", lng: "75.7678", type: "entrance", capacity: 500 },
      { name: "Temple Inner Sanctum", lat: "23.1818", lng: "75.7678", type: "sanctum", capacity: 100 },
      { name: "Prasad Counter Area", lat: "23.1822", lng: "75.7683", type: "facility", capacity: 1500 },
      { name: "Parking Area 1", lat: "23.1830", lng: "75.7690", type: "parking", capacity: 3000 },
      { name: "Information Center", lat: "23.1805", lng: "75.7675", type: "facility", capacity: 800 },
      { name: "Medical Station", lat: "23.1808", lng: "75.7688", type: "medical", capacity: 200 },
    ];

    for (const location of locations) {
      const crowdCount = Math.floor(Math.random() * location.capacity * 0.9) + Math.floor(location.capacity * 0.1);
      const occupancyRate = Math.round((crowdCount / location.capacity) * 100);
      
      let densityLevel = "low";
      let waitTime = "No wait";
      let status = "normal";
      
      if (occupancyRate > 90) {
        densityLevel = "critical";
        waitTime = "45-60 min";
        status = "overcrowded";
      } else if (occupancyRate > 75) {
        densityLevel = "high";
        waitTime = "25-35 min";
        status = "busy";
      } else if (occupancyRate > 50) {
        densityLevel = "medium";
        waitTime = "10-20 min";
        status = "moderate";
      } else {
        waitTime = "No wait";
        status = "clear";
      }

      await addDocument("crowdData", {
        location: location.name,
        latitude: location.lat,
        longitude: location.lng,
        crowdCount,
        capacity: location.capacity,
        occupancyRate,
        densityLevel,
        waitTime,
        status,
        lastUpdated: new Date(),
        timestamp: new Date(),
        type: location.type,
        facilities: location.type === 'medical' ? ['First Aid', 'Ambulance', 'Wheelchair'] : 
                   location.type === 'facility' ? ['Water', 'Restroom', 'Information'] :
                   location.type === 'parking' ? ['Security', 'CCTV', 'Lighting'] : [],
      });
    }

    // Generate Lost & Found cases
    const lostFoundCases = [
      {
        type: "missing_person",
        name: "Ramesh Kumar",
        age: 67,
        description: "Elderly man, white beard, wearing orange kurta, speaks Hindi",
        lastSeenLocation: "Mahakaleshwar Temple",
        lastSeenTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
        contactInfo: "+91-9876543210",
        reportedBy: "Sita Devi (Wife)",
        status: "active",
        priority: "high",
        caseNumber: "LF-2024-001",
        assignedOfficer: "Inspector Sharma",
        medicalConditions: "Diabetes, High BP",
      },
      {
        type: "missing_item",
        name: "Black Handbag",
        description: "Black leather handbag containing documents, mobile phone, and cash",
        lastSeenLocation: "Prasad Counter",
        lastSeenTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
        contactInfo: "+91-8765432109",
        reportedBy: "Priya Sharma",
        status: "active",
        priority: "medium",
        caseNumber: "LF-2024-002",
        contents: ["Aadhaar Card", "Mobile Phone", "Cash Rs.5000", "Gold Ring"],
      },
      {
        type: "found_item",
        name: "Child's School Bag",
        description: "Blue school bag with cartoon characters",
        foundLocation: "Information Center",
        foundTime: new Date(Date.now() - 30 * 60 * 1000),
        foundBy: "Volunteer Team",
        status: "found",
        storageLocation: "Lost Property Office",
        caseNumber: "LF-2024-003",
        condition: "Good",
      },
      {
        type: "missing_child",
        name: "Arjun Patel",
        age: 8,
        description: "8-year-old boy, red t-shirt, blue shorts, speaks Gujarati and Hindi",
        lastSeenLocation: "Near Temple Entrance",
        lastSeenTime: new Date(Date.now() - 45 * 60 * 1000),
        contactInfo: "+91-7654321098",
        reportedBy: "Kishore Patel (Father)",
        status: "active",
        priority: "critical",
        caseNumber: "LF-2024-004",
        assignedOfficer: "Sub-Inspector Patel",
        photo: "Available",
        announcementMade: true,
      }
    ];

    for (const case_ of lostFoundCases) {
      await addDocument("lostAndFound", case_);
    }

    // Generate Cleanliness Reports
    const cleanlinessReports = [
      {
        location: "Toilet Block A",
        rating: 4,
        issues: ["Low soap supply"],
        reportedBy: "Anonymous",
        facilityType: "restroom",
        maintenanceRequired: false,
        lastCleaned: new Date(Date.now() - 2 * 60 * 60 * 1000),
        cleaningFrequency: "Every 2 hours",
        status: "good",
      },
      {
        location: "Main Ghat Area",
        rating: 3,
        issues: ["Litter scattered", "Need more dustbins"],
        reportedBy: "Volunteer Raj",
        facilityType: "public_area",
        maintenanceRequired: true,
        actionTaken: "Cleaning crew dispatched",
        priority: "medium",
        status: "under_maintenance",
      },
      {
        location: "Food Court",
        rating: 5,
        issues: [],
        reportedBy: "Health Inspector",
        facilityType: "food_area",
        maintenanceRequired: false,
        lastInspection: new Date(),
        hygieneCertificate: "Valid",
        status: "excellent",
      }
    ];

    for (const report of cleanlinessReports) {
      await addDocument("cleanlinessReports", report);
    }

    // Generate Help Booth Data
    const helpBooths = [
      {
        name: "Main Information Center",
        location: "Near Temple Entrance",
        services: ["Information", "Lost & Found", "Emergency Contact", "Medical Aid"],
        staffCount: 8,
        languages: ["Hindi", "English", "Gujarati", "Marathi"],
        contactNumber: "+91-1234567890",
        operatingHours: "24/7",
        currentStatus: "active",
        equipments: ["First Aid Kit", "Wheelchair", "Lost Property Storage", "Phone Charging"],
      },
      {
        name: "Tourist Help Desk",
        location: "Main Gate",
        services: ["Tourist Information", "Guide Services", "Complaint Registration"],
        staffCount: 4,
        languages: ["Hindi", "English"],
        contactNumber: "+91-1234567891",
        operatingHours: "6 AM - 10 PM",
        currentStatus: "active",
        specialServices: ["Free Maps", "Audio Guides", "Photography Services"],
      }
    ];

    for (const booth of helpBooths) {
      await addDocument("helpBooths", booth);
    }

    console.log("✅ Comprehensive hackathon dummy data generated successfully!");
    console.log("📊 Generated: Safety Alerts, Events, Crowd Data, Lost & Found, Cleanliness Reports, Help Booths");
  } catch (error) {
    console.error("❌ Error generating dummy data:", error);
  }
};
