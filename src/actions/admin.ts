'use server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://103.240.147.23:4000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`API ${res.status}: ${text}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : ({} as T);
}

export interface CreateAssetPayload {
    name: string;
    description: string;
    location: string;
    pricePerToken: number;
    totalSupply: number;
    tokenMint: string;
    image?: string;
    images?: string[];
    tokensSold?: number;
    area?: number;
    rooms?: number;
    floor?: number;
    totalFloors?: number;
    yearBuilt?: number;
    developer?: string;
    roi?: number;
    status?: string;
    propertyType?: string;
}

export async function createAsset(
    payload: CreateAssetPayload
): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { image, images, totalPrice: _tp, ...rest } = payload as CreateAssetPayload & { totalPrice?: number };
        const imgArray = images?.length ? images : image ? [image] : [];
        const body = {
            ...rest,
            images: imgArray,
            tokensSold: rest.tokensSold ?? 0,
            area: rest.area || 1,
            rooms: rest.rooms || 1,
            floor: rest.floor || 1,
            totalFloors: rest.totalFloors || 1,
            yearBuilt: rest.yearBuilt || new Date().getFullYear(),
            developer: rest.developer || '-',
            roi: rest.roi || 0,
            status: rest.status || 'active',
            propertyType: rest.propertyType || 'apartment',
        };
        const result = await apiFetch<{ id: string }>('/assets', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return { success: true, id: result.id };
    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
}

export async function updateAsset(
    id: string,
    payload: Partial<CreateAssetPayload>
): Promise<{ success: boolean; error?: string }> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { image, images, totalPrice: _tp2, ...rest } = payload as Partial<CreateAssetPayload> & { totalPrice?: number };
        const imgArray = images?.length ? images : image ? [image] : undefined;
        const body = {
            ...rest,
            ...(imgArray && { images: imgArray }),
            tokensSold: rest.tokensSold ?? 0,
            area: rest.area || 1,
            rooms: rest.rooms || 1,
            floor: rest.floor || 1,
            totalFloors: rest.totalFloors || 1,
            yearBuilt: rest.yearBuilt || new Date().getFullYear(),
            developer: rest.developer || '-',
            roi: rest.roi || 0,
            status: rest.status || 'active',
            propertyType: rest.propertyType || 'apartment',
        };
        await apiFetch(`/assets/${encodeURIComponent(id)}`, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
        return { success: true };
    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
}

export async function deleteAsset(
    id: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await apiFetch(`/assets/${encodeURIComponent(id)}`, {
            method: 'DELETE',
        });
        return { success: true };
    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
}

export async function createListing(
    assetId: string,
    price: number
): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const result = await apiFetch<{ _id: string }>('/listings', {
            method: 'POST',
            body: JSON.stringify({ assetId, price }),
        });
        return { success: true, id: result._id };
    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
}

export async function deleteListing(
    id: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await apiFetch(`/listings/${encodeURIComponent(id)}`, {
            method: 'DELETE',
        });
        return { success: true };
    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
}

export async function uploadImage(
    formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        const data = await res.json();
        return { success: true, url: data.url };
    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
}
