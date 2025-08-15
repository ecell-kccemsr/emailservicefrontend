import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true, className = '' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-2 shadow-lg">
          <img
            src="/kcecell.png"
            alt="E-Cell Logo"
            className={`${sizeClasses[size]} object-contain filter brightness-0 invert`}
            style={{ 
              filter: 'brightness(0) invert(1)',
              imageRendering: 'crisp-edges'
            }}
          />
        </div>
        {/* Optional glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl blur opacity-20 -z-10"></div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold text-gray-900 leading-tight`}>
            E-Cell Email
          </span>
          <span className="text-xs text-gray-500 font-medium">
            KCCEMSR
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
