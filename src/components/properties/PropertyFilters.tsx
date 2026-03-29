'use client';

import { useTranslations } from 'next-intl';
import { Search, RotateCcw } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import { Button } from '@/components/ui/Button';
import { CITIES } from '@/lib/constants';

export function PropertyFilters() {
    const t = useTranslations('properties.filters');
    const tStatus = useTranslations('properties.status');
    const { filters, setFilters, resetFilters } = useProperties(false);

    return (
        <div className="bg-surface border border-border rounded-2xl p-4 mb-8 space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                    type="text"
                    placeholder={t('search')}
                    value={filters.search}
                    onChange={(e) => setFilters({ search: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap gap-3">
                {/* City */}
                <select
                    value={filters.city ?? ''}
                    onChange={(e) => setFilters({ city: e.target.value || null })}
                    className="h-10 px-3 bg-surface-2 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary cursor-pointer"
                >
                    <option value="">{t('allCities')}</option>
                    {CITIES.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>

                {/* Rooms */}
                <select
                    value={filters.rooms ?? ''}
                    onChange={(e) => setFilters({ rooms: e.target.value ? Number(e.target.value) : null })}
                    className="h-10 px-3 bg-surface-2 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary cursor-pointer"
                >
                    <option value="">{t('allRooms')}</option>
                    {[1, 2, 3, 4].map((r) => (
                        <option key={r} value={r}>
                            {r} {t('rooms')}
                        </option>
                    ))}
                </select>

                {/* Status */}
                <select
                    value={filters.status ?? ''}
                    onChange={(e) => setFilters({ status: (e.target.value || null) as import('@/lib/types').PropertyStatus | null })}
                    className="h-10 px-3 bg-surface-2 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary cursor-pointer"
                >
                    <option value="">{t('allStatuses')}</option>
                    <option value="upcoming">{tStatus('upcoming')}</option>
                    <option value="active">{tStatus('active')}</option>
                    <option value="funded">{tStatus('funded')}</option>
                    <option value="completed">{tStatus('completed')}</option>
                </select>

                {/* Sort */}
                <select
                    value={filters.sort}
                    onChange={(e) => setFilters({ sort: e.target.value as import('@/lib/types').PropertyFilters['sort'] })}
                    className="h-10 px-3 bg-surface-2 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary cursor-pointer"
                >
                    <option value="newest">{t('newest')}</option>
                    <option value="price-asc">{t('priceAsc')}</option>
                    <option value="price-desc">{t('priceDesc')}</option>
                    <option value="roi-desc">{t('roiDesc')}</option>
                    <option value="progress-desc">{t('progressDesc')}</option>
                </select>

                {/* Reset */}
                <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto">
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t('reset')}
                </Button>
            </div>
        </div>
    );
}
