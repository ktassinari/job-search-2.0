export default function ScoreBadge({ score, size = 'md', className = '' }) {
  // Determine color based on score
  let bgColor = 'bg-gray-500';
  let textColor = 'text-white';

  if (score >= 9) {
    bgColor = 'bg-success';
  } else if (score >= 8) {
    bgColor = 'bg-info';
  } else if (score >= 7) {
    bgColor = 'bg-warning';
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div
      className={`${bgColor} ${textColor} ${sizeClasses[size]} rounded-full flex items-center justify-center font-bold ${className}`}
    >
      {score}
    </div>
  );
}
