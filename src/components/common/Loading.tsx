import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-2 border-t-blue-500 rounded-full animate-spin`}
      ></div>
      {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
