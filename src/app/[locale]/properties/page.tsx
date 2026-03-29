'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { PropertyCardSkeleton } from '@/components/ui/Skeleton';
import { usePropertiesStore } from '@/store/usePropertiesStore';

export default function PropertiesPage() {
    const t = useTranslations('properties');
    const { filteredProperties, isLoading, loadProperties } = usePropertiesStore();

    useEffect(() => {
        loadProperties();
    }, [loadProperties]);

    return (
        <section className="py-12">
            <Container>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('title')}</h1>
                    <p className="text-muted text-lg">{t('subtitle')}</p>
                </div>

                {/* Filters */}
                <PropertyFilters />

                {/* Results count */}
                {!isLoading && (
                    <div className="text-sm text-muted mb-6">
                        {t('found')}: <span className="text-foreground font-medium">{filteredProperties.length}</span>
                    </div>
                )}

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <PropertyCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-muted text-lg">{t('empty')}</p>
                    </div>
                )}
            </Container>
        </section>
    );
}
