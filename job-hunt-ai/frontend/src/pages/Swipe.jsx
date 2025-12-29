import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { getJobs, updateJob } from '../services/api';
import Loading from '../components/Loading';
import Badge from '../components/Badge';
import Button from '../components/Button';
import {
  MapPin,
  DollarSign,
  X,
  Check,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Swipe() {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

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

  async function handlePass() {
    if (!currentJob) return;

    await updateJob(currentJob.id, { status: 'archived' });

    if (currentIndex < jobs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setJobs([]);
    }
  }

  async function handleKeep() {
    if (!currentJob) return;

    await updateJob(currentJob.id, { status: 'materials_ready' });

    if (currentIndex < jobs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setJobs([]);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'ArrowLeft') handlePass();
    else if (e.key === 'ArrowRight') handleKeep();
    else if (e.key === 'ArrowUp') setShowDetails(!showDetails);
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentJob, showDetails]);

  if (loading) {
    return <Loading message="Loading jobs..." />;
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No More Jobs to Review!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You've reviewed all available jobs. Check back later for new opportunities.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-dark-bg">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Job {currentIndex + 1} of {jobs.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(((currentIndex + 1) / jobs.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-dark-surface rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / jobs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Job Card */}
      <SwipeCard
        job={currentJob}
        onPass={handlePass}
        onKeep={handleKeep}
        showDetails={showDetails}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4 mt-8">
        <Button
          variant="secondary"
          size="lg"
          className="w-16 h-16 rounded-full p-0 flex items-center justify-center"
          onClick={handlePass}
        >
          <X className="w-6 h-6 text-red-500" />
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="w-14 h-14 rounded-full p-0 flex items-center justify-center"
          onClick={() => setShowDetails(!showDetails)}
        >
          <Info className="w-5 h-5" />
        </Button>

        <Button
          variant="primary"
          size="lg"
          className="w-16 h-16 rounded-full p-0 flex items-center justify-center"
          onClick={handleKeep}
        >
          <Check className="w-6 h-6" />
        </Button>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Keyboard shortcuts: ← Pass | ↑ Details | → Keep</p>
      </div>
    </div>
  );
}

function SwipeCard({ job, onPass, onKeep, showDetails }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  function handleDragEnd(event, info) {
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        onKeep();
      } else {
        onPass();
      }
    }
  }

  return (
    <motion.div
      className="w-full max-w-2xl"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-dark-border">
        {/* Card Header */}
        <div className="p-8 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {job.title}
              </h2>
              <p className="text-lg text-primary-600 dark:text-primary-400 font-semibold">
                {job.company}
              </p>
            </div>
            <Badge score={job.score} className="text-lg px-3 py-1">
              {job.score}/10
            </Badge>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            {job.location && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{job.location}</span>
              </div>
            )}
            {job.salary_range && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="text-sm">{job.salary_range}</span>
              </div>
            )}
            {job.remote && (
              <Badge variant="blue">Remote</Badge>
            )}
          </div>

          {job.keywords && job.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {job.keywords.slice(0, 6).map((keyword, index) => (
                <Badge key={index} variant="gray">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* AI Reason */}
        {job.ai_reason && (
          <div className="px-8 pb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                AI Analysis
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {job.ai_reason}
              </p>
            </div>
          </div>
        )}

        {/* Job Description (expandable) */}
        {showDetails && job.description && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 pb-6"
          >
            <div className="border-t border-gray-200 dark:border-dark-border pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Job Description
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {job.description.substring(0, 500)}
                  {job.description.length > 500 && '...'}
                </p>
              </div>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-primary-600 dark:text-primary-400 hover:underline"
              >
                View full posting →
              </a>
            </div>
          </motion.div>
        )}

        {/* Swipe Indicators */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-12">
          <motion.div
            className="text-6xl font-bold text-red-500 opacity-0"
            style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
          >
            PASS
          </motion.div>
          <motion.div
            className="text-6xl font-bold text-green-500 opacity-0"
            style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
          >
            KEEP
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
