'use client';

import { useWalletStore } from '@/store/useWalletStore';
import { formatSOL } from '@/lib/utils';
import { Coins } from 'lucide-react';

export function BalanceBadge() {
    const balance = useWalletStore((s) => s.balance);

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20">
            <Coins className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-accent tabular-nums">
                {formatSOL(balance)} SOL
            </span>
        </div>
    );
}
