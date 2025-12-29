import { X, Command } from 'lucide-react';

export default function KeyboardShortcutsHelp({ onClose }) {
  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['⌘', '1'], description: 'Go to Home' },
        { keys: ['⌘', '2'], description: 'Go to Jobs' },
        { keys: ['⌘', '3'], description: 'Go to Review' },
        { keys: ['⌘', '4'], description: 'Go to Materials' },
        { keys: ['⌘', '5'], description: 'Go to Network' },
        { keys: ['⌘', '6'], description: 'Go to Settings' },
      ]
    },
    {
      category: 'Actions',
      items: [
        { keys: ['⌘', 'K'], description: 'Focus search' },
        { keys: ['ESC'], description: 'Close modal / Go back' },
        { keys: ['?'], description: 'Show keyboard shortcuts' },
      ]
    },
    {
      category: 'Review Page',
      items: [
        { keys: ['←'], description: 'Reject job' },
        { keys: ['→'], description: 'Accept job' },
        { keys: ['↑'], description: 'Bookmark job' },
        { keys: ['SPACE'], description: 'Skip job' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={onClose}>
      <div
        className="bg-dark-card border border-dark-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Command className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-surface rounded-lg transition-colors text-dark-text-secondary hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold text-dark-text-secondary uppercase mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-dark-surface rounded-lg"
                  >
                    <span className="text-white">{shortcut.description}</span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={i} className="flex items-center">
                          <kbd className="px-2 py-1 bg-dark-bg border border-dark-border rounded text-sm font-mono text-white">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-dark-text-secondary">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary">
            <strong>Tip:</strong> Press <kbd className="px-2 py-0.5 bg-primary/20 rounded text-xs font-mono">?</kbd> anytime to see these shortcuts
          </p>
        </div>
      </div>
    </div>
  );
}
