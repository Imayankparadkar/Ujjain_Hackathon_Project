import { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: any | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      // Try to set up Firebase auth
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);
        
        if (firebaseUser) {
          // Fetch user profile from Firestore
          try {
            const q = query(
              collection(db, "users"),
              where("uid", "==", firebaseUser.uid)
            );
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const profileData = querySnapshot.docs[0].data();
              setUserProfile(profileData);
              setIsAdmin(profileData.role === "admin");
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Fallback to localStorage for persistence
            checkLocalStorage();
          }
        } else {
          // User logged out - clear everything
          setUser(null);
          setUserProfile(null);
          setIsAdmin(false);
          checkLocalStorage();
        }
        
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      // If Firebase is not available, just check localStorage
      console.log("Firebase not available, checking local storage");
      checkLocalStorage();
      setLoading(false);
      
      return () => {}; // Return empty cleanup function
    }
  }, []);

  const checkLocalStorage = () => {
    // Check for regular user session
    const mockUser = localStorage.getItem('mockUser');
    // Check for admin session
    const adminSession = localStorage.getItem('adminSession');
    
    if (adminSession) {
      try {
        const adminData = JSON.parse(adminSession);
        // Check if admin session is still valid (24 hour expiry)
        const sessionAge = Date.now() - adminData.loginTime;
        if (sessionAge < 24 * 60 * 60 * 1000) {
          setUser(adminData as any);
          setUserProfile(adminData);
          setIsAdmin(true);
          return;
        } else {
          // Clear expired admin session
          localStorage.removeItem('adminSession');
        }
      } catch (error) {
        console.error("Error parsing admin session:", error);
        localStorage.removeItem('adminSession');
      }
    }
    
    if (mockUser) {
      try {
        const userData = JSON.parse(mockUser);
        setUser(userData as any);
        setUserProfile(userData);
        setIsAdmin(userData.role === "admin");
      } catch (error) {
        console.error("Error parsing mock user:", error);
        localStorage.removeItem('mockUser');
        setUserProfile(null);
        setIsAdmin(false);
      }
    } else {
      setUserProfile(null);
      setIsAdmin(false);
    }
  };

  const logout = async () => {
    try {
      // Clear all localStorage data
      localStorage.removeItem('mockUser');
      localStorage.removeItem('adminSession');
      
      // Clear all database collections from localStorage
      const dbCollections = [
        'SmartKumbhDB_users', 'SmartKumbhDB_safetyAlerts', 'SmartKumbhDB_spiritualEvents',
        'SmartKumbhDB_crowdData', 'SmartKumbhDB_lostAndFound', 'SmartKumbhDB_cleanlinessReports',
        'SmartKumbhDB_helpBooths', 'SmartKumbhDB_chatMessages'
      ];
      
      dbCollections.forEach(collection => {
        localStorage.removeItem(collection);
      });
      
      // Reset state immediately
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
      setLoading(false);
      
      // Try to sign out from Firebase if available
      try {
        const { logoutUser } = await import('@/lib/firebase');
        await logoutUser();
      } catch (error) {
        console.log('Firebase logout handled by firebase module');
      }
    } catch (error) {
      console.error('Logout error in context:', error);
      // Force clear everything
      localStorage.clear();
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
