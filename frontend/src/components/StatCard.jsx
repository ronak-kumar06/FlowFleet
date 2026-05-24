import { cn } from '../utils/cn';

const StatCard = ({ title, value, icon: Icon, description, trend, className }) => {
  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md hover:border-slate-200", className)}>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        {description && (
          <p className="text-xs text-slate-400 mt-2 flex items-center">
            {trend === 'up' && <span className="text-emerald-500 mr-1">↑</span>}
            {trend === 'down' && <span className="text-red-500 mr-1">↓</span>}
            {description}
          </p>
        )}
      </div>
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", 
        title.toLowerCase().includes('delayed') ? 'bg-red-50 text-red-500' :
        title.toLowerCase().includes('pending') ? 'bg-amber-50 text-amber-500' :
        'bg-brand-50 text-brand-500'
      )}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatCard;
