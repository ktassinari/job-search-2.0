import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics, getNewJobsCount, getFollowUps, scrapeJobs, scoreAllJobs, generateAllMaterials } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { Sparkles, TrendingUp, Target, Send, Calendar, FileText, Briefcase, ArrowRight, Search, Star, FileCheck } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [newJobsCount, setNewJobsCount] = useState(0);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({
    scraping: false,
    scoring: false,
    generating: false
  });

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

  async function handleScrape() {
    setActionLoading({ ...actionLoading, scraping: true });
    try {
      await scrapeJobs();
      await loadDashboardData();
    } catch (error) {
      console.error('Error scraping jobs:', error);
      alert('Failed to scrape jobs: ' + error.message);
    } finally {
      setActionLoading({ ...actionLoading, scraping: false });
    }
  }

  async function handleScore() {
    setActionLoading({ ...actionLoading, scoring: true });
    try {
      await scoreAllJobs();
      await loadDashboardData();
    } catch (error) {
      console.error('Error scoring jobs:', error);
      alert('Failed to score jobs: ' + error.message);
    } finally {
      setActionLoading({ ...actionLoading, scoring: false });
    }
  }

  async function handleGenerate() {
    setActionLoading({ ...actionLoading, generating: true });
    try {
      await generateAllMaterials(7);
      await loadDashboardData();
    } catch (error) {
      console.error('Error generating materials:', error);
      alert('Failed to generate materials: ' + error.message);
    } finally {
      setActionLoading({ ...actionLoading, generating: false });
    }
  }

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  // Calculate percentage changes (mock data for now)
  const percentChanges = {
    jobsScraped: 12,
    highScoring: 8,
    applications: 15,
    interviews: 50
  };

  console.log('Dashboard rendering, actionLoading:', actionLoading);

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-5xl font-bold text-white mb-3">
            Welcome back, Kat! 👋
          </h1>
          <p className="text-xl text-dark-text-secondary">
            You have {newJobsCount} high-scoring jobs waiting for review.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{border: '2px solid red', padding: '20px'}}>
          <Button
            onClick={handleScrape}
            disabled={actionLoading.scraping}
            className="bg-blue-500 hover:bg-blue-600 text-white border-0 flex items-center justify-center space-x-2 px-6 py-4"
          >
            <Search className="w-5 h-5" />
            <span>{actionLoading.scraping ? 'Scraping...' : 'Scrape Jobs'}</span>
          </Button>

          <Button
            onClick={handleScore}
            disabled={actionLoading.scoring}
            className="bg-purple-500 hover:bg-purple-600 text-white border-0 flex items-center justify-center space-x-2 px-6 py-4"
          >
            <Star className="w-5 h-5" />
            <span>{actionLoading.scoring ? 'Scoring...' : 'Score Jobs'}</span>
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={actionLoading.generating}
            className="bg-green-500 hover:bg-green-600 text-white border-0 flex items-center justify-center space-x-2 px-6 py-4"
          >
            <FileCheck className="w-5 h-5" />
            <span>{actionLoading.generating ? 'Generating...' : 'Generate Materials'}</span>
          </Button>
        </div>

        {/* New Jobs Waiting Card */}
        {newJobsCount > 0 && (
          <div className="relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    New Jobs Waiting
                  </h3>
                  <p className="text-primary-100 mt-1">
                    {newJobsCount} jobs ready to review
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/swipe')}
                className="bg-dark-bg hover:bg-dark-surface text-white border-0 flex items-center space-x-2 px-6 py-3"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Start Swiping</span>
              </Button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Jobs Scraped */}
          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <p className="text-dark-text-secondary text-sm mb-2">Jobs Scraped</p>
              <p className="text-4xl font-bold text-white mb-2">{analytics.totalJobs}</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success">{percentChanges.jobsScraped}%</span>
                <span className="text-dark-text-secondary ml-1">vs last week</span>
              </div>
            </div>
          </Card>

          {/* High-Scoring Jobs */}
          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div>
              <p className="text-dark-text-secondary text-sm mb-2">High-Scoring Jobs</p>
              <p className="text-4xl font-bold text-white mb-2">{analytics.highScoringJobs}</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success">{percentChanges.highScoring}%</span>
                <span className="text-dark-text-secondary ml-1">vs last week</span>
              </div>
            </div>
          </Card>

          {/* Applications Sent */}
          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Send className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-dark-text-secondary text-sm mb-2">Applications Sent</p>
              <p className="text-4xl font-bold text-white mb-2">{analytics.totalApplications}</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success">{percentChanges.applications}%</span>
                <span className="text-dark-text-secondary ml-1">vs last week</span>
              </div>
            </div>
          </Card>

          {/* Interviews */}
          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <Calendar className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div>
              <p className="text-dark-text-secondary text-sm mb-2">Interviews</p>
              <p className="text-4xl font-bold text-white mb-2">{analytics.interviews}</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success">{percentChanges.interviews}%</span>
                <span className="text-dark-text-secondary ml-1">vs last week</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Follow-ups Due */}
        {followUps.length > 0 && (
          <Card className="p-6 bg-dark-card border-dark-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Follow-ups Due</h2>
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
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-primary text-xl font-bold">
                        {followUp.company.substring(0, 1)}
                      </span>
                    </div>
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

        {/* Recent Activity */}
        <Card className="p-6 bg-dark-card border-dark-border">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {analytics.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.type === 'job' ? 'bg-blue-500/20' : 'bg-green-500/20'
                }`}>
                  {activity.type === 'job' ? (
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white">
                    <span className="font-semibold">{activity.name}</span>
                    {' at '}
                    <span className="text-primary">{activity.company}</span>
                  </p>
                  <p className="text-dark-text-secondary text-sm mt-1">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
