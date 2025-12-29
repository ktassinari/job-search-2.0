import { useState, useEffect } from 'react';
import { getJobs, getMaterials, generateJobMaterials } from '../services/api';
import Loading from '../components/Loading';
import ScoreBadge from '../components/ScoreBadge';
import CompanyAvatar from '../components/CompanyAvatar';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { Copy, Download, Edit, Check, FileText, Sparkles } from 'lucide-react';

export default function Materials() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const response = await getJobs({
        minScore: 7,
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
    setMaterialsLoading(true);

    try {
      const response = await getMaterials(job.id);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setMaterialsLoading(false);
    }
  }

  async function handleGenerateMaterials() {
    if (!selectedJob) return;

    setGenerating(true);
    try {
      await generateJobMaterials(selectedJob.id);
      await selectJob(selectedJob);
    } catch (error) {
      console.error('Error generating materials:', error);
    } finally {
      setGenerating(false);
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
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            No Materials Generated Yet
          </h2>
          <p className="text-dark-text-secondary mb-6 text-lg">
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
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Application Materials</h1>
          <p className="text-dark-text-secondary text-lg">
            Generate and manage resumes and cover letters
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Job List */}
          <div className="col-span-4">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Select Job</h2>
              <div className="space-y-3 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => selectJob(job)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedJob?.id === job.id
                        ? 'bg-primary text-white'
                        : 'bg-dark-surface hover:bg-dark-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold text-sm ${
                        selectedJob?.id === job.id ? 'text-white' : 'text-white'
                      }`}>
                        {job.title}
                      </h3>
                      <ScoreBadge score={job.score} size="sm" />
                    </div>
                    <p className={`text-sm mb-2 ${
                      selectedJob?.id === job.id ? 'text-primary-100' : 'text-primary'
                    }`}>
                      {job.company}
                    </p>
                    <StatusBadge status={job.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Materials */}
          <div className="col-span-8">
            {!selectedJob ? (
              <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center">
                <p className="text-dark-text-secondary">Select a job to view materials</p>
              </div>
            ) : (
              <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                {/* Job Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <CompanyAvatar company={selectedJob.company} size="lg" />
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedJob.title}
                      </h2>
                      <p className="text-lg text-primary">{selectedJob.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ScoreBadge score={selectedJob.score} size="md" />
                    <StatusBadge status={selectedJob.status} />
                  </div>
                </div>

                {/* Generate Button */}
                {!materials && !materialsLoading && (
                  <div className="mb-6">
                    <Button
                      onClick={handleGenerateMaterials}
                      disabled={generating}
                      className="w-full bg-primary hover:bg-primary-600 flex items-center justify-center space-x-2"
                    >
                      {generating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Generating Materials...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Generate Materials</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {materialsLoading ? (
                  <Loading message="Loading materials..." />
                ) : materials ? (
                  <>
                    {/* Tabs */}
                    <div className="flex space-x-1 mb-6 border-b border-dark-border">
                      <button
                        className={`px-6 py-3 font-medium transition-colors relative ${
                          activeTab === 'resume'
                            ? 'text-white'
                            : 'text-dark-text-secondary hover:text-white'
                        }`}
                        onClick={() => setActiveTab('resume')}
                      >
                        Resume
                        {activeTab === 'resume' && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                      </button>
                      <button
                        className={`px-6 py-3 font-medium transition-colors relative ${
                          activeTab === 'coverLetter'
                            ? 'text-white'
                            : 'text-dark-text-secondary hover:text-white'
                        }`}
                        onClick={() => setActiveTab('coverLetter')}
                      >
                        Cover Letter
                        {activeTab === 'coverLetter' && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <Button
                        onClick={copyToClipboard}
                        className="bg-primary hover:bg-primary-600 flex items-center space-x-2"
                        size="sm"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy to Clipboard</span>
                          </>
                        )}
                      </Button>
                      <button
                        onClick={downloadAsText}
                        className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-white hover:bg-dark-border transition-colors flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </button>
                      <button className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-white hover:bg-dark-border transition-colors flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download DOCX</span>
                      </button>
                      <button className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-white hover:bg-dark-border transition-colors flex items-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>

                    {/* Content Preview */}
                    <div className="bg-dark-bg border border-dark-border rounded-xl p-6">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-dark-text leading-relaxed">
                        {activeTab === 'resume'
                          ? materials.resume?.content || 'No resume generated'
                          : materials.coverLetter?.content || 'No cover letter generated'}
                      </pre>
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
