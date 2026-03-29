'use client';

import { useEffect, useState } from 'react';
import { getStats } from '@/actions/properties';

const DEFAULT_STATS = { totalInvested: 2500, totalProperties: 12, totalInvestors: 350, averageRoi: 12.1 };

export function useStats() {
    const [data, setData] = useState(DEFAULT_STATS);

    useEffect(() => {
        getStats().then(setData);
    }, []);

    return data;
}
