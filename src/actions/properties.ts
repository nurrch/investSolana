'use server';

import { MOCK_PROPERTIES, SOL_TO_USD } from '@/lib/constants';
import type { Property, PropertyStatus, PropertyType, Investment } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://103.240.147.23:4000';

interface BackendAsset {
    _id?: string;
    id?: string;
    name: string;
    description: string;
    image?: string;
    images?: string[];
    location: string;
    pricePerToken: number;
    totalSupply: number;
    tokenMint: string;
    area?: number;
    rooms?: number;
    floor?: number;
    totalFloors?: number;
    yearBuilt?: number;
    developer?: string;
    roi?: number;
    status?: string;
    propertyType?: string;
    tokensSold?: number;
    createdAt?: string;
}

function mapAsset(asset: BackendAsset): Property {
    const round2 = (n: number) => Math.round(n * 100) / 100;
    const parts = asset.location.split(',').map((s) => s.trim());

    const imgs = asset.images?.length
        ? asset.images.map((url, i) => ({ url, alt: `${asset.name} ${i + 1}` }))
        : asset.image
            ? [{ url: asset.image, alt: asset.name }]
            : [];

    return {
        id: asset._id || asset.id || crypto.randomUUID(),
        title: asset.name,
        description: asset.description,
        images: imgs,
        location: {
            city: parts[0] || asset.location,
            district: parts[1] || '',
            address: parts.slice(1).join(', ') || asset.location,
        },
        price: {
            totalSOL: round2((asset.pricePerToken * asset.totalSupply) / SOL_TO_USD),
            pricePerToken: round2(asset.pricePerToken / SOL_TO_USD),
        },
        tokensTotal: asset.totalSupply,
        tokensSold: asset.tokensSold ?? 0,
        roi: asset.roi ?? 12.0,
        status: (asset.status as PropertyStatus) || 'active',
        propertyType: (asset.propertyType as PropertyType) || 'apartment',
        area: asset.area ?? 0,
        rooms: asset.rooms ?? 0,
        floor: asset.floor ?? 0,
        totalFloors: asset.totalFloors ?? 0,
        yearBuilt: asset.yearBuilt ?? 0,
        developer: asset.developer ?? '',
        oracleVerified: !!asset.tokenMint,
        tokenMint: asset.tokenMint,
        createdAt: asset.createdAt || new Date().toISOString(),
    };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...(options?.cache
            ? {}
            : options?.method
                ? {}
                : { next: { revalidate: 60 } }),
    });
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`API ${res.status}: ${body}`);
    }
    return res.json();
}

// --- Assets ---

export async function getProperties(noCache?: boolean): Promise<Property[]> {
    try {
        const assets = await apiFetch<BackendAsset[]>('/assets', noCache ? { cache: 'no-store' } : undefined);
        return assets.map(mapAsset);
    } catch {
        return MOCK_PROPERTIES;
    }
}

export async function getPropertyById(id: string): Promise<Property | null> {
    try {
        const asset = await apiFetch<BackendAsset>(`/assets/${encodeURIComponent(id)}`);
        return mapAsset(asset);
    } catch {
        return MOCK_PROPERTIES.find((p) => p.id === id) ?? null;
    }
}

// --- Investments ---

interface BackendInvestment {
    _id?: string;
    id?: string;
    assetId?: string;
    walletAddress?: string;
    amount?: number;
    amountSOL?: number;
    tokensReceived?: number;
    txHash?: string;
    roi?: number;
    status?: string;
    createdAt?: string;
    asset?: BackendAsset;
    // allow already-mapped fields
    propertyId?: string;
    propertyTitle?: string;
    propertyImage?: string;
    date?: string;
}

function mapInvestment(inv: BackendInvestment, properties: Property[]): Investment {
    const prop = properties.find(
        (p) => p.id === (inv.assetId || inv.propertyId)
    );
    return {
        id: inv._id || inv.id || `inv-${Date.now()}`,
        propertyId: inv.assetId || inv.propertyId || '',
        propertyTitle: inv.propertyTitle || prop?.title || 'Объект',
        propertyImage: inv.propertyImage || prop?.images[0]?.url || '',
        amountSOL: inv.amount ?? inv.amountSOL ?? 0,
        tokensReceived: inv.tokensReceived ?? 0,
        date: inv.createdAt?.split('T')[0] || inv.date || new Date().toISOString().split('T')[0],
        roi: inv.roi ?? prop?.roi ?? 12,
        status: (inv.status as Investment['status']) || 'active',
    };
}

export async function investInProperty(
    propertyId: string,
    walletAddress: string,
    amountSOL: number,
    tokensReceived: number
): Promise<{ success: boolean; tokensReceived: number; txHash: string }> {
    try {
        const result = await apiFetch<{ id: string; txHash?: string }>('/investments', {
            method: 'POST',
            body: JSON.stringify({
                assetId: propertyId,
                walletAddress,
                amount: amountSOL,
                tokensReceived,
                txHash: `tx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
            }),
        });
        return {
            success: true,
            tokensReceived,
            txHash: result.txHash || `tx_${Date.now().toString(36)}`,
        };
    } catch (e) {
        console.error('[investInProperty] FAILED:', e);
        return { success: false, tokensReceived: 0, txHash: '' };
    }
}

export async function getInvestmentsByWallet(wallet: string): Promise<Investment[]> {
    try {
        const [raw, properties] = await Promise.all([
            apiFetch<BackendInvestment[]>(`/investments?wallet=${encodeURIComponent(wallet)}`, {
                cache: 'no-store',
            }),
            getProperties(),
        ]);
        console.log('[getInvestmentsByWallet] raw:', JSON.stringify(raw));
        return raw.map((inv) => mapInvestment(inv, properties));
    } catch (e) {
        console.error('[getInvestmentsByWallet] FAILED:', e);
        return [];
    }
}

// --- Stats ---

export async function getStats(): Promise<{
    totalInvestors: number;
    totalInvested: number;
    totalProperties: number;
    averageRoi: number;
}> {
    try {
        return await apiFetch('/stats');
    } catch {
        return { totalInvestors: 350, totalInvested: 2500, totalProperties: 12, averageRoi: 12.1 };
    }
}
