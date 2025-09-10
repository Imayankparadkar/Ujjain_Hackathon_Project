import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ElderlyModeProvider } from "@/contexts/ElderlyModeContext";
import HomePage from "@/pages/HomePage";
import FeaturesPage from "@/pages/FeaturesPage";
import MapPage from "@/pages/MapPage";
import LostFoundPage from "@/pages/LostFoundPage";
import SpiritualPage from "@/pages/SpiritualPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import UserDashboard from "@/pages/UserDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AttractionsPage from "@/pages/AttractionsPage";
import NotFound from "@/pages/not-found";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import GovernmentGuidelinesPage from "@/pages/GovernmentGuidelinesPage";
import AccessibilityStatementPage from "@/pages/AccessibilityStatementPage";
import DataProtectionPage from "@/pages/DataProtectionPage";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { generateDummyData } from "@/lib/firebase";
import { startRealTimeUpdates } from "@/lib/realTimeDataManager";
import { initializeData } from "@/lib/dataSeeder";

function ProtectedRoute({ 
  children, 
  adminOnly = false 
}: { 
  children: React.ReactNode; 
  adminOnly?: boolean;
}) {
  const { user, userProfile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">🕉️</div>
          <div className="text-lg font-semibold mt-2">SmartKumbh</div>
          <div className="text-sm text-muted-foreground mt-1">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (adminOnly && !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access this area.</p>
      </div>
    </div>;
  }

  return <>{children}</>;
}

function Router() {
  const { user, isAdmin, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [dummyDataGenerated, setDummyDataGenerated] = useState(false);

  useEffect(() => {
    // Initialize data more efficiently to avoid Firebase quota issues
    const isAlreadySeeded = localStorage.getItem('smartkumbh_seeded') === 'true';
    const isAlreadyInitialized = localStorage.getItem('smartkumbh_initialized') === 'true';
    
    if (!dummyDataGenerated && !loading && !isAlreadySeeded && !isAlreadyInitialized) {
      // Mark as being initialized to prevent duplicate calls
      localStorage.setItem('smartkumbh_initialized', 'true');
      
      // Only initialize the most critical data to avoid quota issues
      initializeData().then(() => {
        setDummyDataGenerated(true);
        // Start real-time data updates for impressive hackathon demo
        startRealTimeUpdates();
      }).catch((error) => {
        console.log("Data initialization completed with local storage fallback:", error);
        // Even if Firebase fails, mark as initialized and use local storage
        setDummyDataGenerated(true);
        startRealTimeUpdates();
      });
    } else if (isAlreadySeeded || isAlreadyInitialized) {
      // Data already exists, just start real-time updates
      setDummyDataGenerated(true);
      startRealTimeUpdates();
    }
  }, [loading, dummyDataGenerated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl text-primary mb-4">🕉️</div>
          <div className="text-xl font-bold mb-2">SmartKumbh</div>
          <div className="text-muted-foreground">Initializing application...</div>
        </div>
      </div>
    );
  }

  // If user is admin, show only admin dashboard (no public site access)
  if (user && isAdmin) {
    return (
      <Switch>
        <Route path="/admin/login" component={AdminLoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/admin">
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/">
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        </Route>
        <Route component={() => {
          setLocation("/admin");
          return null;
        }} />
      </Switch>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/map" component={MapPage} />
      <Route path="/lost-found" component={LostFoundPage} />
      <Route path="/spiritual" component={SpiritualPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/attractions" component={AttractionsPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route path="/government-guidelines" component={GovernmentGuidelinesPage} />
      <Route path="/accessibility-statement" component={AccessibilityStatementPage} />
      <Route path="/data-protection" component={DataProtectionPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      
      {/* User dashboard */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      </Route>
      
      {/* Admin routes - redirect to login if not admin */}
      <Route path="/admin">
        <AdminLoginPage />
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ElderlyModeProvider>
            <Toaster />
            <Router />
          </ElderlyModeProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
