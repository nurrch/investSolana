'use client';

import { useEffect } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { usePropertiesStore } from '@/store/usePropertiesStore';
import { formatSOL } from '@/lib/utils';

export function usePortfolio() {
    const balance = useWalletStore((s) => s.balance);
    const walletAddress = useWalletStore((s) => s.address);
    const isConnected = useWalletStore((s) => s.isConnected);
    const investments = usePropertiesStore((s) => s.investments);
    const loadInvestments = usePropertiesStore((s) => s.loadInvestments);

    useEffect(() => {
        if (walletAddress) loadInvestments(walletAddress);
    }, [walletAddress, loadInvestments]);

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amountSOL, 0);
    const totalReturns = investments
        .filter((i) => i.status === 'active')
        .reduce((sum, inv) => sum + inv.amountSOL * (inv.roi / 100), 0);
    const activeCount = investments.filter((i) => i.status === 'active').length;

    return {
        balance,
        walletAddress,
        isConnected,
        investments,
        totalInvested,
        totalReturns,
        activeCount,
        formattedBalance: `${formatSOL(balance)} SOL`,
        formattedInvested: `${formatSOL(totalInvested)} SOL`,
        formattedReturns: `${formatSOL(totalReturns)} SOL`,
    };
}
