'use client';

import { create } from 'zustand';
import type { SwapQuote, SwapTransaction } from '@/lib/types';
import { MOCK_SWAP_HISTORY, SOL_TO_USD } from '@/lib/constants';

interface SwapStore {
    inputToken: 'USDT' | 'USDS';
    inputAmount: string;
    quote: SwapQuote | null;
    history: SwapTransaction[];
    isSwapping: boolean;
    error: string | null;

    setInputToken: (token: 'USDT' | 'USDS') => void;
    setInputAmount: (amount: string) => void;
    calculateQuote: () => void;
    addTransaction: (tx: SwapTransaction) => void;
    setSwapping: (swapping: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

export const useSwapStore = create<SwapStore>((set, get) => ({
    inputToken: 'USDT',
    inputAmount: '',
    quote: null,
    history: MOCK_SWAP_HISTORY,
    isSwapping: false,
    error: null,

    setInputToken: (inputToken) => {
        set({ inputToken });
        get().calculateQuote();
    },

    setInputAmount: (inputAmount) => {
        set({ inputAmount });
        get().calculateQuote();
    },

    calculateQuote: () => {
        const { inputAmount, inputToken } = get();
        const amount = parseFloat(inputAmount);
        if (!amount || amount <= 0) {
            set({ quote: null });
            return;
        }
        const rate = SOL_TO_USD;
        const feePercent = 0.3;
        const fee = amount * (feePercent / 100);
        const outputAmount = (amount - fee) / rate;
        set({
            quote: {
                inputToken,
                inputAmount: amount,
                outputAmount: parseFloat(outputAmount.toFixed(4)),
                rate,
                fee: parseFloat(fee.toFixed(2)),
                feePercent,
            },
        });
    },

    addTransaction: (tx) => set((s) => ({ history: [tx, ...s.history] })),

    setSwapping: (isSwapping) => set({ isSwapping }),
    setError: (error) => set({ error }),

    reset: () =>
        set({ inputAmount: '', quote: null, error: null, isSwapping: false }),
}));
