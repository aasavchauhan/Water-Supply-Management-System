import { useState, Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { StackHandler, StackProvider, StackTheme } from '@stackframe/react';
import { stackClientApp } from './stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Dashboard } from './components/Dashboard';
import { SupplyEntryForm } from './components/SupplyEntryForm';
import { FarmerManagement } from './components/FarmerManagement';
import { FarmerProfile } from './components/FarmerProfile';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { 
  LayoutDashboard, 
  Droplets, 
  Users, 
  FileText, 
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut
} from 'lucide-react';

type Page = 
  | 'dashboard' 
  | 'new-supply' 
  | 'farmers' 
  | 'farmer-profile'
  | 'reports' 
  | 'settings';

function MainApp() {
  const { user, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Droplets className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to /handler/sign-in
  if (!user) {
    window.location.href = '/handler/sign-in';
    return null;
  }

  const navigateTo = (page: Page, farmerId?: string) => {
    setCurrentPage(page);
    if (farmerId) {
      setSelectedFarmerId(farmerId);
    }
    setIsSidebarOpen(false);
  };

  const menuItems = [
    { id: 'dashboard' as Page, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'new-supply' as Page, icon: Droplets, label: 'New Supply' },
    { id: 'farmers' as Page, icon: Users, label: 'Farmers' },
    { id: 'reports' as Page, icon: FileText, label: 'Reports' },
    { id: 'settings' as Page, icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <DataProvider>
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b sticky top-0 z-50">
          <div className="flex items-center justify-between p-4">
            <h2>Water Irrigation Supply</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`
              fixed lg:sticky top-0 h-screen bg-white border-r
              w-64 z-40 transition-transform duration-200
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="p-6 border-b hidden lg:block">
              <h2>Water Irrigation Supply</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Management System
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {user.fullName}
              </p>
            </div>

            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-muted/50">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Version 2.0.0
              </p>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {currentPage === 'dashboard' && (
                <Dashboard
                  onNewSupply={() => navigateTo('new-supply')}
                  onViewFarmers={() => navigateTo('farmers')}
                />
              )}

              {currentPage === 'new-supply' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1>Water Supply Entry</h1>
                      <p className="text-muted-foreground">
                        Record a new water supply session
                      </p>
                    </div>
                  </div>
                  <SupplyEntryForm onSuccess={() => navigateTo('dashboard')} />
                </div>
              )}

              {currentPage === 'farmers' && (
                <FarmerManagement
                  onViewProfile={(id) => navigateTo('farmer-profile', id)}
                />
              )}

              {currentPage === 'farmer-profile' && selectedFarmerId && (
                <FarmerProfile
                  farmerId={selectedFarmerId}
                  onBack={() => navigateTo('farmers')}
                />
              )}

              {currentPage === 'reports' && <Reports />}

              {currentPage === 'settings' && <Settings />}
            </div>
          </main>
        </div>

        <Toaster />
      </div>
    </DataProvider>
  );
}

function HandlerRoutes() {
  const location = useLocation();
  return (
    <StackHandler app={stackClientApp} location={location.pathname} fullPage />
  );
}

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">
      <Droplets className="h-12 w-12 text-primary animate-pulse" />
    </div>}>
      <BrowserRouter>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <AuthProvider>
              <Routes>
                <Route path="/handler/*" element={<HandlerRoutes />} />
                <Route path="/*" element={<MainApp />} />
              </Routes>
            </AuthProvider>
          </StackTheme>
        </StackProvider>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;