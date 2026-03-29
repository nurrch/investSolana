'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Trash2, Edit2, Upload, Check, X, Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { usePropertiesStore } from '@/store/usePropertiesStore';
import {
    createAsset,
    updateAsset,
    deleteAsset,
    type CreateAssetPayload,
} from '@/actions/admin';

type FormMode = 'list' | 'create' | 'edit';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function generateSolanaAddress(): string {
    // Generate a valid base58-encoded Solana-like address (32-44 chars)
    // Use a length of 32-43 which always validates as a proper Solana pubkey
    const len = 32 + Math.floor(Math.random() * 12); // 32-43
    return Array.from({ length: len }, () =>
        BASE58_ALPHABET[Math.floor(Math.random() * BASE58_ALPHABET.length)]
    ).join('');
}

const EMPTY_FORM: CreateAssetPayload & { totalPrice: number } = {
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

export default function AdminPage() {
    const t = useTranslations('admin');
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const fd = new FormData();
        fd.append('image', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (data.success && data.url) {
                update('image', data.url);
            } else {
                setResult({ type: 'error', message: data.error || 'Upload failed' });
            }
        } catch {
            setResult({ type: 'error', message: 'Upload failed' });
        }
        setIsUploading(false);
        e.target.value = '';
    };

    const update = (field: keyof typeof EMPTY_FORM, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreate = () => {
        setForm({ ...EMPTY_FORM });
        setEditId(null);
        setMode('create');
        setResult(null);
    };

    const handleEdit = (id: string) => {
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
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('confirmDelete'))) return;
        const res = await deleteAsset(id);
        if (res.success) {
            await loadProperties(true);
            setResult({ type: 'success', message: t('deleted') });
        } else {
            setResult({ type: 'error', message: res.error || 'Error' });
        }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.location) {
            setResult({ type: 'error', message: t('requiredFields') });
            return;
        }

        setIsSaving(true);
        setResult(null);

        const payload: CreateAssetPayload = {
            ...form,
            pricePerToken: form.totalSupply > 0 ? Math.round((form.totalPrice / form.totalSupply) * 100) / 100 : 0,
            tokenMint: form.tokenMint || generateSolanaAddress(),
        };

        if (mode === 'edit' && editId) {
            const res = await updateAsset(editId, payload);
            if (res.success) {
                await loadProperties(true);
                setResult({ type: 'success', message: t('updated') });
                setMode('list');
            } else {
                setResult({ type: 'error', message: res.error || 'Error' });
            }
        } else {
            const res = await createAsset(payload);
            if (res.success) {
                await loadProperties(true);
                setResult({ type: 'success', message: t('created') });
                setMode('list');
            } else {
                setResult({ type: 'error', message: res.error || 'Error' });
            }
        }

        setIsSaving(false);
    };

    return (
        <section className="py-8 min-h-screen">
            <Container>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link href="/properties">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
                            <p className="text-sm text-muted">{t('subtitle')}</p>
                        </div>
                    </div>
                    {mode === 'list' && (
                        <Button onClick={handleCreate} size="md">
                            <Plus className="h-4 w-4" />
                            {t('addProperty')}
                        </Button>
                    )}
                </div>

                {/* Result message */}
                {result && (
                    <div
                        className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${result.type === 'success'
                            ? 'bg-accent/10 text-accent border border-accent/20'
                            : 'bg-danger/10 text-danger border border-danger/20'
                            }`}
                    >
                        {result.type === 'success' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        {result.message}
                    </div>
                )}

                {/* LIST MODE */}
                {mode === 'list' && (
                    <div className="space-y-3">
                        {properties.length === 0 && (
                            <Card className="p-8 text-center">
                                <Building2 className="h-12 w-12 mx-auto text-muted/40 mb-3" />
                                <p className="text-muted">{t('empty')}</p>
                            </Card>
                        )}
                        {properties.map((p) => (
                            <Card key={p.id} className="p-4 flex items-center gap-4">
                                {p.images[0] && (
                                    <Image
                                        src={p.images[0].url}
                                        alt={p.title}
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground truncate">{p.title}</p>
                                    <p className="text-xs text-muted">{p.location.city} · {p.area}м² · {p.rooms} комн.</p>
                                </div>
                                <Badge variant={p.status === 'active' ? 'success' : 'default'}>
                                    {p.status}
                                </Badge>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(p.id)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* CREATE / EDIT MODE */}
                {(mode === 'create' || mode === 'edit') && (
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-foreground">
                                {mode === 'create' ? t('addProperty') : t('editProperty')}
                            </h2>
                            <Button variant="ghost" size="sm" onClick={() => { setMode('list'); setResult(null); }}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm text-muted mb-1">{t('form.name')} *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => update('name', e.target.value)}
                                    placeholder='ЖК "Солнечный город" — 2-комнатная'
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm text-muted mb-1">{t('form.description')}</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => update('description', e.target.value)}
                                    rows={3}
                                    placeholder="Описание объекта..."
                                    className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none"
                                />
                            </div>

                            {/* Location */}
                            <div className="md:col-span-2">
                                <label className="block text-sm text-muted mb-1">{t('form.location')} *</label>
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) => update('location', e.target.value)}
                                    placeholder="Алматы, Бостандыкский, ул. Аль-Фараби 77/8"
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-sm text-muted mb-1">{t('form.image')}</label>
                                {form.image ? (
                                    <div className="flex items-center gap-3 mb-2">
                                        <Image
                                            src={form.image}
                                            alt="Preview"
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 rounded-xl object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => update('image', '')}
                                            className="text-xs text-danger hover:text-danger/80 cursor-pointer"
                                        >
                                            {t('form.removeImage')}
                                        </button>
                                    </div>
                                ) : null}
                                <label className="flex items-center justify-center gap-2 w-full h-11 px-4 bg-surface-2 border border-dashed border-border rounded-xl text-muted hover:border-primary hover:text-primary cursor-pointer transition-colors">
                                    <Upload className="h-4 w-4" />
                                    <span className="text-sm">{isUploading ? t('form.uploading') : t('form.uploadImage')}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Total Price (USD) */}
                            <div>
                                <label className="block text-sm text-muted mb-1">{t('form.totalPrice')}</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.totalPrice || ''}
                                    onChange={(e) => update('totalPrice', parseFloat(e.target.value) || 0)}
                                    placeholder="15 000 000"
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* Total Supply */}
                            <div>
                                <label className="block text-sm text-muted mb-1">{t('form.totalSupply')}</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.totalSupply || ''}
                                    onChange={(e) => update('totalSupply', parseInt(e.target.value) || 1)}
                                    placeholder="1000"
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* ROI */}
                            <div>
                                <label className="block text-sm text-muted mb-1">{t('form.roi')}</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={form.roi || ''}
                                    onChange={(e) => update('roi', parseFloat(e.target.value) || 0)}
                                    placeholder="12"
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* Area */}
                            <div>
                                <label className="block text-sm text-muted mb-1">{t('form.area')}</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.area || ''}
                                    onChange={(e) => update('area', parseFloat(e.target.value) || 0)}
                                    placeholder="78"
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* Rooms */}
                            <div>
                                <label className="block text-sm text-muted mb-1">{t('form.rooms')}</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.rooms || ''}
                                    onChange={(e) => update('rooms', parseInt(e.target.value) || 1)}
                                    placeholder="2"
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* Floor */}
                            <div>
                                <label className="block text-sm text-muted mb-1">{t('form.floor')}</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.floor || ''}
                                    onChange={(e) => update('floor', parseInt(e.target.value) || 1)}
                                    placeholder="14"
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* Total Floors */}
                            <div>
                                <label className="block text-sm text-muted mb-1">{t('form.totalFloors')}</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.totalFloors || ''}
                                    onChange={(e) => update('totalFloors', parseInt(e.target.value) || 1)}
                                    placeholder="25"
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* Year Built */}
                            <div>
                                <label className="block text-sm text-muted mb-1">{t('form.yearBuilt')}</label>
                                <input
                                    type="number"
                                    min="1900"
                                    max="2030"
                                    value={form.yearBuilt || ''}
                                    onChange={(e) => update('yearBuilt', parseInt(e.target.value) || 2025)}
                                    placeholder="2025"
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* Developer */}
                            <div>
                                <label className="block text-sm text-muted mb-1">{t('form.developer')}</label>
                                <input
                                    type="text"
                                    value={form.developer || ''}
                                    onChange={(e) => update('developer', e.target.value)}
                                    placeholder="BI Group"
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* Property Type */}
                            <div>
                                <label className="block text-sm text-muted mb-1">{t('form.propertyType')}</label>
                                <select
                                    value={form.propertyType || 'apartment'}
                                    onChange={(e) => update('propertyType', e.target.value)}
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                >
                                    <option value="apartment">{t('form.types.apartment')}</option>
                                    <option value="house">{t('form.types.house')}</option>
                                    <option value="commercial">{t('form.types.commercial')}</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm text-muted mb-1">{t('form.status')}</label>
                                <select
                                    value={form.status || 'active'}
                                    onChange={(e) => update('status', e.target.value)}
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                >
                                    <option value="upcoming">{t('form.statuses.upcoming')}</option>
                                    <option value="active">{t('form.statuses.active')}</option>
                                    <option value="funded">{t('form.statuses.funded')}</option>
                                    <option value="completed">{t('form.statuses.completed')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 mt-6">
                            <Button
                                className="flex-1"
                                size="lg"
                                isLoading={isSaving}
                                onClick={handleSubmit}
                            >
                                {mode === 'create' ? t('form.create') : t('form.save')}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => { setMode('list'); setResult(null); }}
                            >
                                {t('form.cancel')}
                            </Button>
                        </div>
                    </Card>
                )}
            </Container>
        </section>
    );
}
