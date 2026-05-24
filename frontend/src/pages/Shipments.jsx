import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Search, MapPin, Truck as TruckIcon, User, Package } from 'lucide-react';
import { cn } from '../utils/cn';

const Shipments = () => {
  const { user } = useAuthStore();
  const [shipments, setShipments] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]); // In a real app, fetch drivers
  const [isLoading, setIsLoading] = useState(true);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [assignForm, setAssignForm] = useState({ truckId: '', driverId: '' });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/shipments');
      setShipments(data.shipments || data);
      
      if (user?.role === 'Dispatcher' || user?.role === 'Admin') {
        const truckRes = await api.get('/trucks');
        setTrucks(truckRes.data.filter(t => t.status === 'Available'));
        const driverRes = await api.get('/auth/drivers');
        setDrivers(driverRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch shipments", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/shipments/${selectedShipment._id}/assign`, assignForm);
      setShowAssignModal(false);
      fetchData();
    } catch (error) {
      console.error("Failed to assign truck/driver", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/shipments/${id}/status`, { status });
      fetchData();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Shipments</h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage assigned deliveries.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by tracking ID..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4">Tracking ID</th>
                <th className="p-4">Route</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assignment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading shipments...</td></tr>
              ) : shipments.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No active shipments found.</td></tr>
              ) : (
                shipments.map(ship => (
                  <tr key={ship._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800 flex items-center">
                      <Package className="w-4 h-4 mr-2 text-brand-500" />
                      {ship.trackingId}
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-800">{ship.requestId?.origin?.address || 'Unknown Origin'}</div>
                      <div className="text-xs text-slate-500 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        To: {ship.requestId?.destination?.address || 'Unknown Destination'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border",
                        ship.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        ship.status === 'Delayed' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      )}>
                        {ship.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {ship.assignedTruck ? (
                        <div className="text-xs text-slate-600 space-y-1">
                          <div className="flex items-center"><TruckIcon className="w-3 h-3 mr-1"/> {ship.assignedTruck.registrationNumber || 'Assigned'}</div>
                          <div className="flex items-center"><User className="w-3 h-3 mr-1"/> {ship.assignedDriver?.name || 'Assigned'}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {user?.role === 'Dispatcher' && ship.status !== 'Delivered' && !ship.assignedTruck && (
                        <button 
                          onClick={() => { setSelectedShipment(ship); setShowAssignModal(true); }}
                          className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
                        >
                          Assign
                        </button>
                      )}
                      {user?.role === 'Driver' && ship.status === 'Assigned' && (
                        <button 
                          onClick={() => updateStatus(ship._id, 'In Transit')}
                          className="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors"
                        >
                          Start Journey
                        </button>
                      )}
                      {user?.role === 'Driver' && ship.status === 'In Transit' && (
                        <div className="space-x-2">
                          <button onClick={() => updateStatus(ship._id, 'Delivered')} className="px-3 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Mark Delivered</button>
                          <button onClick={() => updateStatus(ship._id, 'Delayed')} className="px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded-md hover:bg-red-600">Report Delay</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedShipment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Assign Truck & Driver</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAssign} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Available Truck</label>
                <select 
                  required
                  value={assignForm.truckId}
                  onChange={e => setAssignForm({...assignForm, truckId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                >
                  <option value="">-- Choose Truck --</option>
                  {trucks.map(t => <option key={t._id} value={t._id}>{t.registrationNumber} ({t.capacity}t)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Driver</label>
                <select 
                  required
                  value={assignForm.driverId}
                  onChange={e => setAssignForm({...assignForm, driverId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                >
                  <option value="">-- Choose Driver --</option>
                  {drivers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-2 mt-2">
                <div className="text-blue-500 mt-0.5">✨</div>
                <div>
                  <p className="text-xs font-medium text-blue-800">Smart Allocation Hint</p>
                  <p className="text-xs text-blue-600 mt-0.5">The system recommends {trucks[0]?.registrationNumber || 'the first available truck'} based on {selectedShipment.requestId?.weight || 0}t weight.</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors shadow-sm">Confirm Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipments;
