
import React from 'react';
import { cn } from '@/lib/utils';
import { useDesignSystem } from './DesignSystemProvider';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
}

export const DSCard: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  interactive = false,
  className,
  ...props
}) => {
  const { shadows } = useDesignSystem();

  const baseClasses = 'bg-white rounded-lg transition-all duration-200';

  const variantClasses = {
    default: 'border border-gray-200 shadow-sm',
    elevated: 'shadow-md hover:shadow-lg',
    outline: 'border-2 border-gray-200',
    ghost: 'border border-transparent'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const interactiveClasses = interactive 
    ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--ds-primary)]/50 focus:ring-offset-2'
    : '';

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        interactiveClasses,
        className
      )}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};
