import { cn } from '@/lib/utils';

interface ProgressBarProps {
    value: number; // 0-100
    className?: string;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, className, showLabel = false, size = 'md' }: ProgressBarProps) {
    const clamped = Math.min(100, Math.max(0, value));
    const sizeClass = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    }[size];

    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between text-xs text-muted mb-1">
                    <span>Прогресс</span>
                    <span className="text-foreground font-medium">{clamped}%</span>
                </div>
            )}
            <div className={cn('w-full rounded-full bg-surface-3 overflow-hidden', sizeClass)}>
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-700 ease-out bg-primary',
                        clamped === 100 && 'bg-accent'
                    )}
                    style={{ width: `${clamped}%` }}
                />
            </div>
        </div>
    );
}
