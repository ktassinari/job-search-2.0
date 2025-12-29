export default function Badge({ children, score, variant, className = '' }) {
  // Auto-determine variant from score if provided
  let badgeClass = 'badge-gray';

  if (score !== undefined) {
    if (score >= 9) badgeClass = 'badge-green';
    else if (score >= 7) badgeClass = 'badge-blue';
    else if (score >= 5) badgeClass = 'badge-yellow';
  } else if (variant) {
    badgeClass = `badge-${variant}`;
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {children}
    </span>
  );
}
