import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { getJobs, updateJob, applyToJob } from '../services/api';
import Loading from '../components/Loading';
import ScoreBadge from '../components/ScoreBadge';
import CompanyAvatar from '../components/CompanyAvatar';
import Button from '../components/Button';
import {
  X,
  Heart,
  Star,
  MapPin,
  DollarSign,
  SkipForward,
  Sparkles
} from 'lucide-react';

export default function Swipe() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const response = await getJobs({
        status: 'reviewing',
        sortBy: 'score',
        order: 'DESC',
        limit: 50
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  const currentJob = jobs[currentIndex];

  async function handleReject() {
    if (!currentJob) return;
    await updateJob(currentJob.id, { status: 'archived' });
    nextJob();
  }

  async function handleBookmark() {
    if (!currentJob) return;
    await updateJob(currentJob.id, { status: 'materials_ready' });
    nextJob();
  }

  async function handleAccept() {
    if (!currentJob) return;
    try {
      // Create application and trigger materials generation
      await applyToJob(currentJob.id);
      // Update job status to applied
      await updateJob(currentJob.id, { status: 'applied' });
      nextJob();
    } catch (error) {
      console.error('Error applying to job:', error);
      nextJob();
    }
  }

  function nextJob() {
    if (currentIndex < jobs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setJobs([]);
    }
  }

  function handleSkip() {
    nextJob();
  }

  function handleQuit() {
    navigate('/');
  }

  if (loading) {
    return <Loading message="Loading jobs..." />;
  }

  if (jobs.length === 0 || !currentJob) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            No More Jobs to Review!
          </h2>
          <p className="text-dark-text-secondary mb-6 text-lg">
            You've reviewed all available jobs. Check back later for new opportunities.
          </p>
          <Button onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / jobs.length) * 100;

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Review Jobs</h1>
            <p className="text-dark-text-secondary mt-1">
              Job {currentIndex + 1} of {jobs.length}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSkip}
              className="text-dark-text-secondary hover:text-white transition-colors flex items-center space-x-2"
            >
              <SkipForward className="w-5 h-5" />
              <span>Skip</span>
            </button>
            <button
              onClick={handleQuit}
              className="text-dark-text-secondary hover:text-white transition-colors"
            >
              Quit
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-6 mb-4">
          <button
            onClick={handleReject}
            className="w-16 h-16 rounded-full border-2 border-error flex items-center justify-center hover:bg-error/10 transition-colors"
          >
            <X className="w-8 h-8 text-error" />
          </button>

          <button
            onClick={handleBookmark}
            className="w-14 h-14 rounded-full border-2 border-info flex items-center justify-center hover:bg-info/10 transition-colors"
          >
            <Star className="w-6 h-6 text-info" />
          </button>

          <button
            onClick={handleAccept}
            className="w-16 h-16 rounded-full border-2 border-success flex items-center justify-center hover:bg-success/10 transition-colors"
          >
            <Heart className="w-8 h-8 text-success" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-dark-surface rounded-full h-2 mb-8">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Job Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentJob.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-8"
          >
            {/* Top Row: Score, Tier, Avatar */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <ScoreBadge score={currentJob.score} size="lg" />
                <div className="px-4 py-1 bg-warning rounded-full">
                  <span className="text-sm font-bold text-dark-bg">
                    Tier {currentJob.score >= 9 ? '1' : currentJob.score >= 7 ? '2' : '3'}
                  </span>
                </div>
              </div>
              <CompanyAvatar company={currentJob.company} size="lg" />
            </div>

            {/* Job Title & Company */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {currentJob.title}
              </h2>
              <p className="text-xl text-primary">{currentJob.company}</p>
            </div>

            {/* Location & Salary */}
            <div className="flex items-center space-x-6 mb-6">
              {currentJob.location && (
                <div className="flex items-center text-dark-text-secondary">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{currentJob.location}</span>
                </div>
              )}
              {currentJob.remote && (
                <span className="px-3 py-1 bg-info/20 text-info rounded-full text-sm font-medium border border-info/30">
                  Remote
                </span>
              )}
              {currentJob.salary_range && (
                <div className="flex items-center text-dark-text-secondary">
                  <DollarSign className="w-5 h-5 mr-1" />
                  <span className="text-white font-semibold">{currentJob.salary_range}</span>
                </div>
              )}
            </div>

            {/* Skills Tags */}
            {currentJob.keywords && currentJob.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentJob.keywords.slice(0, 6).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-dark-surface text-dark-text rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            {/* Job Description */}
            <div className="mb-6">
              <p className="text-dark-text-secondary leading-relaxed">
                {currentJob.description
                  ? currentJob.description.substring(0, 500) + (currentJob.description.length > 500 ? '...' : '')
                  : 'No description available.'}
              </p>
            </div>

            {/* AI Analysis */}
            {currentJob.ai_reason && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-primary font-semibold">AI Analysis</h3>
                </div>
                <p className="text-dark-text-secondary text-sm leading-relaxed">
                  {currentJob.ai_reason}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
