'use client';

import { useTranslations } from 'next-intl';
import { Plus, Trash2, Edit2, Upload, Check, X, Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAdmin } from '@/hooks/useAdmin';
import { useLocale } from 'next-intl';

export default function AdminPage() {
    const locale = useLocale();
    const t = useTranslations('admin');
    const {
        properties,
        mode,
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
    } = useAdmin();

    const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await handleImageUpload(file);
        e.target.value = '';
    };

    const onDelete = async (id: string) => {
        if (!confirm(t('confirmDelete'))) return;
        const res = await handleDelete(id);
        if (res.success) {
            setResult({ type: 'success', message: t('deleted') });
        }
    };

    const onSubmit = async () => {
        if (!form.name || !form.location) {
            setResult({ type: 'error', message: t('requiredFields') });
            return;
        }
        const res = await handleSubmit();
        if (res.success) {
            setResult({ type: 'success', message: mode === 'edit' ? t('updated') : t('created') });
        } else if (res.error) {
            setResult({ type: 'error', message: res.error });
        }
    };

    return (
        <section className="py-8 min-h-screen">
            <Container>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link href={`/${locale}/properties`}>
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
                                    <Button variant="danger" size="sm" onClick={() => onDelete(p.id)}>
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
                            <Button variant="ghost" size="sm" onClick={cancelEdit}>
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
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder='ЖК "Солнечный город" — 2-комнатная'
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm text-muted mb-1">{t('form.description')}</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => updateField('description', e.target.value)}
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
                                    onChange={(e) => updateField('location', e.target.value)}
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
                                            onClick={() => updateField('image', '')}
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
                                        onChange={onImageUpload}
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
                                    onChange={(e) => updateField('totalPrice', parseFloat(e.target.value) || 0)}
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
                                    onChange={(e) => updateField('totalSupply', parseInt(e.target.value) || 1)}
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
                                    onChange={(e) => updateField('roi', parseFloat(e.target.value) || 0)}
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
                                    onChange={(e) => updateField('area', parseFloat(e.target.value) || 0)}
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
                                    onChange={(e) => updateField('rooms', parseInt(e.target.value) || 1)}
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
                                    onChange={(e) => updateField('floor', parseInt(e.target.value) || 1)}
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
                                    onChange={(e) => updateField('totalFloors', parseInt(e.target.value) || 1)}
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
                                    onChange={(e) => updateField('yearBuilt', parseInt(e.target.value) || 2025)}
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
                                    onChange={(e) => updateField('developer', e.target.value)}
                                    placeholder="BI Group"
                                    className="w-full h-11 px-4 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            {/* Property Type */}
                            <div>
                                <label className="block text-sm text-muted mb-1">{t('form.propertyType')}</label>
                                <select
                                    value={form.propertyType || 'apartment'}
                                    onChange={(e) => updateField('propertyType', e.target.value)}
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
                                    onChange={(e) => updateField('status', e.target.value)}
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
                                onClick={onSubmit}
                            >
                                {mode === 'create' ? t('form.create') : t('form.save')}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={cancelEdit}
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
