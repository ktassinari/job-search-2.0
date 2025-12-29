import { useState, useEffect } from 'react';
import { getAnalytics } from '../services/api';
import Loading from '../components/Loading';
import StatsCard from '../components/StatsCard';
import CompanyAvatar from '../components/CompanyAvatar';
import { Send, Eye, Calendar, Clock, Download } from 'lucide-react';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('last30');

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const response = await getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading message="Loading analytics..." />;
  }

  // Mock data for chart
  const chartData = [
    { date: 'Dec 20', count: 2 },
    { date: 'Dec 21', count: 3 },
    { date: 'Dec 22', count: 1 },
    { date: 'Dec 23', count: 4 },
    { date: 'Dec 24', count: 2 },
    { date: 'Dec 25', count: 0 },
    { date: 'Dec 26', count: 6 }
  ];

  const maxCount = Math.max(...chartData.map(d => d.count));

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
            <p className="text-dark-text-secondary text-lg">
              Track your job search performance and insights
            </p>
          </div>
          <button className="px-6 py-3 bg-primary hover:bg-primary-600 rounded-xl text-white font-medium flex items-center space-x-2 transition-colors">
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Time Filter */}
        <div className="flex items-center space-x-2">
          {['Last 7 days', 'Last 30 days', 'All time'].map((label, index) => {
            const value = ['last7', 'last30', 'all'][index];
            return (
              <button
                key={value}
                onClick={() => setTimeFilter(value)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  timeFilter === value
                    ? 'bg-primary text-white'
                    : 'bg-dark-surface text-dark-text-secondary hover:text-white border border-dark-border'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            label="Applications Sent"
            value={analytics.totalApplications}
            icon={Send}
            iconColor="text-blue-400"
            iconBg="bg-blue-500/10"
            change={28}
          />
          <StatsCard
            label="Response Rate"
            value={`${analytics.responseRate}%`}
            icon={Eye}
            iconColor="text-purple-400"
            iconBg="bg-purple-500/10"
            change={28}
          />
          <StatsCard
            label="Interview Rate"
            value="17%"
            icon={Calendar}
            iconColor="text-green-400"
            iconBg="bg-green-500/10"
            change={28}
          />
          <StatsCard
            label="Avg. Time to Response"
            value="8 days"
            icon={Clock}
            iconColor="text-yellow-400"
            iconBg="bg-yellow-500/10"
            change={-2}
          />
        </div>

        {/* Application Status */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Application Status</h2>
          <div className="space-y-4">
            {[
              { label: 'Reviewing', count: 5, total: 12, color: 'bg-primary' },
              { label: 'Applied', count: 3, total: 12, color: 'bg-info' },
              { label: 'Interview', count: 2, total: 12, color: 'bg-success' },
              { label: 'Materials Ready', count: 2, total: 12, color: 'bg-warning' }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-dark-text">{item.label}</span>
                  <span className="text-dark-text-secondary text-sm">
                    {item.count} ({Math.round((item.count / item.total) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-dark-surface rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${(item.count / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications Over Time */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Applications Over Time</h2>
          <div className="flex items-end justify-between h-64 gap-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex items-end justify-center flex-1 pb-2">
                  <div
                    className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary-600"
                    style={{ height: `${(data.count / maxCount) * 100}%` }}
                  />
                </div>
                <div className="text-dark-text-secondary text-xs mt-2">{data.date}</div>
                <div className="text-white text-sm font-semibold">{data.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Top Companies</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-dark-text-secondary text-sm uppercase border-b border-dark-border">
                  <th className="text-left py-3 font-medium">Company</th>
                  <th className="text-center py-3 font-medium">Applications</th>
                  <th className="text-center py-3 font-medium">Responses</th>
                  <th className="text-center py-3 font-medium">Response Rate</th>
                  <th className="text-left py-3 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {[
                  { company: 'Disney+', apps: 5, responses: 2, rate: 40, color: 'bg-warning' },
                  { company: 'Netflix', apps: 4, responses: 1, rate: 25, color: 'bg-warning/70' },
                  { company: 'Universal Studios', apps: 3, responses: 2, rate: 67, color: 'bg-success' },
                  { company: 'Warner Bros.', apps: 2, responses: 1, rate: 50, color: 'bg-success/70' },
                  { company: 'Spotify', apps: 2, responses: 0, rate: 0, color: 'bg-gray-500' }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-dark-surface transition-colors">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <CompanyAvatar company={row.company} size="sm" />
                        <span className="text-white font-medium">{row.company}</span>
                      </div>
                    </td>
                    <td className="text-center text-white">{row.apps}</td>
                    <td className="text-center text-white">{row.responses}</td>
                    <td className="text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        row.rate >= 50 ? 'bg-success/20 text-success' :
                        row.rate >= 25 ? 'bg-warning/20 text-warning' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {row.rate}%
                      </span>
                    </td>
                    <td>
                      <div className="w-full bg-dark-surface rounded-full h-2">
                        <div
                          className={`${row.color} h-2 rounded-full`}
                          style={{ width: `${row.rate}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
