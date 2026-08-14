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
    'min-w-0 rounded-2xl border border-gray-200/90 bg-white shadow-sm shadow-gray-950/[0.035] dark:border-gray-700/80 dark:bg-gray-800';
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
