'use server';

import { sleep } from '@/lib/utils';
import { DEFAULT_WALLET } from '@/lib/constants';

export async function getBalance(
    _address: string
): Promise<{ sol: number; usdt: number; usds: number }> {
    await sleep(200);
    return {
        sol: DEFAULT_WALLET.balance,
        usdt: DEFAULT_WALLET.tokenBalances.USDT,
        usds: DEFAULT_WALLET.tokenBalances.USDS,
    };
}

export async function getTransactions(
    _address: string
): Promise<
    { id: string; type: string; amount: number; date: string; status: string }[]
> {
    await sleep(300);
    return [
        { id: 'tx-1', type: 'invest', amount: -25.5, date: '2026-02-10', status: 'completed' },
        { id: 'tx-2', type: 'swap', amount: 5.86, date: '2026-03-20', status: 'completed' },
        { id: 'tx-3', type: 'invest', amount: -15.0, date: '2026-02-28', status: 'completed' },
        { id: 'tx-4', type: 'swap', amount: 2.93, date: '2026-03-25', status: 'completed' },
    ];
}
