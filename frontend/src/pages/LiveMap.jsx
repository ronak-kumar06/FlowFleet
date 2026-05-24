import { useState, useEffect } from 'react';
import api from '../services/api';
import { socket } from '../services/socket';
import Map from '../components/Map';
import { useAuthStore } from '../store/useAuthStore';

const LiveMap = () => {
  const [trucks, setTrucks] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchTrucks();

    // Listen for live location updates
    socket.on('locationChanged', (updatedTruck) => {
      setTrucks((prev) => 
        prev.map(t => t._id === updatedTruck._id ? updatedTruck : t)
      );
    });

    return () => {
      socket.off('locationChanged');
    };
  }, []);

  const fetchTrucks = async () => {
    try {
      const { data } = await api.get('/trucks');
      setTrucks(data);
    } catch (error) {
      console.error("Failed to fetch trucks for map", error);
    }
  };

  // Convert trucks to map markers
  const markers = trucks
    .filter(t => t.currentLocation?.lat && t.currentLocation?.lng)
    .map(t => ({
      id: t._id,
      lat: t.currentLocation.lat,
      lng: t.currentLocation.lng,
      title: t.registrationNumber,
      description: `Status: ${t.status} | Capacity: ${t.capacity}t`,
      color: t.status === 'In Transit' ? 'blue' : t.status === 'Available' ? 'emerald' : 'amber'
    }));

  if (user?.role === 'Client') {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Live Map Access Restricted</h2>
        <p className="text-slate-500">Only dispatchers and administrators have access to the full fleet live map.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Live Fleet Map</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time GPS tracking of your operational vehicles.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center text-xs text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Available
          </div>
          <div className="flex items-center text-xs text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> In Transit
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[500px]">
        <Map markers={markers} />
      </div>
    </div>
  );
};

export default LiveMap;
