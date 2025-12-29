export default function CompanyAvatar({ company, size = 'md', className = '' }) {
  const initial = company?.charAt(0).toUpperCase() || '?';

  // Generate consistent color based on company name
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  const colorIndex = company?.charCodeAt(0) % colors.length || 0;
  const bgColor = colors[colorIndex];

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-2xl'
  };

  return (
    <div
      className={`${bgColor} ${sizeClasses[size]} rounded-xl flex items-center justify-center text-white font-bold ${className}`}
    >
      {initial}
    </div>
  );
}
