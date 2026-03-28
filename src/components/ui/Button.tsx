import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        'bg-primary text-white font-semibold hover:bg-primary-hover active:scale-[0.98]',
    secondary:
        'bg-surface-2 text-foreground border border-border hover:border-border-hover hover:bg-surface-3',
    outline:
        'bg-transparent text-foreground border border-border hover:border-primary hover:text-primary',
    ghost: 'bg-transparent text-muted hover:text-foreground hover:bg-surface-2',
    accent:
        'bg-accent text-white font-semibold hover:bg-accent-hover',
    danger: 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-sm rounded-lg',
    md: 'h-10 px-5 text-sm rounded-xl',
    lg: 'h-12 px-8 text-base rounded-xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center gap-2 font-medium cursor-pointer whitespace-nowrap',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
