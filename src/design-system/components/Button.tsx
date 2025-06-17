
import React from 'react';
import { cn } from '@/lib/utils';
import { useDesignSystem } from './DesignSystemProvider';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const DSButton: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}) => {
  const { currentMode, colors, shadows } = useDesignSystem();

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: `bg-[var(--ds-primary)] text-white hover:opacity-90 focus:ring-[var(--ds-primary)]/50 shadow-sm hover:shadow-md`,
    secondary: `bg-[var(--ds-accent)] text-[var(--ds-text)] hover:bg-opacity-80 focus:ring-[var(--ds-primary)]/50 border border-gray-200`,
    outline: `border border-[var(--ds-primary)] text-[var(--ds-primary)] hover:bg-[var(--ds-primary)] hover:text-white focus:ring-[var(--ds-primary)]/50`,
    ghost: `text-[var(--ds-text)] hover:bg-[var(--ds-accent)] focus:ring-[var(--ds-primary)]/50`,
    danger: `bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 shadow-sm hover:shadow-md`
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2',
    xl: 'px-8 py-3 text-lg gap-2.5'
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4', 
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className={cn('animate-spin rounded-full border-2 border-current border-t-transparent', iconSizes[size])} />
      )}
      {!isLoading && icon && iconPosition === 'left' && (
        <span className={iconSizes[size]}>{icon}</span>
      )}
      {children}
      {!isLoading && icon && iconPosition === 'right' && (
        <span className={iconSizes[size]}>{icon}</span>
      )}
    </button>
  );
};
