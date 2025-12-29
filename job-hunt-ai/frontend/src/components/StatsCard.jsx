import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-blue-400',
  iconBg = 'bg-blue-500/10',
  change,
  changeLabel = 'vs last week'
}) {
  const isPositive = change >= 0;

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${iconBg} rounded-xl`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <div>
        <p className="text-dark-text-secondary text-sm mb-2">{label}</p>
        <p className="text-4xl font-bold text-white mb-2">{value}</p>
        {change !== undefined && (
          <div className="flex items-center text-sm">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-success mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-error mr-1" />
            )}
            <span className={isPositive ? 'text-success' : 'text-error'}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-dark-text-secondary ml-1">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
