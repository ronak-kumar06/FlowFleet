import { useEffect, useState } from 'react';
import { Package, Truck, AlertTriangle, ClipboardList } from 'lucide-react';
import StatCard from '../components/StatCard';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState({
    totalShipments: 0,
    totalTrucks: 0,
    activeTrucks: 0,
    delayedShipments: 0,
    pendingRequests: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get('/analytics/dashboard');
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch metrics", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.role === 'Admin' || user?.role === 'Dispatcher') {
      fetchMetrics();
    } else {
      setIsLoading(false); // Client or Driver
    }
  }, [user]);

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-slate-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>)}
      </div>
    </div>;
  }

  // Fallback for drivers/clients who shouldn't see full analytics
  if (user?.role === 'Driver' || user?.role === 'Client') {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome, {user.name}</h2>
        <p className="text-slate-500">Please navigate to the Shipments or Requests tab to view your assigned tasks.</p>
      </div>
    );
  }

  const pieData = [
    { name: 'Active Transit', value: metrics.activeTrucks, color: '#10b981' },
    { name: 'Delayed', value: metrics.delayedShipments, color: '#ef4444' },
    { name: 'Other Status', value: Math.max(0, metrics.totalShipments - metrics.activeTrucks - metrics.delayedShipments), color: '#94a3b8' }
  ];

  // Mock weekly data for presentation
  const barData = [
    { name: 'Mon', shipments: 12 },
    { name: 'Tue', shipments: 19 },
    { name: 'Wed', shipments: 15 },
    { name: 'Thu', shipments: 22 },
    { name: 'Fri', shipments: 28 },
    { name: 'Sat', shipments: 10 },
    { name: 'Sun', shipments: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}. Here's your operations intelligence.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Shipments" 
          value={metrics.totalShipments} 
          icon={Package} 
          trend="up" 
          description="Total active DB count" 
        />
        <StatCard 
          title="Active Trucks" 
          value={metrics.activeTrucks} 
          icon={Truck} 
          trend="up" 
          description={`${metrics.totalTrucks} total in fleet`}
        />
        <StatCard 
          title="Delayed Shipments" 
          value={metrics.delayedShipments} 
          icon={AlertTriangle} 
          trend={metrics.delayedShipments > 0 ? "down" : "up"} 
          description="Needs attention"
        />
        <StatCard 
          title="Pending Requests" 
          value={metrics.pendingRequests} 
          icon={ClipboardList} 
          description="Awaiting assignment"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Weekly Volume</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="shipments" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Status Distribution</h3>
          <div className="h-72 flex flex-col items-center justify-center">
            {metrics.totalShipments > 0 || metrics.pendingRequests > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm">No data available</p>
            )}
            
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4 w-full">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center text-xs text-slate-500 font-medium">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
