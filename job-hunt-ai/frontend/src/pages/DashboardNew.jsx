import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics, getNewJobsCount, getFollowUps } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import CompanyAvatar from '../components/CompanyAvatar';
import {
  Sparkles, TrendingUp, Target, Send, Calendar, FileText, Briefcase,
  ArrowRight, Eye, Clock, Download
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [newJobsCount, setNewJobsCount] = useState(0);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [analyticsData, newJobs, followUpsData] = await Promise.all([
        getAnalytics(),
        getNewJobsCount(),
        getFollowUps()
      ]);

      setAnalytics(analyticsData.data);
      setNewJobsCount(newJobs.data.count);
      setFollowUps(followUpsData.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  // Mock chart data
  const chartData = [
    { date: 'Dec 22', count: 1 },
    { date: 'Dec 23', count: 4 },
    { date: 'Dec 24', count: 2 },
    { date: 'Dec 25', count: 0 },
    { date: 'Dec 26', count: 6 },
    { date: 'Dec 27', count: 3 },
    { date: 'Today', count: 2 }
  ];
  const maxCount = Math.max(...chartData.map(d => d.count));

  // Calculate percentage changes (mock data)
  const percentChanges = {
    jobsScraped: 12,
    highScoring: 8,
    applications: 15,
    interviews: 50
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, Kat! 👋
            </h1>
            <p className="text-lg text-dark-text-secondary">
              You have {newJobsCount} jobs waiting for review.
            </p>
          </div>
          <button className="px-5 py-2.5 bg-dark-card hover:bg-dark-surface border border-dark-border rounded-xl text-dark-text-secondary hover:text-white font-medium flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>

        {/* New Jobs Waiting Card */}
        {newJobsCount > 0 && (
          <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-600 rounded-2xl p-6">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    New Jobs Waiting
                  </h3>
                  <p className="text-white/80 mt-1">
                    {newJobsCount} high-scoring jobs ready to review
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/swipe')}
                className="bg-white hover:bg-gray-100 text-primary border-0 flex items-center space-x-2 px-6 py-3"
              >
                <span>Start Swiping</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <p className="text-dark-text-secondary text-sm mb-2">Jobs Scraped</p>
              <p className="text-3xl font-bold text-white mb-2">{analytics.totalJobs}</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success">{percentChanges.jobsScraped}%</span>
                <span className="text-dark-text-secondary ml-1">vs last week</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div>
              <p className="text-dark-text-secondary text-sm mb-2">High-Scoring Jobs</p>
              <p className="text-3xl font-bold text-white mb-2">{analytics.highScoringJobs}</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success">{percentChanges.highScoring}%</span>
                <span className="text-dark-text-secondary ml-1">vs last week</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Send className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-dark-text-secondary text-sm mb-2">Applications Sent</p>
              <p className="text-3xl font-bold text-white mb-2">{analytics.totalApplications}</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success">{percentChanges.applications}%</span>
                <span className="text-dark-text-secondary ml-1">vs last week</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <Calendar className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div>
              <p className="text-dark-text-secondary text-sm mb-2">Interviews</p>
              <p className="text-3xl font-bold text-white mb-2">{analytics.interviews}</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success">{percentChanges.interviews}%</span>
                <span className="text-dark-text-secondary ml-1">vs last week</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Analytics Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-success text-sm font-medium">+28%</span>
            </div>
            <p className="text-dark-text-secondary text-sm mb-1">Response Rate</p>
            <p className="text-2xl font-bold text-white">{analytics.responseRate}%</p>
          </Card>

          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-success text-sm font-medium">+28%</span>
            </div>
            <p className="text-dark-text-secondary text-sm mb-1">Interview Rate</p>
            <p className="text-2xl font-bold text-white">17%</p>
          </Card>

          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-error text-sm font-medium">-2 days</span>
            </div>
            <p className="text-dark-text-secondary text-sm mb-1">Avg. Time to Response</p>
            <p className="text-2xl font-bold text-white">8 days</p>
          </Card>
        </div>

        {/* Two Column Layout for Charts and Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications Over Time */}
          <Card className="p-6 bg-dark-card border-dark-border">
            <h2 className="text-xl font-bold text-white mb-6">Applications Over Time</h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center flex-1 pb-2">
                    <div
                      className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary-600 cursor-pointer"
                      style={{ height: `${(data.count / maxCount) * 100}%` }}
                      title={`${data.count} applications`}
                    />
                  </div>
                  <div className="text-dark-text-secondary text-xs mt-2">{data.date}</div>
                  <div className="text-white text-sm font-semibold">{data.count}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Application Status */}
          <Card className="p-6 bg-dark-card border-dark-border">
            <h2 className="text-xl font-bold text-white mb-6">Application Status</h2>
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
                      className={`${item.color} h-2 rounded-full transition-all`}
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Companies */}
        <Card className="p-6 bg-dark-card border-dark-border">
          <h2 className="text-xl font-bold text-white mb-6">Top Companies</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-dark-text-secondary text-xs uppercase border-b border-dark-border">
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
        </Card>

        {/* Follow-ups Due */}
        {followUps.length > 0 && (
          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Follow-ups Due</h2>
              <span className="px-3 py-1 bg-warning/20 text-warning rounded-full text-sm font-medium">
                {followUps.length}
              </span>
            </div>
            <div className="space-y-3">
              {followUps.map((followUp) => (
                <div
                  key={followUp.id}
                  className="flex items-center justify-between p-4 bg-dark-surface rounded-xl hover:bg-dark-border transition-colors cursor-pointer"
                  onClick={() => navigate('/applications')}
                >
                  <div className="flex items-center space-x-4">
                    <CompanyAvatar company={followUp.company} size="md" />
                    <div>
                      <h3 className="text-white font-semibold">{followUp.title}</h3>
                      <p className="text-dark-text-secondary text-sm">{followUp.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-warning/20 text-warning rounded-full text-sm font-medium">
                      {followUp.follow_up_date === new Date().toISOString().split('T')[0]
                        ? 'Tomorrow'
                        : followUp.follow_up_date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
