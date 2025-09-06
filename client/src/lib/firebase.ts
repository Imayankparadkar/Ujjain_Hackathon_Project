import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";

// Parse Firebase config from environment variable or use mock data
let firebaseConfig;
let useFirebase = false;

try {
  const configString = import.meta.env.VITE_FIREBASE_CONFIG;
  if (configString && configString !== '{}' && configString.includes('apiKey')) {
    firebaseConfig = JSON.parse(configString);
    useFirebase = true;
  } else {
    throw new Error('No valid Firebase config');
  }
} catch (error) {
  console.log('Using local mock data instead of Firebase');
  firebaseConfig = {
    apiKey: "demo-api-key",
    authDomain: "smartkumbh-demo.firebaseapp.com",
    projectId: "smartkumbh-demo",
    storageBucket: "smartkumbh-demo.firebasestorage.app",
    appId: "demo-app-id",
  };
  useFirebase = false;
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication functions
export const createUser = async (email: string, password: string, userData: any) => {
  if (!useFirebase) {
    // Mock user creation for demo
    const mockUser = {
      uid: `mock-${Date.now()}`,
      email: email,
      ...userData,
      qrId: `KMB-2024-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      createdAt: new Date(),
    };
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    return mockUser;
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Add user data to Firestore
    await addDoc(collection(db, "users"), {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      ...userData,
      qrId: `KMB-2024-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      createdAt: new Date(),
    });
    
    return userCredential.user;
  } catch (error) {
    console.error('Firebase auth error:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  if (!useFirebase) {
    // Mock login for demo
    const mockUser = JSON.parse(localStorage.getItem('mockUser') || '{}');
    if (mockUser.email === email) {
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
  return await signOut(auth);
};

// Firestore utility functions
export const addDocument = async (collectionName: string, data: any) => {
  if (!useFirebase) {
    // Store in localStorage for demo
    const key = `mock_${collectionName}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const newDoc = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
    };
    existing.push(newDoc);
    localStorage.setItem(key, JSON.stringify(existing));
    return { id: newDoc.id };
  }
  
  try {
    return await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Firebase addDocument error:', error);
    return { id: Date.now().toString() };
  }
};

export const getDocuments = async (collectionName: string, conditions?: any) => {
  if (!useFirebase) {
    // Return mock data from localStorage
    const key = `mock_${collectionName}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    return data;
  }
  
  try {
    let q = query(collection(db, collectionName));
    
    if (conditions) {
      q = query(collection(db, collectionName), ...conditions);
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Firebase getDocuments error:', error);
    return [];
  }
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  const docRef = doc(db, collectionName, docId);
  return await updateDoc(docRef, data);
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  return await deleteDoc(docRef);
};

export const subscribeToCollection = (collectionName: string, callback: (data: any[]) => void, conditions?: any) => {
  let q = query(collection(db, collectionName));
  
  if (conditions) {
    q = query(collection(db, collectionName), ...conditions);
  }
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

// Generate dummy data for development
export const generateDummyData = async () => {
  try {
    // Generate safety alerts
    const safetyAlerts = [
      {
        title: "High Crowd Alert",
        message: "Har Ki Pauri experiencing high crowd density. Please use alternate routes.",
        alertType: "crowd",
        priority: "high",
        location: "Har Ki Pauri",
        isActive: true,
        createdBy: "system",
      },
      {
        title: "Weather Alert",
        message: "Light rain expected in the evening. Carry umbrellas.",
        alertType: "weather",
        priority: "medium",
        location: "All Areas",
        isActive: true,
        createdBy: "system",
      }
    ];

    for (const alert of safetyAlerts) {
      await addDocument("safetyAlerts", alert);
    }

    // Generate spiritual events
    const spiritualEvents = [
      {
        name: "Maha Aarti",
        description: "Grand evening aarti ceremony at the holy ghats",
        location: "Har Ki Pauri",
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 60,
        isLive: false,
        liveStreamUrl: "",
        reminderUserIds: [],
      },
      {
        name: "Ganga Puja",
        description: "Morning prayers at the sacred confluence",
        location: "Triveni Sangam",
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        duration: 45,
        isLive: false,
        liveStreamUrl: "",
        reminderUserIds: [],
      }
    ];

    for (const event of spiritualEvents) {
      await addDocument("spiritualEvents", event);
    }

    // Generate crowd data
    const locations = [
      { name: "Har Ki Pauri", lat: "29.9457", lng: "78.1642" },
      { name: "Triveni Sangam", lat: "25.4358", lng: "81.8463" },
      { name: "Chandi Devi Temple", lat: "29.9759", lng: "78.1354" },
      { name: "Main Bathing Ghat", lat: "29.9456", lng: "78.1640" },
    ];

    for (const location of locations) {
      const crowdCount = Math.floor(Math.random() * 10000) + 1000;
      let densityLevel = "low";
      if (crowdCount > 7000) densityLevel = "critical";
      else if (crowdCount > 5000) densityLevel = "high";
      else if (crowdCount > 3000) densityLevel = "medium";

      await addDocument("crowdData", {
        location: location.name,
        latitude: location.lat,
        longitude: location.lng,
        crowdCount,
        densityLevel,
        timestamp: new Date(),
      });
    }

    console.log("Dummy data generated successfully");
  } catch (error) {
    console.error("Error generating dummy data:", error);
  }
};
