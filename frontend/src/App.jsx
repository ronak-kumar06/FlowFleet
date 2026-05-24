import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';

import Trucks from './pages/Trucks';
import Shipments from './pages/Shipments';
import Requests from './pages/Requests';
import LiveMap from './pages/LiveMap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="shipments" element={<Shipments />} />
          <Route path="requests" element={<Requests />} />
          <Route path="trucks" element={<Trucks />} />
          <Route path="map" element={<LiveMap />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
