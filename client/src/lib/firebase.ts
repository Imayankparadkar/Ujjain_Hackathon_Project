import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartkumbh-demo"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartkumbh-demo",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartkumbh-demo"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication functions
export const createUser = async (email: string, password: string, userData: any) => {
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
};

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

// Firestore utility functions
export const addDocument = async (collectionName: string, data: any) => {
  return await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: new Date(),
  });
};

export const getDocuments = async (collectionName: string, conditions?: any) => {
  let q = query(collection(db, collectionName));
  
  if (conditions) {
    q = query(collection(db, collectionName), ...conditions);
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
