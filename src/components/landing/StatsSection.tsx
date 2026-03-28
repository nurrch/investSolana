'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { TrendingUp, Building2, Users, BarChart3 } from 'lucide-react';
import { Animate } from '@/components/ui/Animate';
import { useInView } from '@/hooks/useInView';

function CountUp({ target, suffix = '', decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
    const [count, setCount] = useState(0);
    const { ref, isVisible } = useInView(0.3);

    useEffect(() => {
        if (!isVisible) return;
        let start = 0;
        const duration = 1800;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 16);
        return () => clearInterval(timer);
    }, [isVisible, target]);

    return (
        <span ref={ref}>
            {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}
        </span>
    );
}

export function StatsSection() {
    const t = useTranslations('landing.stats');

    const stats = [
        { icon: TrendingUp, target: 2500, suffix: '+', decimals: 0, label: t('invested') },
        { icon: Building2, target: 12, suffix: '', decimals: 0, label: t('properties') },
        { icon: Users, target: 350, suffix: '+', decimals: 0, label: t('investors') },
        { icon: BarChart3, target: 12.1, suffix: '%', decimals: 1, label: t('avgRoi') },
    ];

    return (
        <section className="py-24">
            <Container>
                <Animate>
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">{t('title')}</h2>
                </Animate>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <Animate key={i} delay={i * 120} direction="up">
                                <div className="bg-surface border border-border rounded-2xl p-8 text-center hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-500 ease-out">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                                        <CountUp target={stat.target} suffix={stat.suffix} decimals={stat.decimals} />
                                    </div>
                                    <div className="text-sm text-muted">{stat.label}</div>
                                </div>
                            </Animate>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
