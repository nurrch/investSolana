'use client';

import { create } from 'zustand';
import type { WalletState } from '@/lib/types';

interface WalletStore extends WalletState {
    setBalance: (balance: number) => void;
    addBalance: (amount: number) => void;
    subtractBalance: (amount: number) => void;
    setTokenBalance: (token: 'USDT' | 'USDS', amount: number) => void;
    connect: (address: string) => void;
    disconnect: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
    address: null,
    balance: 0,
    isConnected: false,
    tokenBalances: { USDT: 0, USDS: 0 },

    setBalance: (balance) => set({ balance }),
    addBalance: (amount) => set((s) => ({ balance: s.balance + amount })),
    subtractBalance: (amount) =>
        set((s) => ({ balance: Math.max(0, s.balance - amount) })),
    setTokenBalance: (token, amount) =>
        set((s) => ({
            tokenBalances: { ...s.tokenBalances, [token]: amount },
        })),
    connect: (address) => set({ address, isConnected: true }),
    disconnect: () =>
        set({ address: null, isConnected: false, balance: 0, tokenBalances: { USDT: 0, USDS: 0 } }),
}));
