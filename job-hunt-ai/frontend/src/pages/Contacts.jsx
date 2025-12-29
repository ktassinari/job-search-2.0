import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompanyAvatar from '../components/CompanyAvatar';
import Button from '../components/Button';
import { Search, Plus, Mail, Phone, Linkedin, Calendar, Building, User, Tag } from 'lucide-react';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      // Mock data for now - will connect to API later
      const mockContacts = [
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.j@disney.com',
          phone: '(407) 555-0123',
          company: 'Disney+',
          title: 'Senior UX Designer',
          linkedin_url: 'https://linkedin.com/in/sarahjohnson',
          relationship: 'Former colleague',
          met_at: 'SCAD Career Fair 2024',
          last_contact_date: '2024-12-15',
          next_followup_date: '2025-01-15',
          tags: 'UX, Disney, Referral',
          notes: 'Met at SCAD career fair. Very friendly, offered to refer me for UX positions.'
        },
        {
          id: 2,
          name: 'Michael Chen',
          email: 'mchen@universal.com',
          phone: '(407) 555-0456',
          company: 'Universal Studios',
          title: 'Experience Design Lead',
          linkedin_url: 'https://linkedin.com/in/michaelchen',
          relationship: 'LinkedIn connection',
          met_at: 'LinkedIn',
          last_contact_date: '2024-12-01',
          next_followup_date: '2025-01-01',
          tags: 'Theme Parks, Universal',
          notes: 'Connected on LinkedIn after he liked my portfolio post.'
        },
        {
          id: 3,
          name: 'Emily Rodriguez',
          email: 'emily.r@netflix.com',
          company: 'Netflix',
          title: 'Product Designer',
          linkedin_url: 'https://linkedin.com/in/emilyrodriguez',
          relationship: 'Coffee chat',
          met_at: 'Coffee chat',
          last_contact_date: '2024-11-20',
          next_followup_date: '2024-12-28',
          tags: 'Netflix, Product Design',
          notes: 'Had coffee chat to discuss Netflix design culture. Great insights on their design process.'
        }
      ];
      setContacts(mockContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = !companyFilter || contact.company === companyFilter;
    return matchesSearch && matchesCompany;
  });

  const companies = [...new Set(contacts.map(c => c.company))];

  const needsFollowup = contacts.filter(c => {
    const followupDate = new Date(c.next_followup_date);
    const today = new Date();
    return followupDate <= today;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-text-secondary">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Networking</h1>
            <p className="text-dark-text-secondary text-lg">
              Manage your professional contacts and relationships
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary-600 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Contact</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Total Contacts</p>
                <p className="text-3xl font-bold text-white">{contacts.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Companies</p>
                <p className="text-3xl font-bold text-white">{companies.length}</p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-info" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">Follow-ups Due</p>
                <p className="text-3xl font-bold text-white">{needsFollowup.length}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
              <input
                type="text"
                placeholder="Search contacts by name, company, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Companies</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contacts List */}
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-surface text-dark-text-secondary text-sm uppercase border-b border-dark-border">
                  <th className="text-left py-4 px-6 font-medium">Contact</th>
                  <th className="text-left py-4 px-6 font-medium">Company</th>
                  <th className="text-left py-4 px-6 font-medium">Relationship</th>
                  <th className="text-left py-4 px-6 font-medium">Last Contact</th>
                  <th className="text-left py-4 px-6 font-medium">Next Follow-up</th>
                  <th className="text-center py-4 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <p className="text-dark-text-secondary text-lg">No contacts found</p>
                      <Button
                        onClick={() => setShowAddModal(true)}
                        className="mt-4 bg-primary hover:bg-primary-600"
                      >
                        Add Your First Contact
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map(contact => {
                    const needsFollowup = new Date(contact.next_followup_date) <= new Date();

                    return (
                      <tr
                        key={contact.id}
                        className="hover:bg-dark-surface transition-colors cursor-pointer"
                        onClick={() => setSelectedContact(contact)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-white font-medium">{contact.name}</p>
                              <p className="text-dark-text-secondary text-sm">{contact.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <CompanyAvatar company={contact.company} size="sm" />
                            <span className="text-white">{contact.company}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-dark-text">{contact.relationship}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-dark-text">{contact.last_contact_date}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`${needsFollowup ? 'text-warning font-medium' : 'text-dark-text'}`}>
                            {contact.next_followup_date}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            {contact.email && (
                              <a
                                href={`mailto:${contact.email}`}
                                className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Mail className="w-4 h-4 text-dark-text-secondary hover:text-white" />
                              </a>
                            )}
                            {contact.linkedin_url && (
                              <a
                                href={contact.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Linkedin className="w-4 h-4 text-dark-text-secondary hover:text-white" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onSave={(newContact) => {
            setContacts([...contacts, { ...newContact, id: contacts.length + 1 }]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function ContactDetailModal({ contact, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-dark-card border border-dark-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Contact Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-surface rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              {contact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">{contact.name}</h3>
              <p className="text-lg text-primary">{contact.title}</p>
              <div className="flex items-center space-x-2 mt-1">
                <CompanyAvatar company={contact.company} size="sm" />
                <span className="text-dark-text">{contact.company}</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contact.email && (
              <div className="flex items-center space-x-3 p-3 bg-dark-surface rounded-xl">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-dark-text-secondary text-xs">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-white hover:text-primary">
                    {contact.email}
                  </a>
                </div>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center space-x-3 p-3 bg-dark-surface rounded-xl">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-dark-text-secondary text-xs">Phone</p>
                  <a href={`tel:${contact.phone}`} className="text-white hover:text-primary">
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}
            {contact.linkedin_url && (
              <div className="flex items-center space-x-3 p-3 bg-dark-surface rounded-xl md:col-span-2">
                <Linkedin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-dark-text-secondary text-xs">LinkedIn</p>
                  <a
                    href={contact.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Relationship Details */}
          <div className="space-y-3">
            <div className="p-3 bg-dark-surface rounded-xl">
              <p className="text-dark-text-secondary text-xs mb-1">Relationship</p>
              <p className="text-white">{contact.relationship}</p>
            </div>
            <div className="p-3 bg-dark-surface rounded-xl">
              <p className="text-dark-text-secondary text-xs mb-1">Met At</p>
              <p className="text-white">{contact.met_at}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-dark-surface rounded-xl">
                <p className="text-dark-text-secondary text-xs mb-1">Last Contact</p>
                <p className="text-white">{contact.last_contact_date}</p>
              </div>
              <div className="p-3 bg-dark-surface rounded-xl">
                <p className="text-dark-text-secondary text-xs mb-1">Next Follow-up</p>
                <p className="text-white">{contact.next_followup_date}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {contact.tags && (
            <div>
              <p className="text-dark-text-secondary text-xs mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {contact.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/20"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {contact.notes && (
            <div className="p-4 bg-dark-surface rounded-xl">
              <p className="text-dark-text-secondary text-xs mb-2">Notes</p>
              <p className="text-white">{contact.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button className="flex-1 bg-primary hover:bg-primary-600">
              Log Interaction
            </Button>
            <Button className="flex-1 bg-dark-surface hover:bg-dark-border">
              Edit Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddContactModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    linkedin_url: '',
    relationship: '',
    met_at: '',
    tags: '',
    notes: ''
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...formData,
      last_contact_date: new Date().toISOString().split('T')[0],
      next_followup_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-dark-card border border-dark-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Add New Contact</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-surface rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">Relationship</label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="Former colleague">Former colleague</option>
                <option value="LinkedIn connection">LinkedIn connection</option>
                <option value="Coffee chat">Coffee chat</option>
                <option value="Referral">Referral</option>
                <option value="Recruiter">Recruiter</option>
                <option value="Mentor">Mentor</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">Met At</label>
              <input
                type="text"
                placeholder="e.g., SCAD Career Fair"
                value={formData.met_at}
                onChange={(e) => setFormData({ ...formData, met_at: e.target.value })}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-dark-text text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              placeholder="Comma-separated tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-dark-text text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Any additional notes about this contact..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" onClick={onClose} className="flex-1 bg-dark-surface hover:bg-dark-border">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary-600">
              Add Contact
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
