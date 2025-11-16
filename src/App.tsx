import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { DataProvider } from '@/context/DataContext'
import Dashboard from '@/components/Dashboard'
import SupplyEntryForm from '@/components/SupplyEntryForm'
import FarmerManagement from '@/components/FarmerManagement'
import FarmerProfile from '@/components/FarmerProfile'
import Reports from '@/components/Reports'
import Settings from '@/components/Settings'
import { 
  LayoutDashboard, 
  Droplets, 
  Users, 
  FileText, 
  Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Navigation() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/supply', icon: Droplets, label: 'New Supply' },
    { path: '/farmers', icon: Users, label: 'Farmers' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ]

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Water Supply</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="container px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-screen w-64 flex-col border-r bg-background">
        <div className="flex h-14 items-center border-b px-6">
          <Link to="/" className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Water Supply</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-accent hover:scale-[1.01]"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground text-center">
            Version 2.0.0
          </p>
        </div>
      </aside>
    </>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="lg:ml-64 min-h-screen">
        <div className="container py-6 px-4 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/supply" element={<SupplyEntryForm />} />
            <Route path="/farmers" element={<FarmerManagement />} />
            <Route path="/farmers/:id" element={<FarmerProfile />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </DataProvider>
  )
}

export default App
