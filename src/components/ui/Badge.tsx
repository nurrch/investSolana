import { cn } from '@/lib/utils';
import type { PropertyStatus } from '@/lib/types';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    children: React.ReactNode;
    className?: string;
}

const variantClasses = {
    default: 'bg-surface-3 text-muted',
    success: 'bg-accent/10 text-accent',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-primary/10 text-primary',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                variantClasses[variant],
                className
            )}
        >
            {children}
        </span>
    );
}

const statusVariantMap: Record<PropertyStatus, BadgeProps['variant']> = {
    upcoming: 'info',
    active: 'success',
    funded: 'warning',
    completed: 'default',
};

export function StatusBadge({
    status,
    label,
    className,
}: {
    status: PropertyStatus;
    label: string;
    className?: string;
}) {
    return (
        <Badge variant={statusVariantMap[status]} className={className}>
            {label}
        </Badge>
    );
}
