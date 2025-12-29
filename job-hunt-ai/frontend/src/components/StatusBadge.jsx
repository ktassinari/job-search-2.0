export default function StatusBadge({ status, className = '' }) {
  const statusConfig = {
    reviewing: {
      label: 'Reviewing',
      bg: 'bg-info/20',
      text: 'text-info',
      border: 'border-info/30'
    },
    materials_ready: {
      label: 'Materials Ready',
      bg: 'bg-primary/20',
      text: 'text-primary',
      border: 'border-primary/30'
    },
    applied: {
      label: 'Applied',
      bg: 'bg-warning/20',
      text: 'text-warning',
      border: 'border-warning/30'
    },
    interviewing: {
      label: 'Interviewing',
      bg: 'bg-success/20',
      text: 'text-success',
      border: 'border-success/30'
    },
    phone_screen: {
      label: 'Phone Screen',
      bg: 'bg-success/20',
      text: 'text-success',
      border: 'border-success/30'
    },
    interview: {
      label: 'Interview',
      bg: 'bg-success/20',
      text: 'text-success',
      border: 'border-success/30'
    },
    offer: {
      label: 'Offer',
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30'
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-error/20',
      text: 'text-error',
      border: 'border-error/30'
    },
    archived: {
      label: 'Archived',
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      border: 'border-gray-500/30'
    },
    preparing: {
      label: 'Preparing',
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      border: 'border-gray-500/30'
    },
    submitted: {
      label: 'Submitted',
      bg: 'bg-info/20',
      text: 'text-info',
      border: 'border-info/30'
    },
    under_review: {
      label: 'Under Review',
      bg: 'bg-warning/20',
      text: 'text-warning',
      border: 'border-warning/30'
    }
  };

  const config = statusConfig[status] || statusConfig.reviewing;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.label}
    </span>
  );
}
