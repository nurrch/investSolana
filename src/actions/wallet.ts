'use server';

import { DEFAULT_WALLET } from '@/lib/constants';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://103.240.147.23:4000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.json();
}

export async function getOrCreateUser(
    wallet: string
): Promise<{ wallet: string; balance: number; usdt: number; usds: number }> {
    try {
        return await apiFetch(`/users/${encodeURIComponent(wallet)}`);
    } catch {
        return {
            wallet,
            balance: DEFAULT_WALLET.balance,
            usdt: DEFAULT_WALLET.tokenBalances.USDT,
            usds: DEFAULT_WALLET.tokenBalances.USDS,
        };
    }
}

export async function getBalance(
    address: string
): Promise<{ sol: number; usdt: number; usds: number }> {
    try {
        const user = await apiFetch<{ balance: number; usdt: number; usds: number }>(
            `/users/${encodeURIComponent(address)}`
        );
        return { sol: user.balance, usdt: user.usdt, usds: user.usds };
    } catch {
        return {
            sol: DEFAULT_WALLET.balance,
            usdt: DEFAULT_WALLET.tokenBalances.USDT,
            usds: DEFAULT_WALLET.tokenBalances.USDS,
        };
    }
}
