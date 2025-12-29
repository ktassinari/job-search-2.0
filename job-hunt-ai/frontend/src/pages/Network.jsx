import { useState, useEffect } from 'react';
import { Search, Users, UserPlus, Mail, MessageSquare, Plus, Calendar, TrendingUp } from 'lucide-react';
import Button from '../components/Button';
import CompanyAvatar from '../components/CompanyAvatar';

export default function Network() {
  const [activeTab, setActiveTab] = useState('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [interactions, setInteractions] = useState([]);

  // Mock data for contacts
  const mockContacts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'Disney+',
      title: 'Senior UX Designer',
      email: 'sarah.j@disney.com',
      linkedin_url: 'linkedin.com/in/sarahjohnson',
      relationship: 'Former colleague',
      met_at: 'SCAD Career Fair 2024',
      last_contact_date: '2025-01-10',
      next_followup_date: '2025-01-15',
      tags: 'UX, Disney, Referral',
      notes: 'Very helpful, mentioned they are actively hiring for UX roles.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      company: 'Universal',
      title: 'Creative Director',
      email: 'mchen@universal.com',
      relationship: 'Former professor',
      met_at: 'SCAD Alumni Event',
      last_contact_date: '2025-01-08',
      tags: 'Professor, Theme Parks',
      notes: 'Very supportive, willing to provide referrals.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      company: 'Comcast',
      title: 'UX Manager',
      email: 'e.rodriguez@comcast.com',
      relationship: 'Industry connection',
      met_at: 'LinkedIn',
      last_contact_date: '2025-01-05',
      next_followup_date: '2025-01-20',
      tags: 'UX, Management',
      notes: 'Interested in mentoring.'
    }
  ];

  // Mock data for referrals
  const mockReferrals = [
    {
      id: 1,
      job_title: 'UX Designer',
      company: 'Universal Creative',
      contact_name: 'Sarah Johnson',
      status: 'pending',
      requested_date: '2025-01-10',
      follow_up_date: '2025-01-17'
    },
    {
      id: 2,
      job_title: 'Experience Designer Internship',
      company: 'Walt Disney Imagineering',
      contact_name: 'Michael Chen',
      status: 'accepted',
      requested_date: '2025-01-05',
      response_date: '2025-01-08'
    }
  ];

  // Mock data for email templates
  const mockTemplates = [
    {
      id: 1,
      name: 'Initial Outreach - Referral Request',
      category: 'referral',
      use_count: 5
    },
    {
      id: 2,
      name: 'Thank You - After Interview',
      category: 'follow-up',
      use_count: 3
    },
    {
      id: 3,
      name: 'Networking - Coffee Chat Request',
      category: 'networking',
      use_count: 4
    }
  ];

  // Mock recent interactions
  const mockInteractions = [
    {
      id: 1,
      contact_name: 'Sarah Johnson',
      type: 'email',
      subject: 'Re: Referral for UX Designer role',
      interaction_date: '2025-01-10',
      notes: 'Agreed to provide referral. Sending resume tomorrow.'
    },
    {
      id: 2,
      contact_name: 'Michael Chen',
      type: 'linkedin',
      subject: 'Coffee chat follow-up',
      interaction_date: '2025-01-08',
      notes: 'Great conversation about theme park industry trends.'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setContacts(mockContacts);
    setReferrals(mockReferrals);
    setTemplates(mockTemplates);
    setInteractions(mockInteractions);
  }

  const stats = {
    totalContacts: contacts.length,
    activeReferrals: referrals.filter(r => r.status === 'pending' || r.status === 'accepted').length,
    recentInteractions: interactions.filter(i => {
      const daysSince = (new Date() - new Date(i.interaction_date)) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }).length,
    templatesUsed: templates.reduce((sum, t) => sum + t.use_count, 0)
  };

  const tabs = [
    { id: 'contacts', label: 'Contacts', icon: Users, count: contacts.length },
    { id: 'referrals', label: 'Referrals', icon: UserPlus, count: referrals.length },
    { id: 'templates', label: 'Templates', icon: Mail, count: templates.length },
    { id: 'activity', label: 'Activity', icon: MessageSquare, count: interactions.length }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Network</h1>
          <p className="text-dark-text-secondary text-lg">
            Manage your professional network, referrals, and outreach
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Total Contacts</p>
                <p className="text-3xl font-bold text-white">{stats.totalContacts}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Active Referrals</p>
                <p className="text-3xl font-bold text-info">{stats.activeReferrals}</p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-info" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">This Week</p>
                <p className="text-3xl font-bold text-success">{stats.recentInteractions}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Emails Sent</p>
                <p className="text-3xl font-bold text-warning">{stats.templatesUsed}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-dark-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 flex items-center justify-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 border-b-2 border-primary text-primary'
                      : 'text-dark-text-secondary hover:text-white hover:bg-dark-surface'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'bg-dark-surface text-dark-text-secondary'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Search and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>
                  {activeTab === 'contacts' && 'Add Contact'}
                  {activeTab === 'referrals' && 'Request Referral'}
                  {activeTab === 'templates' && 'New Template'}
                  {activeTab === 'activity' && 'Log Interaction'}
                </span>
              </Button>
            </div>

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-dark-bg border border-dark-border rounded-xl p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <CompanyAvatar company={contact.company} size="md" />
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {contact.name}
                          </h3>
                          <p className="text-primary mb-2">{contact.title}</p>
                          <p className="text-sm text-dark-text-secondary mb-2">
                            {contact.company} • {contact.relationship}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {contact.tags?.split(',').map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-dark-surface text-dark-text-secondary rounded text-xs"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                          {contact.notes && (
                            <p className="text-sm text-dark-text-secondary italic">
                              {contact.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-dark-text-secondary">
                        <p>Last contact: {new Date(contact.last_contact_date).toLocaleDateString()}</p>
                        {contact.next_followup_date && (
                          <p className="text-warning">
                            Follow up: {new Date(contact.next_followup_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Referrals Tab */}
            {activeTab === 'referrals' && (
              <div className="space-y-4">
                {referrals.map((referral) => {
                  const statusColors = {
                    pending: 'bg-info/20 text-info border-info/30',
                    accepted: 'bg-success/20 text-success border-success/30',
                    declined: 'bg-error/20 text-error border-error/30'
                  };
                  return (
                    <div
                      key={referral.id}
                      className="bg-dark-bg border border-dark-border rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {referral.job_title}
                          </h3>
                          <p className="text-primary mb-2">{referral.company}</p>
                          <p className="text-sm text-dark-text-secondary">
                            Requested from: <span className="text-white font-medium">{referral.contact_name}</span>
                          </p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${statusColors[referral.status]}`}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-dark-text-secondary">
                        <span>Requested: {new Date(referral.requested_date).toLocaleDateString()}</span>
                        {referral.follow_up_date && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Follow up: {new Date(referral.follow_up_date).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-dark-bg border border-dark-border rounded-xl p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {template.name}
                      </h3>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-dark-text-secondary">
                      Used {template.use_count} times
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                {interactions.map((interaction) => (
                  <div
                    key={interaction.id}
                    className="bg-dark-bg border border-dark-border rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {interaction.contact_name}
                        </h3>
                        <p className="text-primary text-sm mb-2">{interaction.subject}</p>
                        <p className="text-sm text-dark-text-secondary">
                          {interaction.notes}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-info/20 text-info rounded-full text-xs font-medium">
                          {interaction.type}
                        </span>
                        <p className="text-sm text-dark-text-secondary mt-2">
                          {new Date(interaction.interaction_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
