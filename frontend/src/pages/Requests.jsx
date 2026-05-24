import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Search, Check, X, Clock } from 'lucide-react';
import { cn } from '../utils/cn';

const Requests = () => {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newRequest, setNewRequest] = useState({
    origin: { address: '', lat: 0, lng: 0 },
    destination: { address: '', lat: 0, lng: 0 },
    weight: ''
  });

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      if (user?.role === 'Client') {
        const { data } = await api.get('/shipments');
        setRequests(data.requests || []);
      } else {
        const { data } = await api.get('/shipments/request');
        setRequests(data);
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/shipments/request', {
        origin: { address: newRequest.origin.address, lat: 18.52, lng: 73.85 }, // Mocked lat/lng for now
        destination: { address: newRequest.destination.address, lat: 19.07, lng: 72.87 },
        weight: Number(newRequest.weight)
      });
      setShowAddModal(false);
      fetchRequests();
    } catch (error) {
      console.error("Failed to create request", error);
    }
  };

  const handleReview = async (id, status, priority) => {
    try {
      await api.put(`/shipments/request/${id}/review`, { status, priority });
      fetchRequests();
    } catch (error) {
      console.error("Failed to review request", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Delivery Requests</h1>
          <p className="text-slate-500 text-sm mt-1">Manage incoming shipment requests.</p>
        </div>
        {user?.role === 'Client' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search requests..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4">Origin</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Weight (Tons)</th>
                <th className="p-4">Status</th>
                {user?.role === 'Dispatcher' && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading requests...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No requests found.</td></tr>
              ) : (
                requests.map(req => (
                  <tr key={req._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{req.origin.address}</td>
                    <td className="p-4 text-slate-600">{req.destination.address}</td>
                    <td className="p-4 text-slate-600">{req.weight}t</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border flex w-fit items-center",
                        req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      )}>
                        {req.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                        {req.status}
                      </span>
                    </td>
                    {user?.role === 'Dispatcher' && (
                      <td className="p-4 text-right space-x-2">
                        {req.status === 'Pending' && (
                          <>
                            <button onClick={() => handleReview(req._id, 'Approved', 'Medium')} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleReview(req._id, 'Rejected', 'Unassigned')} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">New Delivery Request</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAddRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Address</label>
                <input 
                  type="text" required
                  value={newRequest.origin.address}
                  onChange={e => setNewRequest({...newRequest, origin: {...newRequest.origin, address: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Destination Address</label>
                <input 
                  type="text" required
                  value={newRequest.destination.address}
                  onChange={e => setNewRequest({...newRequest, destination: {...newRequest.destination, address: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Weight (Tons)</label>
                <input 
                  type="number" required min="0.1" step="0.1"
                  value={newRequest.weight}
                  onChange={e => setNewRequest({...newRequest, weight: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors shadow-sm">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
