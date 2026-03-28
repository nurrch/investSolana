import { cn } from '@/lib/utils';
import { type HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'gradient';
    hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl overflow-hidden',
                    variant === 'default' && 'bg-surface border border-border',
                    variant === 'glass' && 'bg-surface border border-border',
                    variant === 'gradient' && 'bg-surface border border-border',
                    hover && 'hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 cursor-pointer transition-all duration-500 ease-out',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
export { Card };
