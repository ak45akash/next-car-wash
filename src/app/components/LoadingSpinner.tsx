'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Animated car washing icon */}
      <div className={`${sizeClasses[size]} relative mb-4`}>
        {/* Car outline */}
        <div className="absolute inset-0 border-4 border-blue-200 rounded-lg animate-pulse"></div>
        
        {/* Water droplets */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Rotating wash brush */}
        <div className="absolute -top-2 -right-2 w-4 h-4 border-2 border-blue-400 border-dashed rounded-full animate-spin"></div>
      </div>

      {/* Loading text */}
      <p className="text-gray-600 text-sm font-medium animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner; 