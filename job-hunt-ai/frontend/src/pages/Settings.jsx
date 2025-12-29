import { useState, useEffect } from 'react';
import { getProfile, updateProfile, getSettings, updateSettings } from '../services/api';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { X, Plus, Eye, EyeOff, Save, User, Briefcase, Settings as SettingsIcon, Bell, Palette } from 'lucide-react';

export default function Settings() {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    graduation_date: '',
    linkedin_url: '',
    portfolio_url: '',
    github_url: '',
    summary: '',
    skills: '',
    education: '',
    experience: ''
  });

  const [settings, setSettings] = useState({
    auto_generate_threshold: 8.5,
    prioritize_orlando: true,
    claude_api_key: '',
    email_notifications: true,
    browser_notifications: false,
    theme: 'dark',
    company_blacklist: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [profileData, settingsData] = await Promise.all([
        getProfile(),
        getSettings()
      ]);

      if (profileData.data) {
        setProfile(prev => ({ ...prev, ...profileData.data }));
      }

      if (settingsData.data) {
        setSettings(prev => ({
          ...prev,
          ...settingsData.data,
          company_blacklist: settingsData.data.company_blacklist || []
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage('');

    try {
      await Promise.all([
        updateProfile(profile),
        updateSettings(settings)
      ]);

      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving:', error);
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function updateProfileField(key, value) {
    setProfile({ ...profile, [key]: value });
  }

  function updateSettingField(key, value) {
    setSettings({ ...settings, [key]: value });

    // Apply theme change immediately
    if (key === 'theme') {
      applyTheme(value);
    }
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      // Auto mode - use system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  function addToBlacklist() {
    if (newCompany.trim() && !settings.company_blacklist.includes(newCompany.trim())) {
      updateSettingField('company_blacklist', [...settings.company_blacklist, newCompany.trim()]);
      setNewCompany('');
    }
  }

  function removeFromBlacklist(company) {
    updateSettingField('company_blacklist', settings.company_blacklist.filter(c => c !== company));
  }

  if (loading) {
    return <Loading message="Loading settings..." />;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-dark-text-secondary text-lg">
              Manage your profile, preferences, and configuration
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary-600 flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`p-4 rounded-xl ${
            saveMessage.includes('Error') ? 'bg-error/20 text-error' : 'bg-success/20 text-success'
          } border ${saveMessage.includes('Error') ? 'border-error/30' : 'border-success/30'}`}>
            {saveMessage}
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-xl">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white">Master Profile & Resume Data</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-dark-text text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => updateProfileField('full_name', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Kat Tassinari"
                />
              </div>

              <div>
                <label className="block text-dark-text text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfileField('email', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="kat@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-dark-text text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => updateProfileField('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-dark-text text-sm font-medium mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => updateProfileField('location', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Orlando, FL"
                />
              </div>
            </div>

            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">
                Graduation Date
              </label>
              <input
                type="date"
                value={profile.graduation_date}
                onChange={(e) => updateProfileField('graduation_date', e.target.value)}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-dark-text text-sm font-medium mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={profile.linkedin_url}
                  onChange={(e) => updateProfileField('linkedin_url', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-dark-text text-sm font-medium mb-2">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  value={profile.portfolio_url}
                  onChange={(e) => updateProfileField('portfolio_url', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="portfolio.com"
                />
              </div>

              <div>
                <label className="block text-dark-text text-sm font-medium mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={profile.github_url}
                  onChange={(e) => updateProfileField('github_url', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="github.com/username"
                />
              </div>
            </div>

            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">
                Professional Summary *
              </label>
              <textarea
                value={profile.summary}
                onChange={(e) => updateProfileField('summary', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="A brief summary of your professional background and career goals..."
              />
            </div>

            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">
                Skills *
              </label>
              <textarea
                value={profile.skills}
                onChange={(e) => updateProfileField('skills', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="List your key skills (e.g., Figma, Adobe Creative Suite, UX Design, User Research...)"
              />
            </div>

            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">
                Education *
              </label>
              <textarea
                value={profile.education}
                onChange={(e) => updateProfileField('education', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="SCAD - Savannah College of Art and Design&#10;BFA in User Experience Design, 2025"
              />
            </div>

            <div>
              <label className="block text-dark-text text-sm font-medium mb-2">
                Work Experience *
              </label>
              <textarea
                value={profile.experience}
                onChange={(e) => updateProfileField('experience', e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="List your work experience, including company, role, dates, and key achievements..."
              />
            </div>
          </div>
        </div>

        {/* Job Search Preferences */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-info/10 rounded-xl">
              <Briefcase className="w-6 h-6 text-info" />
            </div>
            <h2 className="text-2xl font-bold text-white">Job Search Preferences</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-dark-text text-sm font-medium">
                  Auto-generate materials threshold
                </label>
                <span className="text-primary font-bold text-lg">{settings.auto_generate_threshold}</span>
              </div>
              <input
                type="range"
                min="5"
                max="10"
                step="0.5"
                value={settings.auto_generate_threshold}
                onChange={(e) => updateSettingField('auto_generate_threshold', parseFloat(e.target.value))}
                className="w-full h-2 bg-dark-surface rounded-full appearance-none cursor-pointer accent-primary"
              />
              <p className="text-dark-text-secondary text-sm mt-2">
                Automatically generate materials for jobs scoring above this threshold
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-surface rounded-xl">
              <div>
                <p className="text-white font-medium">Prioritize Orlando, FL positions</p>
                <p className="text-dark-text-secondary text-sm mt-1">
                  Boost score for jobs in your preferred location
                </p>
              </div>
              <button
                onClick={() => updateSettingField('prioritize_orlando', !settings.prioritize_orlando)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.prioritize_orlando ? 'bg-primary' : 'bg-dark-border'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    settings.prioritize_orlando ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-warning/10 rounded-xl">
              <SettingsIcon className="w-6 h-6 text-warning" />
            </div>
            <h2 className="text-2xl font-bold text-white">API Configuration</h2>
          </div>

          <div>
            <label className="block text-dark-text text-sm font-medium mb-2">
              Claude API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={settings.claude_api_key}
                onChange={(e) => updateSettingField('claude_api_key', e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                placeholder="sk-ant-api03-..."
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary hover:text-white"
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-dark-text-secondary text-sm mt-2">
              Used for AI-powered job analysis and material generation
            </p>
          </div>
        </div>

        {/* Company Blacklist */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Company Blacklist</h2>
          <p className="text-dark-text-secondary text-sm mb-4">
            Jobs from these companies will be automatically filtered out
          </p>
          <div className="space-y-3">
            {settings.company_blacklist.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-dark-surface rounded-xl"
              >
                <span className="text-white">{company}</span>
                <button
                  onClick={() => removeFromBlacklist(company)}
                  className="text-error hover:text-error/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addToBlacklist()}
                placeholder="Add company name..."
                className="flex-1 px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                onClick={addToBlacklist}
                className="bg-primary hover:bg-primary-600 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-success/10 rounded-xl">
              <Bell className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-surface rounded-xl">
              <div>
                <p className="text-white font-medium">Email notifications</p>
                <p className="text-dark-text-secondary text-sm mt-1">
                  Receive email updates for new high-scoring jobs
                </p>
              </div>
              <button
                onClick={() => updateSettingField('email_notifications', !settings.email_notifications)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.email_notifications ? 'bg-primary' : 'bg-dark-border'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    settings.email_notifications ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-surface rounded-xl">
              <div>
                <p className="text-white font-medium">Browser notifications</p>
                <p className="text-dark-text-secondary text-sm mt-1">
                  Get notified when follow-ups are due
                </p>
              </div>
              <button
                onClick={() => updateSettingField('browser_notifications', !settings.browser_notifications)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.browser_notifications ? 'bg-primary' : 'bg-dark-border'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    settings.browser_notifications ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Palette className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Appearance</h2>
          </div>

          <div>
            <label className="block text-dark-text text-sm font-medium mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'auto'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => updateSettingField('theme', theme)}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors capitalize ${
                    settings.theme === theme
                      ? 'bg-primary text-white border-2 border-primary'
                      : 'bg-dark-surface text-dark-text-secondary border-2 border-dark-border hover:border-dark-text-secondary'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
