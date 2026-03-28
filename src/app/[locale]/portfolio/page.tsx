'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Wallet, TrendingUp, PiggyBank, BarChart3, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useWalletStore } from '@/store/useWalletStore';
import { usePropertiesStore } from '@/store/usePropertiesStore';
import { formatSOL } from '@/lib/utils';

export default function PortfolioPage() {
    const t = useTranslations('portfolio');
    const locale = useLocale();
    const balance = useWalletStore((s) => s.balance);
    const investments = usePropertiesStore((s) => s.investments);

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amountSOL, 0);
    const totalReturns = investments
        .filter((i) => i.status === 'active')
        .reduce((sum, inv) => sum + inv.amountSOL * (inv.roi / 100), 0);
    const activeCount = investments.filter((i) => i.status === 'active').length;

    const stats = [
        { icon: Wallet, label: t('summary.totalBalance'), value: `${formatSOL(balance)} SOL`, accent: true },
        { icon: PiggyBank, label: t('summary.totalInvested'), value: `${formatSOL(totalInvested)} SOL` },
        { icon: TrendingUp, label: t('summary.totalReturns'), value: `${formatSOL(totalReturns)} SOL` },
        { icon: BarChart3, label: t('summary.activeInvestments'), value: String(activeCount) },
    ];

    const statusLabels: Record<string, string> = {
        active: t('investments.active'),
        completed: t('investments.completed'),
        pending: t('investments.pending'),
    };

    const statusVariants: Record<string, 'success' | 'default' | 'warning'> = {
        active: 'success',
        completed: 'default',
        pending: 'warning',
    };

    if (investments.length === 0) {
        return (
            <section className="py-20">
                <Container className="max-w-xl text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10 mb-6 mx-auto">
                        <PiggyBank className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3">{t('empty.title')}</h1>
                    <p className="text-muted mb-8">{t('empty.subtitle')}</p>
                    <Link href={`/${locale}/properties`}>
                        <Button size="lg">
                            {t('empty.cta')}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </Container>
            </section>
        );
    }

    return (
        <section className="py-12">
            <Container>
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('title')}</h1>
                    <p className="text-muted text-lg">{t('subtitle')}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={i} variant="glass" className="p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
                                        <Icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-xs text-muted">{stat.label}</span>
                                </div>
                                <div className={`text-xl font-bold ${stat.accent ? 'text-primary' : ''}`}>
                                    {stat.value}
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Investments List */}
                <h2 className="text-xl font-semibold mb-6">{t('investments.title')}</h2>
                <div className="space-y-4">
                    {investments.map((inv) => (
                        <Card key={inv.id} className="p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {/* Image */}
                                <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={inv.propertyImage}
                                        alt={inv.propertyTitle}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/${locale}/properties/${inv.propertyId}`}
                                        className="text-sm font-semibold hover:text-primary truncate block"
                                    >
                                        {inv.propertyTitle}
                                    </Link>
                                    <div className="text-xs text-muted mt-1">{inv.date}</div>
                                </div>

                                {/* Metrics */}
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="text-center">
                                        <div className="text-xs text-muted">{t('investments.invested')}</div>
                                        <div className="font-semibold">{formatSOL(inv.amountSOL)} SOL</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-muted">{t('investments.tokens')}</div>
                                        <div className="font-semibold">{inv.tokensReceived}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-muted">{t('investments.roi')}</div>
                                        <div className="font-semibold text-accent">{inv.roi}%</div>
                                    </div>
                                    <Badge variant={statusVariants[inv.status]}>
                                        {statusLabels[inv.status]}
                                    </Badge>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
}
