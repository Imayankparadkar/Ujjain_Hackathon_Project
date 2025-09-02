import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ElderlyModeProvider } from "@/contexts/ElderlyModeContext";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import UserDashboard from "@/pages/UserDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { generateDummyData } from "@/lib/firebase";

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
  const [dummyDataGenerated, setDummyDataGenerated] = useState(false);

  useEffect(() => {
    // Generate dummy data on first load (only in development)
    if (!dummyDataGenerated && !loading) {
      generateDummyData().then(() => {
        setDummyDataGenerated(true);
      }).catch((error) => {
        console.log("Dummy data generation skipped or failed:", error);
        setDummyDataGenerated(true);
      });
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

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      
      <Route path="/dashboard">
        <ProtectedRoute>
          {isAdmin ? <AdminDashboard /> : <UserDashboard />}
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin">
        <ProtectedRoute adminOnly={true}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/map">
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/lost-found">
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/spiritual">
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/contact">
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
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
