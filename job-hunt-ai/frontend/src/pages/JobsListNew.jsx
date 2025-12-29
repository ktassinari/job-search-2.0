import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../services/api';
import Loading from '../components/Loading';
import ScoreBadge from '../components/ScoreBadge';
import CompanyAvatar from '../components/CompanyAvatar';
import StatusBadge from '../components/StatusBadge';
import { Search, Filter, List, Grid } from 'lucide-react';

export default function JobsList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    minScore: '',
    sortBy: 'created_at',
    order: 'DESC',
    limit: 50,
    offset: 0
  });

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
    setFilters({ ...filters, [key]: value, offset: 0 });
  }

  const totalPages = Math.ceil(jobs.length / 12);
  const currentPage = Math.floor(filters.offset / 12) + 1;

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Jobs</h1>
          <p className="text-dark-text-secondary text-lg">
            Manage and track all your job opportunities.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or company..."
                className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>

            {/* Filters Button */}
            <button className="px-6 py-3 bg-dark-surface border border-dark-border rounded-xl text-white hover:bg-dark-border transition-colors flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>

            {/* View Toggle */}
            <div className="flex items-center bg-dark-surface border border-dark-border rounded-xl p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-dark-text-secondary hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-dark-text-secondary hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        {loading ? (
          <Loading />
        ) : jobs.length === 0 ? (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center">
            <p className="text-dark-text-secondary">
              No jobs found matching your filters.
            </p>
          </div>
        ) : (
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-dark-border text-dark-text-secondary text-sm font-medium uppercase">
              <div className="col-span-4">Job Title</div>
              <div className="col-span-2">Company</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2">Score</div>
              <div className="col-span-2">Status</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-dark-border">
              {jobs.slice(filters.offset, filters.offset + 12).map((job) => (
                <div
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-dark-surface transition-colors cursor-pointer"
                >
                  {/* Job Title */}
                  <div className="col-span-4">
                    <h3 className="text-white font-semibold mb-1">{job.title}</h3>
                  </div>

                  {/* Company */}
                  <div className="col-span-2 flex items-center space-x-3">
                    <CompanyAvatar company={job.company} size="sm" />
                    <span className="text-white">{job.company}</span>
                  </div>

                  {/* Location */}
                  <div className="col-span-2">
                    <div className="text-dark-text-secondary">{job.location || 'Remote'}</div>
                    {job.remote && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-info/20 text-info rounded text-xs border border-info/30">
                        Remote
                      </span>
                    )}
                  </div>

                  {/* Score */}
                  <div className="col-span-2 flex items-center">
                    <ScoreBadge score={job.score} size="sm" />
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <StatusBadge status={job.status} />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-dark-border flex items-center justify-between">
              <div className="text-dark-text-secondary text-sm">
                Showing {filters.offset + 1}-{Math.min(filters.offset + 12, jobs.length)} of {jobs.length}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateFilter('offset', Math.max(0, filters.offset - 12))}
                  disabled={filters.offset === 0}
                  className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-white hover:bg-dark-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => updateFilter('offset', Math.min(jobs.length - 12, filters.offset + 12))}
                  disabled={filters.offset + 12 >= jobs.length}
                  className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-white hover:bg-dark-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
