'use client';

import { create } from 'zustand';
import type { Property, PropertyFilters, Investment } from '@/lib/types';
import { getProperties, getInvestmentsByWallet } from '@/actions/properties';

interface PropertiesStore {
    properties: Property[];
    filteredProperties: Property[];
    selectedProperty: Property | null;
    investments: Investment[];
    filters: PropertyFilters;
    isLoading: boolean;

    loadProperties: (force?: boolean) => Promise<void>;
    loadInvestments: (wallet: string) => Promise<void>;
    setProperties: (properties: Property[]) => void;
    setSelectedProperty: (property: Property | null) => void;
    setFilters: (filters: Partial<PropertyFilters>) => void;
    resetFilters: () => void;
    setLoading: (loading: boolean) => void;
    addInvestment: (investment: Investment) => void;
    applyFilters: () => void;
}

const defaultFilters: PropertyFilters = {
    city: null,
    priceRange: null,
    roiRange: null,
    rooms: null,
    status: null,
    propertyType: null,
    sort: 'newest',
    search: '',
};

function filterProperties(properties: Property[], filters: PropertyFilters): Property[] {
    let result = [...properties];

    if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.location.city.toLowerCase().includes(q) ||
                p.location.address.toLowerCase().includes(q)
        );
    }

    if (filters.city) {
        result = result.filter((p) => p.location.city === filters.city);
    }

    if (filters.rooms) {
        result = result.filter((p) => p.rooms === filters.rooms);
    }

    if (filters.status) {
        result = result.filter((p) => p.status === filters.status);
    }

    if (filters.propertyType) {
        result = result.filter((p) => p.propertyType === filters.propertyType);
    }

    if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        result = result.filter((p) => p.price.totalSOL >= min && p.price.totalSOL <= max);
    }

    if (filters.roiRange) {
        const [min, max] = filters.roiRange;
        result = result.filter((p) => p.roi >= min && p.roi <= max);
    }

    switch (filters.sort) {
        case 'price-asc':
            result.sort((a, b) => a.price.totalSOL - b.price.totalSOL);
            break;
        case 'price-desc':
            result.sort((a, b) => b.price.totalSOL - a.price.totalSOL);
            break;
        case 'roi-desc':
            result.sort((a, b) => b.roi - a.roi);
            break;
        case 'progress-desc':
            result.sort((a, b) => b.tokensSold / b.tokensTotal - a.tokensSold / a.tokensTotal);
            break;
        case 'newest':
        default:
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
    }

    return result;
}

export const usePropertiesStore = create<PropertiesStore>((set, get) => ({
    properties: [],
    filteredProperties: [],
    selectedProperty: null,
    investments: [],
    filters: { ...defaultFilters },
    isLoading: false,

    loadProperties: async (force?: boolean) => {
        const { properties } = get();
        if (!force && properties.length > 0) return;
        set({ isLoading: true });
        const data = await getProperties(force);
        const { filters } = get();
        set({
            properties: data,
            filteredProperties: filterProperties(data, filters),
            isLoading: false,
        });
    },

    loadInvestments: async (wallet: string) => {
        try {
            const data = await getInvestmentsByWallet(wallet);
            const { investments: local } = get();
            // Merge: backend data + any local investments not yet persisted
            const backendIds = new Set(data.map((d) => d.id));
            const unsaved = local.filter((l) => !backendIds.has(l.id));
            set({ investments: [...data, ...unsaved] });
        } catch {
            // keep existing investments
        }
    },

    setProperties: (properties) => {
        set({ properties });
        const { filters } = get();
        set({ filteredProperties: filterProperties(properties, filters) });
    },

    setSelectedProperty: (property) => set({ selectedProperty: property }),

    setFilters: (newFilters) => {
        const filters = { ...get().filters, ...newFilters };
        set({ filters, filteredProperties: filterProperties(get().properties, filters) });
    },

    resetFilters: () => {
        set({ filters: { ...defaultFilters } });
        set({ filteredProperties: filterProperties(get().properties, defaultFilters) });
    },

    setLoading: (isLoading) => set({ isLoading }),

    addInvestment: (investment) =>
        set((s) => ({ investments: [investment, ...s.investments] })),

    applyFilters: () => {
        const { properties, filters } = get();
        set({ filteredProperties: filterProperties(properties, filters) });
    },
}));
