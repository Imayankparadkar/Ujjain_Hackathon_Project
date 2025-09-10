import { ChatBot } from "@/components/ChatBot";
import { NotificationSystem } from "@/components/NotificationSystem";
import { useAuth } from "@/contexts/AuthContext";
import { useElderlyMode } from "@/contexts/ElderlyModeContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Link, useLocation } from "wouter";
import { User, Eye, LogOut, Bell, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export function Layout({ children, showNavigation = true }: LayoutProps) {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const { elderlyMode, toggleElderlyMode } = useElderlyMode();
  const [location] = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect on any error
      window.location.href = '/login';
    }
  };

  const isPublicPage = !user;
  const isUserDashboard = user && !isAdmin;
  const isAdminDashboard = user && isAdmin;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {showNavigation && (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 backdrop-blur-sm">
          <nav className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity flex-shrink-0" data-testid="logo-link">
              <div className="text-2xl">🕉️</div>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">SmartKumbh</span>
              <span className="text-lg font-bold text-gray-800 sm:hidden">SK</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-1 justify-center max-w-4xl">
              <Link href="/" className={location === "/" ? "text-orange-600 font-semibold border-b-2 border-orange-600 pb-1 transition-all whitespace-nowrap" : "text-gray-700 hover:text-orange-600 transition-colors font-medium hover:scale-105 whitespace-nowrap"} data-testid="nav-home">Home</Link>
              <Link href="/features" className={location === "/features" ? "text-orange-600 font-semibold border-b-2 border-orange-600 pb-1 transition-all whitespace-nowrap" : "text-gray-700 hover:text-orange-600 transition-colors font-medium hover:scale-105 whitespace-nowrap"} data-testid="nav-features">Features</Link>
              <Link href="/map" className={location === "/map" ? "text-orange-600 font-semibold border-b-2 border-orange-600 pb-1 transition-all whitespace-nowrap" : "text-gray-700 hover:text-orange-600 transition-colors font-medium hover:scale-105 whitespace-nowrap"} data-testid="nav-map">Map</Link>
              <Link href="/lost-found" className={location === "/lost-found" ? "text-orange-600 font-semibold border-b-2 border-orange-600 pb-1 transition-all whitespace-nowrap" : "text-gray-700 hover:text-orange-600 transition-colors font-medium hover:scale-105 whitespace-nowrap"} data-testid="nav-lost-found">Lost & Found</Link>
              <Link href="/spiritual" className={location === "/spiritual" ? "text-orange-600 font-semibold border-b-2 border-orange-600 pb-1 transition-all whitespace-nowrap" : "text-gray-700 hover:text-orange-600 transition-colors font-medium hover:scale-105 whitespace-nowrap"} data-testid="nav-spiritual">Spiritual</Link>
              <Link href="/attractions" className={location === "/attractions" ? "text-orange-600 font-semibold border-b-2 border-orange-600 pb-1 transition-all whitespace-nowrap" : "text-gray-700 hover:text-orange-600 transition-colors font-medium hover:scale-105 whitespace-nowrap"} data-testid="nav-attractions">Attractions</Link>
              <Link href="/contact" className={location === "/contact" ? "text-orange-600 font-semibold border-b-2 border-orange-600 pb-1 transition-all whitespace-nowrap" : "text-gray-700 hover:text-orange-600 transition-colors font-medium hover:scale-105 whitespace-nowrap"} data-testid="nav-contact">Contact</Link>
              
              {user && (
                <>
                  <div className="h-4 w-px bg-gray-300 mx-2"></div>
                  <Link href="/dashboard" className={location === "/dashboard" ? "text-orange-600 font-semibold border-b-2 border-orange-600 pb-1 transition-all whitespace-nowrap" : "text-gray-700 hover:text-orange-600 transition-colors font-medium hover:scale-105 whitespace-nowrap"} data-testid="nav-dashboard">Dashboard</Link>
                  {isAdmin && (
                    <>
                      <Link href="/admin" className={location === "/admin" ? "text-orange-600 font-semibold border-b-2 border-orange-600 pb-1 transition-all whitespace-nowrap" : "text-gray-700 hover:text-orange-600 transition-colors font-medium hover:scale-105 whitespace-nowrap"} data-testid="nav-admin">Admin</Link>
                      {location === "/admin" && (
                        <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 transition-colors flex items-center font-medium hover:scale-105 whitespace-nowrap" data-testid="back-to-user-dashboard">
                          <ArrowLeft className="h-3 w-3 mr-1" />
                          <span className="hidden xl:inline">User View</span>
                          <span className="xl:hidden">User</span>
                        </Link>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Notification Bell Icon - Only for logged in users */}
              {user && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative hover:bg-orange-50 p-2 rounded-full border border-gray-200 hover:border-orange-200 transition-all bg-white"
                    data-testid="notification-button"
                  >
                    <Bell className="h-4 w-4 text-orange-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold shadow-md">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </div>
              )}

              {/* User Controls */}
              {user ? (
                <div className="flex items-center space-x-2">
                  {/* User Info - Responsive */}
                  <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 max-w-32 truncate" data-testid="user-name">
                      {(userProfile?.name || user.email)?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  {/* Logout Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-full font-medium border border-red-200 hover:border-red-300 transition-all flex items-center"
                    data-testid="logout-button"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="ml-1 hidden md:inline text-sm">Logout</span>
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="bg-orange-600 text-white hover:bg-orange-700 px-4 md:px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all text-sm" data-testid="login-button">
                    <span className="hidden md:inline">Login/Register</span>
                    <span className="md:hidden">Login</span>
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </header>
      )}

      {/* Main Content */}
      <main className={showNavigation ? "pt-20" : ""}>
        <div className="bg-white min-h-screen">
          {children}
        </div>
      </main>

      {/* Footer for public pages */}
      {isPublicPage && (
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h3 className="font-bold text-xl mb-6 text-orange-400">Emergency Helplines</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center space-x-3 hover:text-orange-300 transition-colors">
                    <span className="text-xl">📞</span>
                    <span>Police: 100</span>
                  </div>
                  <div className="flex items-center space-x-3 hover:text-orange-300 transition-colors">
                    <span className="text-xl">🚒</span>
                    <span>Fire: 101</span>
                  </div>
                  <div className="flex items-center space-x-3 hover:text-orange-300 transition-colors">
                    <span className="text-xl">🚑</span>
                    <span>Health: 108</span>
                  </div>
                  <div className="flex items-center space-x-3 hover:text-orange-300 transition-colors">
                    <span className="text-xl">📱</span>
                    <span>SmartKumbh Help: 1800-KUMBH</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-6 text-orange-400">Policies & Information</h3>
                <div className="space-y-3 text-sm">
                  <Link href="/privacy-policy" className="block hover:text-orange-300 transition-colors">Privacy Policy</Link>
                  <Link href="/terms-of-service" className="block hover:text-orange-300 transition-colors">Terms of Service</Link>
                  <Link href="/government-guidelines" className="block hover:text-orange-300 transition-colors">Government Guidelines</Link>
                  <Link href="/accessibility-statement" className="block hover:text-orange-300 transition-colors">Accessibility Statement</Link>
                  <Link href="/data-protection" className="block hover:text-orange-300 transition-colors">Data Protection</Link>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-6 text-orange-400">Digital India Initiative</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition-colors">
                    <div className="text-orange-400 text-3xl mb-2">🏆</div>
                    <div className="text-sm font-medium">Certified</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition-colors">
                    <div className="text-green-400 text-3xl mb-2">🔒</div>
                    <div className="text-sm font-medium">Secure</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 SmartKumbh. A Digital India Initiative. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}

      {/* Notification System - Controlled by header bell */}
      {user && (
        <NotificationSystem 
          isOpen={showNotifications} 
          onOpenChange={setShowNotifications}
          onUnreadCountChange={setUnreadCount}
        />
      )}
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
