import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics, getNewJobsCount, getFollowUps } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { Briefcase, Star, Send, Calendar, TrendingUp } from 'lucide-react';

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

  const stats = [
    {
      label: 'Total Jobs',
      value: analytics.totalJobs,
      icon: Briefcase,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      label: 'High-Scoring',
      value: analytics.highScoringJobs,
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      label: 'Applications',
      value: analytics.totalApplications,
      icon: Send,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      label: 'Interviews',
      value: analytics.interviews,
      icon: Calendar,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome back, Kat!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Let's find your dream job in themed entertainment.
        </p>
      </div>

      {/* New Jobs Banner */}
      {newJobsCount > 0 && (
        <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {newJobsCount} New Job{newJobsCount !== 1 ? 's' : ''} Available!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fresh opportunities waiting for you to review
                </p>
              </div>
            </div>
            <Button onClick={() => navigate('/swipe')}>
              Start Swiping
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/swipe')}
          >
            Swipe Jobs
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/jobs')}
          >
            View All Jobs
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/materials')}
          >
            Review Materials
          </Button>
        </div>
      </Card>

      {/* Follow-ups Due */}
      {followUps.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Follow-ups Due Today
          </h2>
          <div className="space-y-3">
            {followUps.map((followUp) => (
              <div
                key={followUp.id}
                className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {followUp.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {followUp.company} • Applied {followUp.date_applied}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate(`/applications`)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Response Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Application Stats
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Response Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {analytics.responseRate}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Offers</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {analytics.offers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Rejected</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {analytics.rejected}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Jobs by Source
          </h2>
          <div className="space-y-3">
            {analytics.jobsBySource.map((source) => (
              <div key={source.source} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {source.source}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {source.count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
