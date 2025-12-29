import { useState, useEffect } from 'react';
import { getJobs, getMaterials } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Badge from '../components/Badge';
import { Copy, Download, Check } from 'lucide-react';

export default function Materials() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const response = await getJobs({
        minScore: 7,
        status: 'materials_ready',
        sortBy: 'score',
        order: 'DESC'
      });
      setJobs(response.data);

      if (response.data.length > 0) {
        selectJob(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function selectJob(job) {
    setSelectedJob(job);
    setMaterials(null);

    try {
      const response = await getMaterials(job.id);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error loading materials:', error);
    }
  }

  async function copyToClipboard() {
    const content = activeTab === 'resume'
      ? materials?.resume?.content
      : materials?.coverLetter?.content;

    if (content) {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function downloadAsText() {
    const content = activeTab === 'resume'
      ? materials?.resume?.content
      : materials?.coverLetter?.content;

    if (!content) return;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedJob.company}-${activeTab}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <Loading message="Loading materials..." />;
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Materials Generated Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Materials are automatically generated for jobs scoring 7 or higher.
            Review some jobs to get started!
          </p>
          <Button onClick={() => window.location.href = '/swipe'}>
            Review Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Application Materials
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Tailored resumes and cover letters for your top opportunities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Jobs ({jobs.length})
          </h2>
          <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedJob?.id === job.id
                    ? 'ring-2 ring-primary shadow-md'
                    : 'hover:shadow-md'
                }`}
                onClick={() => selectJob(job)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {job.title}
                  </h3>
                  <Badge score={job.score} className="ml-2 text-xs">
                    {job.score}
                  </Badge>
                </div>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  {job.company}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {job.location}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Materials Preview */}
        <div className="lg:col-span-2">
          {!selectedJob ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Select a job to view materials
              </p>
            </Card>
          ) : (
            <Card className="p-6">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedJob.title}
                </h2>
                <p className="text-lg text-primary-600 dark:text-primary-400">
                  {selectedJob.company}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mb-6 border-b border-gray-200 dark:border-dark-border">
                <button
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === 'resume'
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('resume')}
                >
                  Resume
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === 'coverLetter'
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('coverLetter')}
                >
                  Cover Letter
                </button>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mb-6">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={downloadAsText}
                  className="flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download as TXT
                </Button>
              </div>

              {/* Content */}
              <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-6 border border-gray-200 dark:border-dark-border">
                {!materials ? (
                  <Loading message="Loading materials..." />
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-900 dark:text-white">
                      {activeTab === 'resume'
                        ? materials.resume?.content || 'No resume generated'
                        : materials.coverLetter?.content || 'No cover letter generated'}
                    </pre>
                  </div>
                )}
              </div>

              {/* Suggested Projects */}
              {materials?.resume?.projects && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    Suggested Portfolio Projects
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {materials.resume.projects}
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
