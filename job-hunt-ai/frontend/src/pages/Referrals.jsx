import { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, Send, CheckCircle2, Clock, XCircle, MessageSquare } from 'lucide-react';
import Button from '../components/Button';
import CompanyAvatar from '../components/CompanyAvatar';

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  // Mock data - will be replaced with API calls
  const mockReferrals = [
    {
      id: 1,
      job_id: 1,
      contact_id: 1,
      job_title: 'UX Designer',
      company: 'Universal Creative',
      contact_name: 'Sarah Johnson',
      contact_title: 'Senior UX Designer',
      status: 'pending',
      requested_date: '2025-01-10',
      notes: 'Met at SCAD Career Fair. She mentioned they are actively hiring for UX roles.',
      follow_up_date: '2025-01-17'
    },
    {
      id: 2,
      job_id: 2,
      contact_id: 2,
      job_title: 'Experience Designer Internship',
      company: 'Walt Disney Imagineering',
      contact_name: 'Michael Chen',
      contact_title: 'Creative Director',
      status: 'accepted',
      requested_date: '2025-01-05',
      response_date: '2025-01-08',
      notes: 'Former professor. Very supportive.',
      follow_up_date: null
    }
  ];

  const mockJobs = [
    { id: 1, title: 'UX Designer', company: 'Universal Creative', score: 8 },
    { id: 2, title: 'Experience Designer Internship', company: 'Walt Disney Imagineering', score: 9 },
    { id: 3, title: 'Senior UX Researcher', company: 'AOA Creative', score: 7 }
  ];

  const mockContacts = [
    { id: 1, name: 'Sarah Johnson', company: 'Disney+', title: 'Senior UX Designer' },
    { id: 2, name: 'Michael Chen', company: 'Universal', title: 'Creative Director' },
    { id: 3, name: 'Emily Rodriguez', company: 'Comcast', title: 'UX Manager' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    // TODO: Replace with actual API calls
    setReferrals(mockReferrals);
    setJobs(mockJobs);
    setContacts(mockContacts);
  }

  const statusColors = {
    pending: 'bg-info/20 text-info border-info/30',
    accepted: 'bg-success/20 text-success border-success/30',
    declined: 'bg-error/20 text-error border-error/30',
    completed: 'bg-primary/20 text-primary border-primary/30'
  };

  const statusIcons = {
    pending: Clock,
    accepted: CheckCircle2,
    declined: XCircle,
    completed: CheckCircle2
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         referral.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         referral.contact_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'pending').length,
    accepted: referrals.filter(r => r.status === 'accepted').length,
    needFollowUp: referrals.filter(r => r.follow_up_date && new Date(r.follow_up_date) <= new Date()).length
  };

  function handleRequestReferral(job) {
    setSelectedJob(job);
    setShowRequestModal(true);
  }

  function handleSubmitRequest() {
    // TODO: Implement API call to create referral request
    console.log('Request referral:', { job: selectedJob, contact: selectedContact });
    setShowRequestModal(false);
    setSelectedJob(null);
    setSelectedContact(null);
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Referral Requests</h1>
          <p className="text-dark-text-secondary">
            Track and manage referral requests from your network
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Pending</p>
                <p className="text-3xl font-bold text-info">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-info" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Accepted</p>
                <p className="text-3xl font-bold text-success">{stats.accepted}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Need Follow-up</p>
                <p className="text-3xl font-bold text-warning">{stats.needFollowUp}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search referrals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="completed">Completed</option>
            </select>

            <Button onClick={() => setShowRequestModal(true)} className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>New Request</span>
            </Button>
          </div>
        </div>

        {/* Referrals List */}
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          {filteredReferrals.length === 0 ? (
            <div className="p-12 text-center">
              <UserPlus className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
              <p className="text-dark-text-secondary text-lg mb-2">No referral requests</p>
              <p className="text-dark-text-secondary text-sm">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Request referrals from your network to boost your applications'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-dark-border">
              {filteredReferrals.map((referral) => {
                const StatusIcon = statusIcons[referral.status];
                return (
                  <div key={referral.id} className="p-6 hover:bg-dark-surface transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <CompanyAvatar company={referral.company} size="md" />
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {referral.job_title}
                          </h3>
                          <p className="text-primary mb-2">{referral.company}</p>
                          <div className="flex items-center space-x-2 text-sm text-dark-text-secondary">
                            <span>Requested from:</span>
                            <span className="text-white font-medium">{referral.contact_name}</span>
                            <span>•</span>
                            <span>{referral.contact_title}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border flex items-center space-x-2 ${statusColors[referral.status]}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span>{referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}</span>
                        </span>
                      </div>
                    </div>

                    {referral.notes && (
                      <div className="bg-dark-bg border border-dark-border rounded-lg p-4 mb-4">
                        <p className="text-dark-text-secondary text-sm">{referral.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4 text-dark-text-secondary">
                        <span>Requested: {new Date(referral.requested_date).toLocaleDateString()}</span>
                        {referral.response_date && (
                          <>
                            <span>•</span>
                            <span>Responded: {new Date(referral.response_date).toLocaleDateString()}</span>
                          </>
                        )}
                        {referral.follow_up_date && (
                          <>
                            <span>•</span>
                            <span className={new Date(referral.follow_up_date) <= new Date() ? 'text-warning font-medium' : ''}>
                              Follow up: {new Date(referral.follow_up_date).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {referral.status === 'pending' && (
                          <button className="px-3 py-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors text-sm font-medium">
                            Send Follow-up
                          </button>
                        )}
                        {referral.status === 'accepted' && (
                          <button className="px-3 py-1.5 text-success hover:bg-success/10 rounded-lg transition-colors text-sm font-medium">
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Request Referral Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-dark-card border border-dark-border rounded-2xl max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Request Referral</h2>

              <div className="space-y-6">
                {/* Select Job */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Select Job
                  </label>
                  <select
                    value={selectedJob?.id || ''}
                    onChange={(e) => setSelectedJob(jobs.find(j => j.id === parseInt(e.target.value)))}
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a job...</option>
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title} at {job.company} (Score: {job.score})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Contact */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Select Contact
                  </label>
                  <select
                    value={selectedContact?.id || ''}
                    onChange={(e) => setSelectedContact(contacts.find(c => c.id === parseInt(e.target.value)))}
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a contact...</option>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name} - {contact.title} at {contact.company}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Notes / Message Draft
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Add notes about this referral request or draft your message..."
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Follow-up Date */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setSelectedJob(null);
                    setSelectedContact(null);
                  }}
                  className="px-4 py-2 border-2 border-dark-border hover:border-gray-500 rounded-lg text-dark-text-secondary hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={!selectedJob || !selectedContact}
                  className="flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Referral</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
