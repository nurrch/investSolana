'use client';

import { useEffect } from 'react';
import { usePropertiesStore } from '@/store/usePropertiesStore';
import type { PropertyFilters } from '@/lib/types';

export function useProperties(autoLoad = true) {
    const properties = usePropertiesStore((s) => s.properties);
    const filteredProperties = usePropertiesStore((s) => s.filteredProperties);
    const isLoading = usePropertiesStore((s) => s.isLoading);
    const filters = usePropertiesStore((s) => s.filters);
    const loadProperties = usePropertiesStore((s) => s.loadProperties);
    const setFilters = usePropertiesStore((s) => s.setFilters);
    const resetFilters = usePropertiesStore((s) => s.resetFilters);

    useEffect(() => {
        if (autoLoad) loadProperties();
    }, [autoLoad, loadProperties]);

    return {
        properties,
        filteredProperties,
        isLoading,
        filters,
        loadProperties,
        setFilters: (f: Partial<PropertyFilters>) => setFilters(f),
        resetFilters,
    };
}
