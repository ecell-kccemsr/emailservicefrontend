import React from "react";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  className = "",
}) => {
  const baseClasses = "rounded-md p-4 border";

  const typeClasses = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconClasses = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconClasses[type]}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
          <div className="text-sm">{message}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${iconClasses[type]} hover:bg-opacity-20`}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
