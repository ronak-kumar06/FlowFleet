import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, Package, LayoutDashboard, Truck, ClipboardList } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Shipments', icon: Package, path: '/shipments' },
    { label: 'Requests', icon: ClipboardList, path: '/requests' },
    { label: 'Trucks', icon: Truck, path: '/trucks' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/50">
          <Package className="w-6 h-6 text-brand-500 mr-2" />
          <span className="text-white font-bold text-lg tracking-tight">FlowFleet</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors group"
            >
              <item.icon className="w-5 h-5 mr-3 text-slate-400 group-hover:text-brand-500 transition-colors" />
              <span className="font-medium text-sm">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center px-3 py-2.5 rounded-lg bg-slate-800/50 mb-4">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center font-bold mr-3 uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium text-slate-400"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header (Mobile) */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between">
          <div className="flex items-center">
            <Package className="w-6 h-6 text-brand-500 mr-2" />
            <span className="text-slate-900 font-bold text-lg">FlowFleet</span>
          </div>
          <button onClick={handleLogout} className="text-slate-500 hover:text-slate-900">
            <LogOut className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
