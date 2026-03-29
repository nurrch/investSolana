'use client';

import { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { usePropertiesStore } from '@/store/usePropertiesStore';
import { Animate } from '@/components/ui/Animate';

export function FeaturedProperties() {
    const t = useTranslations('landing.featured');
    const tCommon = useTranslations('common');
    const locale = useLocale();

    const { properties: allProperties, loadProperties } = usePropertiesStore();

    useEffect(() => {
        loadProperties();
    }, [loadProperties]);

    const properties = allProperties.filter((p) => p.status === 'active').slice(0, 4);

    return (
        <section className="py-24">
            <Container>
                <Animate direction="up">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold mb-2">{t('title')}</h2>
                            <p className="text-muted text-lg">{t('subtitle')}</p>
                        </div>
                        <Link href={`/${locale}/properties`}>
                            <Button variant="outline">
                                {tCommon('viewAll')}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </Animate>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {properties.map((property, i) => (
                        <Animate key={property.id} delay={i * 100} direction="up">
                            <PropertyCard property={property} />
                        </Animate>
                    ))}
                </div>
            </Container>
        </section>
    );
}
