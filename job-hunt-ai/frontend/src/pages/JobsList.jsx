import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Loading from '../components/Loading';
import { Search, Filter, MapPin, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function JobsList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    minScore: '',
    sortBy: 'created_at',
    order: 'DESC'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [filters]);

  async function loadJobs() {
    setLoading(true);
    try {
      const response = await getJobs(filters);
      setJobs(response.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  function updateFilter(key, value) {
    setFilters({ ...filters, [key]: value });
  }

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'materials_ready', label: 'Materials Ready' },
    { value: 'applied', label: 'Applied' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'archived', label: 'Archived' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Job Listings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Browse and manage your job opportunities
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 mb-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or description..."
              className="input pl-10"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-dark-border">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  className="input"
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Score
                </label>
                <select
                  className="input"
                  value={filters.minScore}
                  onChange={(e) => updateFilter('minScore', e.target.value)}
                >
                  <option value="">All Scores</option>
                  <option value="9">9+ (Excellent)</option>
                  <option value="7">7+ (Good)</option>
                  <option value="5">5+ (Worth Considering)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  className="input"
                  value={`${filters.sortBy}-${filters.order}`}
                  onChange={(e) => {
                    const [sortBy, order] = e.target.value.split('-');
                    setFilters({ ...filters, sortBy, order });
                  }}
                >
                  <option value="created_at-DESC">Newest First</option>
                  <option value="created_at-ASC">Oldest First</option>
                  <option value="score-DESC">Highest Score</option>
                  <option value="score-ASC">Lowest Score</option>
                  <option value="company-ASC">Company A-Z</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {loading ? 'Loading...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found`}
      </div>

      {/* Jobs Table */}
      {loading ? (
        <Loading />
      ) : jobs.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No jobs found matching your filters.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <Badge score={job.score}>
                      {job.score}/10
                    </Badge>
                    {job.remote && (
                      <Badge variant="blue">Remote</Badge>
                    )}
                  </div>

                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                    {job.company}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    {job.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                    )}
                    <span>
                      Added {format(new Date(job.created_at), 'MMM d, yyyy')}
                    </span>
                    <Badge variant="gray">{job.status}</Badge>
                  </div>

                  {job.ai_reason && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {job.ai_reason}
                    </p>
                  )}
                </div>

                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-4 p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
