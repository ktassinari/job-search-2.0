import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleKeyPress(event) {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        return;
      }

      // Don't trigger on swipe page (has its own controls)
      if (location.pathname === '/swipe') {
        return;
      }

      // Check for Cmd/Ctrl modifier for navigation shortcuts
      const isMod = event.metaKey || event.ctrlKey;

      // Navigation shortcuts (Cmd/Ctrl + number)
      if (isMod) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            navigate('/');
            break;
          case '2':
            event.preventDefault();
            navigate('/jobs');
            break;
          case '3':
            event.preventDefault();
            navigate('/swipe');
            break;
          case '4':
            event.preventDefault();
            navigate('/applications');
            break;
          case '5':
            event.preventDefault();
            navigate('/materials');
            break;
          case '6':
            event.preventDefault();
            navigate('/network');
            break;
          case '7':
            event.preventDefault();
            navigate('/settings');
            break;
          case 'k':
            event.preventDefault();
            // Focus search if available
            const searchInput = document.querySelector('input[type="text"], input[type="search"]');
            if (searchInput) {
              searchInput.focus();
            }
            break;
          default:
            break;
        }
      }

      // Quick actions (no modifier)
      if (!isMod && !event.shiftKey && !event.altKey) {
        switch (event.key) {
          case 'Escape':
            // Close modals or go back
            const modal = document.querySelector('[role="dialog"]');
            if (modal) {
              // Click the close button if it exists
              const closeButton = modal.querySelector('button');
              if (closeButton) {
                closeButton.click();
              }
            }
            break;
          case '?':
            // Show keyboard shortcuts help (could implement a modal)
            event.preventDefault();
            console.log('Keyboard shortcuts help');
            break;
          default:
            break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate, location]);
}
