import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
      <p className="text-slate-500 text-center max-w-md mb-8">
        You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors"
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default Unauthorized;
