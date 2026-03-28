import { cn } from '@/lib/utils';
import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    suffix?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, suffix, id, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-muted mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        id={id}
                        ref={ref}
                        className={cn(
                            'w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground',
                            'placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30',
                            error && 'border-danger focus:border-danger focus:ring-danger/30',
                            suffix && 'pr-16',
                            className
                        )}
                        {...props}
                    />
                    {suffix && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                            {suffix}
                        </div>
                    )}
                </div>
                {error && <p className="mt-1 text-xs text-danger">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export { Input };
