'use server';

import { MOCK_PROPERTIES } from '@/lib/constants';
import { sleep } from '@/lib/utils';
import type { Property, PropertyFilters } from '@/lib/types';

export async function getProperties(_filters?: Partial<PropertyFilters>): Promise<Property[]> {
    // Simulate API delay
    await sleep(300);
    // When real API is ready, replace with actual fetch call
    return MOCK_PROPERTIES;
}

export async function getPropertyById(id: string): Promise<Property | null> {
    await sleep(200);
    return MOCK_PROPERTIES.find((p) => p.id === id) ?? null;
}

export async function getFeaturedProperties(): Promise<Property[]> {
    await sleep(200);
    return MOCK_PROPERTIES.filter((p) => p.status === 'active').slice(0, 4);
}

export async function investInProperty(
    _propertyId: string,
    _amountSOL: number
): Promise<{ success: boolean; tokensReceived: number; txHash: string }> {
    await sleep(800);
    // Mock: always succeed
    const tokens = Math.floor(_amountSOL / 0.85);
    return {
        success: true,
        tokensReceived: tokens,
        txHash: `tx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    };
}
