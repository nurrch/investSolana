'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatSOL, getFundingPercent } from '@/lib/utils';
import type { Property } from '@/lib/types';

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    const t = useTranslations('properties');
    const locale = useLocale();
    const progress = getFundingPercent(property.tokensSold, property.tokensTotal);

    const statusLabels: Record<string, string> = {
        upcoming: t('status.upcoming'),
        active: t('status.active'),
        funded: t('status.funded'),
        completed: t('status.completed'),
    };

    return (
        <Link href={`/${locale}/properties/${property.id}`} className="group">
            <Card hover className="h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={property.images[0]?.url ?? ''}
                        alt={property.images[0]?.alt ?? property.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute top-3 left-3">
                        <StatusBadge status={property.status} label={statusLabels[property.status]} />
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs font-semibold text-accent">
                        {property.roi}% ROI
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4 gap-3">
                    <h3 className="text-sm font-semibold line-clamp-2 leading-snug">
                        {property.title}
                    </h3>

                    <div className="flex items-center gap-1 text-muted">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-xs truncate">
                            {property.location.city}, {property.location.district}
                        </span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-auto">
                        <span className="text-lg font-bold text-primary">
                            {formatSOL(property.price.totalSOL)} SOL
                        </span>
                        <span className="text-xs text-muted">
                            {t('card.priceFrom')} {formatSOL(property.price.pricePerToken)} {t('card.perToken')}
                        </span>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs text-muted mb-1">
                            <span>{t('card.funded')}</span>
                            <span className="text-foreground font-medium">{progress}%</span>
                        </div>
                        <ProgressBar value={progress} size="sm" />
                    </div>
                </div>
            </Card>
        </Link>
    );
}
