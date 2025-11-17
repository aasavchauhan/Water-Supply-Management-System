import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Droplets, Users, FileText, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import SupplyEntryForm from './components/SupplyEntryForm';
import FarmerManagement from './components/FarmerManagement';
import FarmerProfile from './components/FarmerProfile';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { Toaster } from './components/ui/toaster';
import { cn } from './lib/utils';

function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/supply', label: 'New Supply', icon: Droplets },
    { path: '/farmers', label: 'Farmers', icon: Users },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b-2 border-primary/10 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-br from-primary to-blue-600 p-2 rounded-xl shadow-lg">
                <Droplets className="h-8 w-8 text-white" />
              </div>
              <div className="ml-3 hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Water Supply
                </span>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2 items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-105"
                  )}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/supply" element={<SupplyEntryForm />} />
            <Route path="/farmers" element={<FarmerManagement />} />
            <Route path="/farmers/:id" element={<FarmerProfile />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
