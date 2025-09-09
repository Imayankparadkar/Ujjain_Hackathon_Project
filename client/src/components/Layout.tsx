import { ChatBot } from "@/components/ChatBot";
import { NotificationSystem } from "@/components/NotificationSystem";
import { useAuth } from "@/contexts/AuthContext";
import { useElderlyMode } from "@/contexts/ElderlyModeContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { logoutUser } from "@/lib/firebase";
import { Link, useLocation } from "wouter";
import { User, Eye, LogOut, Bell, ArrowLeft } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export function Layout({ children, showNavigation = true }: LayoutProps) {
  const { user, userProfile, isAdmin } = useAuth();
  const { elderlyMode, toggleElderlyMode } = useElderlyMode();
  const [location] = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isPublicPage = !user;
  const isUserDashboard = user && !isAdmin;
  const isAdminDashboard = user && isAdmin;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {showNavigation && (
        <header className="fixed top-0 left-0 right-0 bg-card border-b border-border shadow-sm z-50">
          <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
              <div className="text-2xl">🕉️</div>
              <span className="text-xl font-bold text-foreground">SmartKumbh</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className={location === "/" ? "text-primary font-medium" : "text-muted-foreground hover:text-primary transition-colors"} data-testid="nav-home">Home</Link>
              <Link href="/features" className={location === "/features" ? "text-primary font-medium" : "text-muted-foreground hover:text-primary transition-colors"} data-testid="nav-features">Features</Link>
              <Link href="/map" className={location === "/map" ? "text-primary font-medium" : "text-muted-foreground hover:text-primary transition-colors"} data-testid="nav-map">Map</Link>
              <Link href="/lost-found" className={location === "/lost-found" ? "text-primary font-medium" : "text-muted-foreground hover:text-primary transition-colors"} data-testid="nav-lost-found">Lost & Found</Link>
              <Link href="/spiritual" className={location === "/spiritual" ? "text-primary font-medium" : "text-muted-foreground hover:text-primary transition-colors"} data-testid="nav-spiritual">Spiritual Live</Link>
              <Link href="/contact" className={location === "/contact" ? "text-primary font-medium" : "text-muted-foreground hover:text-primary transition-colors"} data-testid="nav-contact">Contact</Link>
              
              {user && (
                <>
                  <span className="text-muted-foreground">|</span>
                  <Link href="/dashboard" className={location === "/dashboard" ? "text-primary font-medium" : "text-muted-foreground hover:text-primary transition-colors"} data-testid="nav-dashboard">Dashboard</Link>
                  {isAdmin && (
                    <>
                      <Link href="/admin" className={location === "/admin" ? "text-primary font-medium" : "text-muted-foreground hover:text-primary transition-colors"} data-testid="nav-admin">Admin</Link>
                      {location === "/admin" && (
                        <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 transition-colors flex items-center" data-testid="back-to-user-dashboard">
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          User View
                        </Link>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-3">
              {/* Elderly Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <Switch
                  checked={elderlyMode}
                  onCheckedChange={toggleElderlyMode}
                  data-testid="elderly-mode-toggle"
                />
                <span className="text-sm text-muted-foreground hidden sm:inline">Elder</span>
              </div>

              {/* Notification icon */}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  data-testid="notification-button"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">3</span>
                </Button>
              )}

              {/* User Controls */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm hidden sm:inline" data-testid="user-name">
                      {userProfile?.name || user.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-destructive hover:text-destructive/80"
                    data-testid="logout-button"
                  >
                    <LogOut className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="bg-primary text-primary-foreground hover:bg-secondary" data-testid="login-button">
                    Login/Register
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </header>
      )}

      {/* Main Content */}
      <main className={showNavigation ? "pt-16" : ""}>
        {children}
      </main>

      {/* Footer for public pages */}
      {isPublicPage && (
        <footer className="bg-foreground text-background py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4 text-accent">Emergency Helplines</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>📞</span>
                    <span>Police: 100</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🚒</span>
                    <span>Fire: 101</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🚑</span>
                    <span>Health: 108</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📱</span>
                    <span>SmartKumbh Help: 1800-KUMBH</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-accent">Policies & Information</h3>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block hover:text-accent transition-colors">Privacy Policy</a>
                  <a href="#" className="block hover:text-accent transition-colors">Terms of Service</a>
                  <a href="#" className="block hover:text-accent transition-colors">Government Guidelines</a>
                  <a href="#" className="block hover:text-accent transition-colors">Accessibility Statement</a>
                  <a href="#" className="block hover:text-accent transition-colors">Data Protection</a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-accent">Digital India Initiative</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background/10 p-3 rounded text-center">
                    <div className="text-accent text-2xl mb-1">🏆</div>
                    <div className="text-xs">Certified</div>
                  </div>
                  <div className="bg-background/10 p-3 rounded text-center">
                    <div className="text-green-400 text-2xl mb-1">🔒</div>
                    <div className="text-xs">Secure</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/60">
              <p>&copy; 2024 SmartKumbh. A Digital India Initiative. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}

      {/* Notification System */}
      <NotificationSystem />
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
