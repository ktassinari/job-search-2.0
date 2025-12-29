export default function Card({ children, className = '', onClick, hover = false }) {
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow cursor-pointer' : '';

  return (
    <div className={`card ${hoverClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
