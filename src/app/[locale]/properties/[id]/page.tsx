'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Ruler, DoorOpen, Layers, Calendar, Landmark, ShieldCheck, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { InvestForm } from '@/components/properties/InvestForm';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { MOCK_PROPERTIES } from '@/lib/constants';
import { formatSOL, getFundingPercent } from '@/lib/utils';
import type { Property } from '@/lib/types';

export default function PropertyDetailPage() {
    const t = useTranslations('property');
    const tStatus = useTranslations('properties.status');
    const tCommon = useTranslations('common');
    const locale = useLocale();
    const params = useParams();
    const id = params.id as string;

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            const found = MOCK_PROPERTIES.find((p) => p.id === id) ?? null;
            setProperty(found);
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return (
            <section className="py-12">
                <Container>
                    <Skeleton className="h-8 w-48 mb-8" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <Skeleton className="h-96 w-full rounded-2xl" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                        <Skeleton className="h-96 rounded-2xl" />
                    </div>
                </Container>
            </section>
        );
    }

    if (!property) {
        return (
            <section className="py-20">
                <Container className="text-center">
                    <p className="text-muted text-lg">Объект не найден</p>
                    <Link href={`/${locale}/properties`}>
                        <Button variant="outline" className="mt-4">
                            <ArrowLeft className="h-4 w-4" />
                            {tCommon('back')}
                        </Button>
                    </Link>
                </Container>
            </section>
        );
    }

    const progress = getFundingPercent(property.tokensSold, property.tokensTotal);
    const tokensAvailable = property.tokensTotal - property.tokensSold;

    const statusLabels: Record<string, string> = {
        upcoming: tStatus('upcoming'),
        active: tStatus('active'),
        funded: tStatus('funded'),
        completed: tStatus('completed'),
    };

    const specs = [
        { icon: Ruler, label: t('specs.area'), value: `${property.area} м²` },
        { icon: DoorOpen, label: t('specs.rooms'), value: String(property.rooms) },
        { icon: Layers, label: t('specs.floor'), value: `${property.floor}/${property.totalFloors}` },
        { icon: Calendar, label: t('specs.year'), value: String(property.yearBuilt) },
        { icon: Landmark, label: t('specs.developer'), value: property.developer },
    ];

    const similar = MOCK_PROPERTIES.filter(
        (p) => p.id !== property.id && p.location.city === property.location.city
    ).slice(0, 3);

    return (
        <section className="py-12">
            <Container>
                {/* Back */}
                <Link
                    href={`/${locale}/properties`}
                    className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {tCommon('back')}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Images + Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Image */}
                        <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden">
                            <Image
                                src={property.images[selectedImage]?.url ?? ''}
                                alt={property.images[selectedImage]?.alt ?? ''}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 66vw"
                                priority
                            />
                            <div className="absolute top-4 left-4">
                                <StatusBadge status={property.status} label={statusLabels[property.status]} />
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {property.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {property.images.map((img, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setSelectedImage(i)}
                                        className={`relative h-16 w-24 rounded-lg overflow-hidden shrink-0 border-2 cursor-pointer ${i === selectedImage ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="96px" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Title & Location */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{property.title}</h1>
                            <div className="flex items-center gap-1 text-muted">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm">
                                    {property.location.city}, {property.location.district}, {property.location.address}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-3">{t('about')}</h2>
                            <p className="text-muted leading-relaxed">{property.description}</p>
                        </Card>

                        {/* Specs */}
                        <Card className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                {specs.map((spec) => {
                                    const Icon = spec.icon;
                                    return (
                                        <div key={spec.label} className="flex items-start gap-3">
                                            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 shrink-0">
                                                <Icon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted">{spec.label}</div>
                                                <div className="text-sm font-medium">{spec.value}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Oracle verification */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-3">{t('oracle.title')}</h2>
                            <div className="flex items-center gap-3 mb-3">
                                {property.oracleVerified ? (
                                    <>
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent/10">
                                            <ShieldCheck className="h-4 w-4 text-accent" />
                                        </div>
                                        <span className="text-sm font-medium text-accent">{t('oracle.verified')}</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-warning/10">
                                            <Clock className="h-4 w-4 text-warning" />
                                        </div>
                                        <span className="text-sm font-medium text-warning">{t('oracle.pending')}</span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-muted leading-relaxed">{t('oracle.description')}</p>
                        </Card>
                    </div>

                    {/* Right: Investment Panel */}
                    <div className="space-y-6">
                        <Card className="p-6 sticky top-24">
                            <h2 className="text-lg font-semibold mb-6">{t('investment.title')}</h2>

                            {/* Price */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted">{t('investment.totalCost')}</span>
                                    <span className="font-semibold text-primary">{formatSOL(property.price.totalSOL)} SOL</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted">{t('investment.tokenPrice')}</span>
                                    <span className="text-sm font-medium">{formatSOL(property.price.pricePerToken)} SOL</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted">{t('investment.tokensAvailable')}</span>
                                    <span className="text-sm font-medium">{tokensAvailable} / {property.tokensTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted">{t('investment.expectedRoi')}</span>
                                    <span className="text-sm font-semibold text-accent">{property.roi}%</span>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted">{t('investment.progress')}</span>
                                    <span className="font-medium">{progress}%</span>
                                </div>
                                <ProgressBar value={progress} size="md" />
                            </div>

                            {/* Invest Form */}
                            {property.status === 'active' && tokensAvailable > 0 ? (
                                <InvestForm property={property} />
                            ) : (
                                <div className="text-center py-4 text-sm text-muted">
                                    {property.status === 'funded' || property.status === 'completed'
                                        ? 'Сбор завершён'
                                        : 'Скоро открытие'}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>

                {/* Similar properties */}
                {similar.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-8">{t('similar')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {similar.map((p) => (
                                <PropertyCard key={p.id} property={p} />
                            ))}
                        </div>
                    </div>
                )}
            </Container>
        </section>
    );
}
