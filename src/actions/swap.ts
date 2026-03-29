'use server';

import { SOL_TO_USD } from '@/lib/constants';
import type { SwapQuote, SwapTransaction } from '@/lib/types';

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

export async function getSwapRate(inputToken: 'USDT' | 'USDS'): Promise<{ rate: number }> {
    const variation = inputToken === 'USDS' ? 0.13 : 0;
    return { rate: SOL_TO_USD + variation };
}

export async function executeSwap(
    inputToken: 'USDT' | 'USDS',
    inputAmount: number,
    wallet: string
): Promise<{
    success: boolean;
    outputAmount: number;
    txHash: string;
    quote: SwapQuote;
}> {
    const rate = SOL_TO_USD + (inputToken === 'USDS' ? 0.13 : 0);
    const feePercent = 0.3;
    const fee = inputAmount * (feePercent / 100);
    const outputAmount = parseFloat(((inputAmount - fee) / rate).toFixed(4));
    const txHash = `swap_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    const quote: SwapQuote = {
        inputToken,
        inputAmount,
        outputAmount,
        rate,
        fee: parseFloat(fee.toFixed(2)),
        feePercent,
    };

    try {
        await apiFetch('/swaps', {
            method: 'POST',
            body: JSON.stringify({
                wallet,
                fromToken: inputToken,
                toToken: 'SOL',
                amountIn: inputAmount,
                amountOut: outputAmount,
                txHash,
            }),
        });
    } catch {
        // записать не удалось — своп всё равно считаем успешным (UI)
    }

    return { success: true, outputAmount, txHash, quote };
}

export async function getSwapHistory(wallet: string): Promise<SwapTransaction[]> {
    try {
        return await apiFetch<SwapTransaction[]>(`/swaps?wallet=${encodeURIComponent(wallet)}`);
    } catch {
        return [];
    }
}
