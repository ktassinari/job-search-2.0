import { useState, useEffect } from 'react';
import { Search, Mail, Plus, Copy, Edit2, Trash2, Send, FileText } from 'lucide-react';
import Button from '../components/Button';

export default function EmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Mock templates - will be replaced with API calls
  const mockTemplates = [
    {
      id: 1,
      name: 'Initial Outreach - Referral Request',
      category: 'referral',
      subject: 'Quick question about {{company}}',
      body: `Hi {{contact_name}},

I hope this email finds you well! I saw that {{company}} is hiring for a {{job_title}} position, and I'm really excited about the opportunity.

Given your experience at {{company}}, I was wondering if you might be willing to provide a referral or share any insights about the role and team culture?

I'd be happy to send over my resume and portfolio for your review.

Thanks so much for considering!

Best regards,
{{your_name}}`,
      tags: ['referral', 'networking', 'cold-outreach'],
      created_at: '2025-01-05',
      last_used: '2025-01-10',
      use_count: 5
    },
    {
      id: 2,
      name: 'Thank You - After Interview',
      category: 'follow-up',
      subject: 'Thank you for the {{job_title}} interview',
      body: `Dear {{interviewer_name}},

Thank you so much for taking the time to speak with me today about the {{job_title}} position at {{company}}. I really enjoyed learning more about the team and the exciting projects you're working on.

I'm particularly excited about {{specific_topic_discussed}}, and I believe my experience with {{relevant_skill}} would allow me to make meaningful contributions to your team.

Please don't hesitate to reach out if you need any additional information. I look forward to hearing from you about next steps.

Best regards,
{{your_name}}`,
      tags: ['interview', 'thank-you', 'follow-up'],
      created_at: '2025-01-03',
      last_used: '2025-01-08',
      use_count: 3
    },
    {
      id: 3,
      name: 'Follow-up - Application Status',
      category: 'follow-up',
      subject: 'Following up on {{job_title}} application',
      body: `Hi {{hiring_manager_name}},

I wanted to follow up on my application for the {{job_title}} position that I submitted on {{application_date}}.

I remain very interested in joining {{company}} and contributing to {{team_name}}. If there's any additional information I can provide to support my application, please let me know.

I'd be happy to schedule a call at your convenience to discuss how my background in {{key_skill}} aligns with the role.

Thank you for your time and consideration.

Best regards,
{{your_name}}`,
      tags: ['follow-up', 'application', 'status-check'],
      created_at: '2025-01-02',
      last_used: '2025-01-12',
      use_count: 8
    },
    {
      id: 4,
      name: 'Networking - Coffee Chat Request',
      category: 'networking',
      subject: 'Would love to connect over coffee',
      body: `Hi {{contact_name}},

I hope you're doing well! I came across your profile and was really impressed by your work on {{notable_project}} at {{company}}.

I'm currently exploring opportunities in {{field}}, and I'd love to learn more about your experience and any insights you might have about the industry.

Would you be open to a brief virtual coffee chat in the coming weeks? I'd be happy to work around your schedule.

Thanks for considering!

Best,
{{your_name}}`,
      tags: ['networking', 'informational', 'coffee-chat'],
      created_at: '2025-01-01',
      last_used: '2025-01-09',
      use_count: 4
    },
    {
      id: 5,
      name: 'Connection Follow-up',
      category: 'networking',
      subject: 'Great meeting you at {{event_name}}!',
      body: `Hi {{contact_name}},

It was wonderful meeting you at {{event_name}} on {{event_date}}! I really enjoyed our conversation about {{topic_discussed}}.

I'd love to stay in touch and learn more about your work at {{company}}. Would you be open to connecting on LinkedIn?

{{optional_ask}}

Looking forward to staying connected!

Best regards,
{{your_name}}`,
      tags: ['networking', 'event-follow-up', 'connection'],
      created_at: '2024-12-28',
      last_used: '2025-01-11',
      use_count: 6
    }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  function loadTemplates() {
    // TODO: Replace with actual API call
    setTemplates(mockTemplates);
  }

  const categories = {
    all: 'All Templates',
    referral: 'Referral Requests',
    'follow-up': 'Follow-ups',
    networking: 'Networking',
    interview: 'Interview',
    application: 'Application'
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  function handleNewTemplate() {
    setCurrentTemplate({
      id: null,
      name: '',
      category: 'networking',
      subject: '',
      body: '',
      tags: []
    });
    setShowEditorModal(true);
  }

  function handleEditTemplate(template) {
    setCurrentTemplate({ ...template });
    setShowEditorModal(true);
  }

  function handleSaveTemplate() {
    // TODO: Implement API call to save template
    console.log('Save template:', currentTemplate);
    setShowEditorModal(false);
    setCurrentTemplate(null);
  }

  function handleCopyTemplate(template) {
    const filledTemplate = `Subject: ${template.subject}\n\n${template.body}`;
    navigator.clipboard.writeText(filledTemplate);
    // TODO: Show toast notification
  }

  function handleDeleteTemplate(id) {
    if (confirm('Are you sure you want to delete this template?')) {
      // TODO: Implement API call to delete template
      setTemplates(templates.filter(t => t.id !== id));
    }
  }

  function extractVariables(text) {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = text.matchAll(regex);
    return [...new Set([...matches].map(m => m[1]))];
  }

  const stats = {
    total: templates.length,
    mostUsed: templates.reduce((max, t) => t.use_count > (max?.use_count || 0) ? t : max, null),
    recentlyUsed: templates.filter(t => {
      if (!t.last_used) return false;
      const daysSince = (new Date() - new Date(t.last_used)) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }).length
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Email Templates</h1>
          <p className="text-dark-text-secondary">
            Create and manage reusable email templates for your job search
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Total Templates</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Most Used</p>
                <p className="text-lg font-bold text-white truncate">
                  {stats.mostUsed?.name || 'N/A'}
                </p>
                <p className="text-sm text-dark-text-secondary">
                  {stats.mostUsed?.use_count || 0} times
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Used This Week</p>
                <p className="text-3xl font-bold text-info">{stats.recentlyUsed}</p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-info" />
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
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Object.entries(categories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <Button onClick={handleNewTemplate} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Template</span>
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center">
            <Mail className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
            <p className="text-dark-text-secondary text-lg mb-2">No templates found</p>
            <p className="text-dark-text-secondary text-sm">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first email template to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => {
              const variables = extractVariables(template.subject + template.body);
              return (
                <div
                  key={template.id}
                  className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-primary/50 transition-colors"
                >
                  {/* Template Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-dark-text-secondary mb-2">
                        {template.subject}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {template.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-dark-surface text-dark-text-secondary rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                      {categories[template.category]}
                    </span>
                  </div>

                  {/* Template Preview */}
                  <div className="bg-dark-bg border border-dark-border rounded-lg p-4 mb-4">
                    <p className="text-dark-text-secondary text-sm line-clamp-4">
                      {template.body}
                    </p>
                  </div>

                  {/* Variables */}
                  {variables.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-dark-text-secondary mb-2">Variables:</p>
                      <div className="flex flex-wrap gap-2">
                        {variables.map((variable, index) => (
                          <code
                            key={index}
                            className="px-2 py-1 bg-info/10 text-info rounded text-xs font-mono border border-info/20"
                          >
                            {`{{${variable}}}`}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meta Info & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                    <div className="text-xs text-dark-text-secondary">
                      <span>Used {template.use_count} times</span>
                      {template.last_used && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Last: {new Date(template.last_used).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyTemplate(template)}
                        className="p-2 text-dark-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Copy template"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="p-2 text-dark-text-secondary hover:text-info hover:bg-info/10 rounded-lg transition-colors"
                        title="Edit template"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-dark-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="Delete template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Template Editor Modal */}
        {showEditorModal && currentTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-dark-card border border-dark-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {currentTemplate.id ? 'Edit Template' : 'New Template'}
              </h2>

              <div className="space-y-6">
                {/* Template Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={currentTemplate.name}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                    placeholder="e.g., Initial Outreach - Referral Request"
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category
                  </label>
                  <select
                    value={currentTemplate.category}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, category: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {Object.entries(categories).filter(([key]) => key !== 'all').map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={currentTemplate.subject}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, subject: e.target.value })}
                    placeholder="Use {{variables}} for dynamic content"
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Body
                  </label>
                  <textarea
                    rows={12}
                    value={currentTemplate.body}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, body: e.target.value })}
                    placeholder="Write your email template here. Use {{variable_name}} for dynamic content."
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-dark-text-secondary mt-2">
                    Tip: Use double curly braces like {`{{contact_name}}`} or {`{{company}}`} for variables
                  </p>
                </div>

                {/* Detected Variables */}
                {(() => {
                  const vars = extractVariables(currentTemplate.subject + currentTemplate.body);
                  if (vars.length > 0) {
                    return (
                      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                        <p className="text-sm text-info mb-2">Detected variables:</p>
                        <div className="flex flex-wrap gap-2">
                          {vars.map((variable, index) => (
                            <code
                              key={index}
                              className="px-2 py-1 bg-dark-bg text-info rounded text-xs font-mono"
                            >
                              {`{{${variable}}}`}
                            </code>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditorModal(false);
                    setCurrentTemplate(null);
                  }}
                  className="px-4 py-2 border-2 border-dark-border hover:border-gray-500 rounded-lg text-dark-text-secondary hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <Button onClick={handleSaveTemplate}>
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
