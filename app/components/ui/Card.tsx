import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm';
  const combinedClasses = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
