import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/DashboardNew';
import Swipe from './pages/SwipeNew';
import JobsList from './pages/JobsListNew';
import JobDetail from './pages/JobDetail';
import Materials from './pages/MaterialsNew';
import Applications from './pages/Applications';
import Settings from './pages/Settings';
import Network from './pages/Network';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Home, Briefcase, Paperclip, Shuffle, Settings as SettingsIcon, Users, Command, Kanban } from 'lucide-react';

function AppContent() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  useKeyboardShortcuts();

  useEffect(() => {
    // Listen for ? key to show shortcuts
    function handleKeyPress(e) {
      if (e.key === '?' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    }
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navigation onShowShortcuts={() => setShowShortcuts(true)} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/swipe" element={<Swipe />} />
        <Route path="/jobs" element={<JobsList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/network" element={<Network />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {showShortcuts && <KeyboardShortcutsHelp onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}

function App() {
  useEffect(() => {
    // Always start in dark mode to match Figma
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function Navigation({ onShowShortcuts }) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home', shortcut: '⌘1' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs', shortcut: '⌘2' },
    { path: '/swipe', icon: Shuffle, label: 'Review', shortcut: '⌘3' },
    { path: '/applications', icon: Kanban, label: 'Pipeline', shortcut: '⌘4' },
    { path: '/materials', icon: Paperclip, label: 'Materials', shortcut: '⌘5' },
    { path: '/network', icon: Users, label: 'Network', shortcut: '⌘6' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings', shortcut: '⌘7' }
  ];

  // Hide navigation on swipe page for full-screen experience
  if (location.pathname === '/swipe') {
    return null;
  }

  return (
    <nav className="bg-dark-surface border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white hidden md:block">
              Job Search Portal
            </span>
          </Link>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-dark-text-secondary hover:text-white hover:bg-dark-card'
                  }`}
                  title={`${item.label} (${item.shortcut})`}
                >
                  <item.icon className="w-6 h-6" />
                </Link>
              );
            })}
            <button
              onClick={onShowShortcuts}
              className="p-3 rounded-xl transition-all text-dark-text-secondary hover:text-white hover:bg-dark-card"
              title="Keyboard Shortcuts (?)"
            >
              <Command className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default App;
