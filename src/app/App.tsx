import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
  GitBranch
} from 'lucide-react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Customers, CustomerDetails } from './components/Customers';
import { Interactions } from './components/Interactions';
import { ProcessFlow } from './components/ProcessFlow';
import {
  User,
  Customer,
  Interaction,
  mockCustomers,
  mockProducts,
  mockPurchases,
  mockInteractions
} from './data/mockData';

type View = 'dashboard' | 'customers' | 'interactions' | 'process-flow';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State management for data
  const [customers] = useState(mockCustomers);
  const [purchases] = useState(mockPurchases);
  const [products] = useState(mockProducts);
  const [interactions, setInteractions] = useState(mockInteractions);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
    setSelectedCustomer(null);
  };

  const handleAddInteraction = (interaction: Omit<Interaction, 'id'>) => {
    const newInteraction: Interaction = {
      ...interaction,
      id: `I${String(interactions.length + 1).padStart(3, '0')}`
    };
    setInteractions([...interactions, newInteraction]);
  };

  const handleViewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleBackToCustomerList = () => {
    setSelectedCustomer(null);
  };

  // If not logged in, show auth page
  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers' as View, label: 'Customers', icon: Users },
    { id: 'interactions' as View, label: 'Interactions', icon: MessageSquare },
    { id: 'process-flow' as View, label: 'Process Flow', icon: GitBranch }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-semibold text-sidebar-foreground">SME CRM</h2>
                <p className="text-xs text-sidebar-foreground/60">Intelligent System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setSelectedCustomer(null);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">{currentUser.name}</p>
                <p className="text-xs text-sidebar-foreground/60">{currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm bg-sidebar-accent text-sidebar-accent-foreground rounded-lg hover:bg-sidebar-accent/80 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-4 lg:px-8 py-4 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.role}</p>
            </div>
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          {currentView === 'dashboard' && (
            <Dashboard
              customers={customers}
              purchases={purchases}
              products={products}
              interactions={interactions}
            />
          )}

          {currentView === 'customers' && !selectedCustomer && (
            <Customers
              customers={customers}
              purchases={purchases}
              products={products}
              onViewDetails={handleViewCustomerDetails}
            />
          )}

          {currentView === 'customers' && selectedCustomer && (
            <CustomerDetails
              customer={selectedCustomer}
              purchases={purchases}
              products={products}
              customers={customers}
              interactions={interactions}
              onClose={handleBackToCustomerList}
            />
          )}

          {currentView === 'interactions' && (
            <Interactions
              customers={customers}
              interactions={interactions}
              onAddInteraction={handleAddInteraction}
            />
          )}

          {currentView === 'process-flow' && <ProcessFlow />}
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border px-4 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>Intelligent CRM System &copy; 2026 - Southern Delta University Final Year Project</p>
            <p>Designed for Nigerian SMEs - Ozoro, Delta State</p>
          </div>
        </footer>
      </div>
    </div>
  );
}