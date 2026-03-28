'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Animate } from '@/components/ui/Animate';

export function CTASection() {
    const t = useTranslations('landing.cta');
    const locale = useLocale();

    return (
        <section className="py-24">
            <Container>
                <Animate direction="up">
                    <div className="relative rounded-3xl overflow-hidden bg-primary">
                        <div className="px-8 py-16 sm:px-16 sm:py-20 text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                {t('title')}
                            </h2>
                            <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                                {t('subtitle')}
                            </p>
                            <Link href={`/${locale}/properties`}>
                                <Button variant="accent" size="lg" className="text-base px-8">
                                    {t('button')}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Animate>
            </Container>
        </section>
    );
}
