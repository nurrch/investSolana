'use client';

import { useEffect, useState } from 'react';
import { usePropertiesStore } from '@/store/usePropertiesStore';
import { getPropertyById } from '@/actions/properties';
import type { Property } from '@/lib/types';

export function useProperty(id: string) {
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const allProperties = usePropertiesStore((s) => s.properties);
    const loadProperties = usePropertiesStore((s) => s.loadProperties);

    useEffect(() => {
        loadProperties();
        getPropertyById(id).then((p) => {
            setProperty(p);
            setLoading(false);
        });
    }, [id, loadProperties]);

    const similar = allProperties
        .filter((p) => p.id !== property?.id && p.location.city === property?.location.city)
        .slice(0, 3);

    return { property, loading, similar };
}
