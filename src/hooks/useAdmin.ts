'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePropertiesStore } from '@/store/usePropertiesStore';
import {
    createAsset,
    updateAsset,
    deleteAsset,
    uploadImage,
    type CreateAssetPayload,
} from '@/actions/admin';

type FormMode = 'list' | 'create' | 'edit';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function generateSolanaAddress(): string {
    const len = 32 + Math.floor(Math.random() * 12);
    return Array.from({ length: len }, () =>
        BASE58_ALPHABET[Math.floor(Math.random() * BASE58_ALPHABET.length)]
    ).join('');
}

export const EMPTY_FORM: CreateAssetPayload & { totalPrice: number } = {
    name: '',
    description: '',
    location: '',
    pricePerToken: 0,
    totalSupply: 1000,
    tokenMint: '',
    image: '',
    area: 0,
    rooms: 1,
    floor: 1,
    totalFloors: 1,
    yearBuilt: new Date().getFullYear(),
    developer: '',
    roi: 12,
    status: 'active',
    propertyType: 'apartment',
    totalPrice: 0,
};

export function useAdmin() {
    const { properties, loadProperties } = usePropertiesStore();

    const [mode, setMode] = useState<FormMode>('list');
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<CreateAssetPayload & { totalPrice: number }>({ ...EMPTY_FORM });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        loadProperties(true);
    }, [loadProperties]);

    const updateField = useCallback((field: keyof typeof EMPTY_FORM, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleImageUpload = useCallback(async (file: File) => {
        setIsUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await uploadImage(fd);
            if (res.success && res.url) {
                setForm((prev) => ({ ...prev, image: res.url! }));
            } else {
                setResult({ type: 'error', message: res.error || 'Upload failed' });
            }
        } catch {
            setResult({ type: 'error', message: 'Upload failed' });
        }
        setIsUploading(false);
    }, []);

    const handleCreate = useCallback(() => {
        setForm({ ...EMPTY_FORM });
        setEditId(null);
        setMode('create');
        setResult(null);
    }, []);

    const handleEdit = useCallback((id: string) => {
        const prop = properties.find((p) => p.id === id);
        if (!prop) return;
        setForm({
            name: prop.title,
            description: prop.description,
            location: `${prop.location.city}, ${prop.location.district}, ${prop.location.address}`,
            pricePerToken: prop.price.pricePerToken,
            totalSupply: prop.tokensTotal,
            tokenMint: prop.tokenMint || '',
            image: prop.images[0]?.url || '',
            area: prop.area,
            rooms: prop.rooms,
            floor: prop.floor,
            totalFloors: prop.totalFloors,
            yearBuilt: prop.yearBuilt,
            developer: prop.developer,
            roi: prop.roi,
            status: prop.status,
            propertyType: prop.propertyType,
            totalPrice: Math.round(prop.price.pricePerToken * prop.tokensTotal),
        });
        setEditId(id);
        setMode('edit');
        setResult(null);
    }, [properties]);

    const handleDelete = useCallback(async (id: string) => {
        const res = await deleteAsset(id);
        if (res.success) {
            await loadProperties(true);
            return { success: true };
        }
        setResult({ type: 'error', message: res.error || 'Error' });
        return { success: false, error: res.error };
    }, [loadProperties]);

    const handleSubmit = useCallback(async () => {
        if (!form.name || !form.location) {
            setResult({ type: 'error', message: 'Required fields missing' });
            return { success: false };
        }

        setIsSaving(true);
        setResult(null);

        const payload: CreateAssetPayload = {
            ...form,
            pricePerToken: form.totalSupply > 0 ? Math.round((form.totalPrice / form.totalSupply) * 100) / 100 : 0,
            tokenMint: form.tokenMint || generateSolanaAddress(),
        };

        let res;
        if (mode === 'edit' && editId) {
            res = await updateAsset(editId, payload);
        } else {
            res = await createAsset(payload);
        }

        if (res.success) {
            await loadProperties(true);
            setMode('list');
        }

        setIsSaving(false);
        return res;
    }, [form, mode, editId, loadProperties]);

    const cancelEdit = useCallback(() => {
        setMode('list');
        setResult(null);
    }, []);

    return {
        properties,
        mode,
        editId,
        form,
        isSaving,
        isUploading,
        result,
        setResult,
        updateField,
        handleImageUpload,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSubmit,
        cancelEdit,
    };
}
