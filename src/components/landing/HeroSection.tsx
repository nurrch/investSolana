'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const step = Math.ceil(target / (duration / 16));
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
    }, [target]);

    return <>{count.toLocaleString()}{suffix}</>;
}

export function HeroSection() {
    const t = useTranslations('landing.hero');
    const locale = useLocale();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <section className="relative overflow-hidden py-20 sm:py-28">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <Container className="relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div
                        className="transition-all duration-700 ease-out"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                            <span className="text-sm text-primary font-medium">Solana Blockchain</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 text-foreground transition-all duration-700 ease-out"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                            transitionDelay: '150ms',
                        }}
                    >
                        {t('title')}
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="text-lg sm:text-xl text-muted leading-relaxed mb-10 max-w-2xl mx-auto transition-all duration-700 ease-out"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                            transitionDelay: '300ms',
                        }}
                    >
                        {t('subtitle')}
                    </p>

                    {/* CTAs */}
                    <div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ease-out"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                            transitionDelay: '450ms',
                        }}
                    >
                        <Link href={`/${locale}/properties`}>
                            <Button size="lg" className="text-base px-8">
                                {t('cta')}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <a href="#how-it-works">
                            <Button variant="outline" size="lg" className="text-base px-8">
                                {t('ctaSecondary')}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </a>
                    </div>

                    {/* Stats with count animation */}
                    <div
                        className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto transition-all duration-700 ease-out"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                            transitionDelay: '600ms',
                        }}
                    >
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                                {mounted ? <CountUp target={2500} suffix="+" /> : '0'}
                            </div>
                            <div className="text-xs text-muted mt-1">SOL</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                                {mounted ? <CountUp target={12} /> : '0'}
                            </div>
                            <div className="text-xs text-muted mt-1">Objects</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                                {mounted ? <CountUp target={12} suffix="%" /> : '0'}
                            </div>
                            <div className="text-xs text-muted mt-1">Avg ROI</div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
