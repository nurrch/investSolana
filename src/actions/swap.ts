'use server';

import { sleep } from '@/lib/utils';
import { SOL_TO_USD } from '@/lib/constants';
import type { SwapQuote } from '@/lib/types';

export async function getSwapRate(inputToken: 'USDT' | 'USDS'): Promise<{ rate: number }> {
    await sleep(200);
    // Slight variation for realism
    const variation = inputToken === 'USDS' ? 0.13 : 0;
    return { rate: SOL_TO_USD + variation };
}

export async function executeSwap(
    inputToken: 'USDT' | 'USDS',
    inputAmount: number
): Promise<{
    success: boolean;
    outputAmount: number;
    txHash: string;
    quote: SwapQuote;
}> {
    await sleep(1200);

    const rate = SOL_TO_USD + (inputToken === 'USDS' ? 0.13 : 0);
    const feePercent = 0.3;
    const fee = inputAmount * (feePercent / 100);
    const outputAmount = parseFloat(((inputAmount - fee) / rate).toFixed(4));

    return {
        success: true,
        outputAmount,
        txHash: `swap_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        quote: {
            inputToken,
            inputAmount,
            outputAmount,
            rate,
            fee: parseFloat(fee.toFixed(2)),
            feePercent,
        },
    };
}
