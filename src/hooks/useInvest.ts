'use client';

import { useState, useCallback } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { usePropertiesStore } from '@/store/usePropertiesStore';
import { investInProperty } from '@/actions/properties';
import type { Property, Investment } from '@/lib/types';

export function useInvest(property: Property) {
    const balance = useWalletStore((s) => s.balance);
    const walletAddress = useWalletStore((s) => s.address);
    const isConnected = useWalletStore((s) => s.isConnected);
    const subtractBalance = useWalletStore((s) => s.subtractBalance);
    const addInvestment = usePropertiesStore((s) => s.addInvestment);

    const [amount, setAmount] = useState('');
    const [isInvesting, setIsInvesting] = useState(false);
    const [success, setSuccess] = useState<{ tokens: number } | null>(null);

    const amountNum = parseFloat(amount) || 0;
    const tokensReceived = Math.floor(amountNum / property.price.pricePerToken);
    const insufficient = amountNum > balance;
    const canInvest = amountNum > 0 && !insufficient && tokensReceived > 0;
    const maxAmount = Math.min(
        balance,
        (property.tokensTotal - property.tokensSold) * property.price.pricePerToken
    );

    const handleInvest = useCallback(async () => {
        if (!canInvest || !walletAddress) return;

        setIsInvesting(true);

        const result = await investInProperty(
            property.id,
            walletAddress,
            amountNum,
            tokensReceived
        );

        if (result.success) {
            subtractBalance(amountNum);

            const investment: Investment = {
                id: `inv-${Date.now()}`,
                propertyId: property.id,
                propertyTitle: property.title,
                propertyImage: property.images[0]?.url ?? '',
                amountSOL: amountNum,
                tokensReceived,
                date: new Date().toISOString().split('T')[0],
                roi: property.roi,
                status: 'active',
            };
            addInvestment(investment);
            setSuccess({ tokens: tokensReceived });
        }

        setIsInvesting(false);
        setAmount('');
    }, [canInvest, walletAddress, property, amountNum, tokensReceived, subtractBalance, addInvestment]);

    const clearSuccess = useCallback(() => setSuccess(null), []);
    const setMax = useCallback(() => setAmount(String(maxAmount)), [maxAmount]);

    return {
        balance,
        isConnected,
        amount,
        setAmount,
        amountNum,
        tokensReceived,
        insufficient,
        canInvest,
        isInvesting,
        success,
        handleInvest,
        clearSuccess,
        setMax,
    };
}
