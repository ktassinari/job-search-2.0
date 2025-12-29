import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, updateJob } from '../services/api';
import Loading from '../components/Loading';
import ScoreBadge from '../components/ScoreBadge';
import CompanyAvatar from '../components/CompanyAvatar';
import Button from '../components/Button';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Heart,
  Star,
  FileText,
  Sparkles,
  Briefcase,
  Users,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJob();
  }, [id]);

  async function loadJob() {
    try {
      setLoading(true);
      const response = await getJob(id);
      if (response.success) {
        setJob(response.data);
      } else {
        setError('Job not found');
      }
    } catch (err) {
      console.error('Error loading job:', err);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(status) {
    try {
      await updateJob(job.id, { status });
      setJob({ ...job, status });
    } catch (err) {
      console.error('Error updating job:', err);
    }
  }

  async function handleFavorite() {
    try {
      const newFavorited = !job.favorited;
      await updateJob(job.id, { favorited: newFavorited });
      setJob({ ...job, favorited: newFavorited });
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  }

  function handleGenerateMaterials() {
    navigate(`/materials?jobId=${job.id}`);
  }

  function handleApply() {
    if (job.url) {
      window.open(job.url, '_blank');
    }
  }

  if (loading) {
    return <Loading message="Loading job details..." />;
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{error || 'Job not found'}</h2>
          <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  const statusColors = {
    reviewing: 'bg-info/20 text-info border-info/30',
    materials_ready: 'bg-warning/20 text-warning border-warning/30',
    applied: 'bg-success/20 text-success border-success/30',
    interviewing: 'bg-primary/20 text-primary border-primary/30',
    rejected: 'bg-error/20 text-error border-error/30',
    archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  const tier = job.score >= 9 ? '1' : job.score >= 7 ? '2' : '3';

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center space-x-2 text-dark-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Jobs</span>
        </button>

        {/* Header Card */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
          {/* Top Row: Score, Status, Avatar */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <ScoreBadge score={job.score} size="lg" />
              {job.score > 0 && (
                <div className="px-4 py-1 bg-warning rounded-full">
                  <span className="text-sm font-bold text-dark-bg">
                    Tier {tier}
                  </span>
                </div>
              )}
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${statusColors[job.status] || statusColors.reviewing}`}>
                {job.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <CompanyAvatar company={job.company} size="lg" />
          </div>

          {/* Job Title & Company */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">
              {job.title}
            </h1>
            <p className="text-2xl text-primary">{job.company}</p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {job.location && (
              <div className="flex items-center text-dark-text-secondary">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{job.location}</span>
              </div>
            )}
            {job.remote && (
              <span className="px-3 py-1 bg-info/20 text-info rounded-full text-sm font-medium border border-info/30">
                Remote
              </span>
            )}
            {job.salary_range && (
              <div className="flex items-center text-dark-text-secondary">
                <DollarSign className="w-5 h-5 mr-1" />
                <span className="text-white font-semibold">{job.salary_range}</span>
              </div>
            )}
            {job.posted_date && (
              <div className="flex items-center text-dark-text-secondary">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleApply}
              disabled={!job.url}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Apply Now</span>
            </Button>

            {job.score >= 7 && (
              <Button
                onClick={handleGenerateMaterials}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Materials</span>
              </Button>
            )}

            <button
              onClick={handleFavorite}
              className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                job.favorited
                  ? 'border-error bg-error/10 text-error'
                  : 'border-dark-border hover:border-error/50 text-dark-text-secondary hover:text-error'
              }`}
            >
              <Heart className={`w-4 h-4 ${job.favorited ? 'fill-current' : ''}`} />
              <span>{job.favorited ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              onClick={() => handleStatusUpdate('archived')}
              className="px-4 py-2 rounded-lg border-2 border-dark-border hover:border-gray-500/50 text-dark-text-secondary hover:text-white transition-all duration-200 flex items-center space-x-2"
            >
              <XCircle className="w-4 h-4" />
              <span>Archive</span>
            </button>
          </div>
        </div>

        {/* Skills/Keywords */}
        {job.keywords && job.keywords.length > 0 && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-primary" />
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-dark-surface text-dark-text rounded-full text-sm border border-dark-border"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Analysis */}
        {job.ai_reason && (
          <div className="bg-dark-card border border-primary/30 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-white">AI Analysis</h2>
            </div>
            <div className="bg-primary/10 rounded-xl p-4">
              <p className="text-dark-text leading-relaxed">
                {job.ai_reason}
              </p>
            </div>
          </div>
        )}

        {/* Job Description */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-primary" />
            Job Description
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-dark-text-secondary leading-relaxed whitespace-pre-wrap">
              {job.description || 'No description available.'}
            </p>
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-primary" />
              Requirements
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-dark-text-secondary leading-relaxed whitespace-pre-wrap">
                {job.requirements}
              </p>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Additional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {job.source && (
              <div>
                <span className="text-dark-text-secondary">Source:</span>
                <span className="text-white ml-2 font-medium">{job.source}</span>
              </div>
            )}
            {job.scraped_date && (
              <div>
                <span className="text-dark-text-secondary">Scraped:</span>
                <span className="text-white ml-2 font-medium">
                  {new Date(job.scraped_date).toLocaleDateString()}
                </span>
              </div>
            )}
            {job.url && (
              <div className="md:col-span-2">
                <span className="text-dark-text-secondary">URL:</span>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary ml-2 hover:underline break-all"
                >
                  {job.url}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Status Update Buttons */}
        {job.status !== 'applied' && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Update Status</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleStatusUpdate('materials_ready')}
                variant="secondary"
                disabled={job.status === 'materials_ready'}
              >
                Materials Ready
              </Button>
              <Button
                onClick={() => handleStatusUpdate('applied')}
                variant="secondary"
                disabled={job.status === 'applied'}
              >
                Mark Applied
              </Button>
              <Button
                onClick={() => handleStatusUpdate('interviewing')}
                variant="secondary"
                disabled={job.status === 'interviewing'}
              >
                Interviewing
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
