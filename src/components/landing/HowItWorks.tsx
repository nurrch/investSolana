'use client';

import { useTranslations } from 'next-intl';
import { Coins, Search, PiggyBank, TrendingUp } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Animate } from '@/components/ui/Animate';

const icons = [Coins, Search, PiggyBank, TrendingUp];

export function HowItWorks() {
    const t = useTranslations('landing.howItWorks');

    const steps = [
        { title: t('step1.title'), description: t('step1.description') },
        { title: t('step2.title'), description: t('step2.description') },
        { title: t('step3.title'), description: t('step3.description') },
        { title: t('step4.title'), description: t('step4.description') },
    ];

    return (
        <section id="how-it-works" className="py-24">
            <Container>
                <Animate>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h2>
                        <p className="text-muted text-lg max-w-xl mx-auto">{t('subtitle')}</p>
                    </div>
                </Animate>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, i) => {
                        const Icon = icons[i];
                        return (
                            <Animate key={i} delay={i * 120} direction="up">
                                <div className="bg-surface border border-border rounded-2xl p-6 text-center hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-500 ease-out">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white mb-4">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div className="text-xs font-semibold text-primary mb-2">
                                        {String(i + 1).padStart(2, '0')}
                                    </div>

                                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                                    <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                                </div>
                            </Animate>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
