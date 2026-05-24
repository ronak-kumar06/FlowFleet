import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';

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
          <Route path="shipments" element={<div className="p-4">Shipments (Coming in Phase 5)</div>} />
          <Route path="requests" element={<div className="p-4">Requests (Coming in Phase 5)</div>} />
          <Route path="trucks" element={<div className="p-4">Trucks (Coming in Phase 5)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
