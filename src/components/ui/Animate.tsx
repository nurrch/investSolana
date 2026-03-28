'use client';

import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';

interface AnimateProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function Animate({ children, className, delay = 0, direction = 'up' }: AnimateProps) {
    const { ref, isVisible } = useInView(0.1);

    const directionClass = {
        up: 'translate-y-8',
        down: '-translate-y-8',
        left: 'translate-x-8',
        right: '-translate-x-8',
        none: '',
    }[direction];

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-700 ease-out',
                isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directionClass}`,
                className
            )}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
