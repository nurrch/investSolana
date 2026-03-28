export type PropertyStatus = 'upcoming' | 'active' | 'funded' | 'completed';
export type PropertyType = 'apartment' | 'house' | 'commercial';

export interface PropertyImage {
    url: string;
    alt: string;
}

export interface Property {
    id: string;
    title: string;
    description: string;
    images: PropertyImage[];
    location: {
        city: string;
        address: string;
        district: string;
    };
    price: {
        totalSOL: number;
        pricePerToken: number;
    };
    tokensTotal: number;
    tokensSold: number;
    roi: number; // expected annual return %
    status: PropertyStatus;
    propertyType: PropertyType;
    area: number; // m²
    rooms: number;
    floor: number;
    totalFloors: number;
    yearBuilt: number;
    developer: string;
    oracleVerified: boolean;
    createdAt: string;
}

export interface Investment {
    id: string;
    propertyId: string;
    propertyTitle: string;
    propertyImage: string;
    amountSOL: number;
    tokensReceived: number;
    date: string;
    roi: number;
    status: 'active' | 'completed' | 'pending';
}

export interface SwapQuote {
    inputToken: 'USDT' | 'USDS';
    inputAmount: number;
    outputAmount: number;
    rate: number;
    fee: number;
    feePercent: number;
}

export interface SwapTransaction {
    id: string;
    inputToken: 'USDT' | 'USDS';
    inputAmount: number;
    outputAmount: number;
    rate: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
}

export interface WalletState {
    address: string | null;
    balance: number; // SOL
    isConnected: boolean;
    tokenBalances: {
        USDT: number;
        USDS: number;
    };
}

export interface PropertyFilters {
    city: string | null;
    priceRange: [number, number] | null;
    roiRange: [number, number] | null;
    rooms: number | null;
    status: PropertyStatus | null;
    propertyType: PropertyType | null;
    sort: 'newest' | 'price-asc' | 'price-desc' | 'roi-desc' | 'progress-desc';
    search: string;
}
