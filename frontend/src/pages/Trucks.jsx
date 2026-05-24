import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Search, MapPin } from 'lucide-react';
import { cn } from '../utils/cn';

const Trucks = () => {
  const { user } = useAuthStore();
  const [trucks, setTrucks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New truck form
  const [newTruck, setNewTruck] = useState({
    registrationNumber: '',
    capacity: '',
    fuelEfficiency: '',
  });

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      const { data } = await api.get('/trucks');
      setTrucks(data);
    } catch (error) {
      console.error("Failed to fetch trucks", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTruck = async (e) => {
    e.preventDefault();
    try {
      await api.post('/trucks', newTruck);
      setShowAddModal(false);
      setNewTruck({ registrationNumber: '', capacity: '', fuelEfficiency: '' });
      fetchTrucks();
    } catch (error) {
      console.error("Failed to add truck", error);
      alert("Failed to add truck. Registration number might already exist.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fleet Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your operational vehicles.</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'Dispatcher') && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Truck
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search trucks by registration..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4">Registration No.</th>
                <th className="p-4">Status</th>
                <th className="p-4">Capacity (Tons)</th>
                <th className="p-4">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">Loading trucks...</td></tr>
              ) : trucks.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No trucks found in the fleet.</td></tr>
              ) : (
                trucks.map(truck => (
                  <tr key={truck._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{truck.registrationNumber}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border",
                        truck.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        truck.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      )}>
                        {truck.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{truck.capacity}t</td>
                    <td className="p-4">
                      {truck.currentLocation?.lat ? (
                        <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-brand-500 mr-1" />
                          Lat: {truck.currentLocation.lat.toFixed(2)}, Lng: {truck.currentLocation.lng.toFixed(2)}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">Unknown</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Truck Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Add New Truck</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAddTruck} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                <input 
                  type="text" required
                  value={newTruck.registrationNumber}
                  onChange={e => setNewTruck({...newTruck, registrationNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                  placeholder="e.g. MH-12-AB-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Capacity (Tons)</label>
                <input 
                  type="number" required min="1" step="0.1"
                  value={newTruck.capacity}
                  onChange={e => setNewTruck({...newTruck, capacity: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fuel Efficiency (km/l)</label>
                <input 
                  type="number" step="0.1"
                  value={newTruck.fuelEfficiency}
                  onChange={e => setNewTruck({...newTruck, fuelEfficiency: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors shadow-sm">Save Truck</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trucks;
