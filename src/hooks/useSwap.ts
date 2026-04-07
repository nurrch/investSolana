'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSwapStore } from '@/store/useSwapStore';
import { useWalletStore } from '@/store/useWalletStore';
import { executeSwap } from '@/actions/swap';
import { getOrCreateUser } from '@/actions/wallet';
import type { SwapTransaction } from '@/lib/types';

export function useSwap() {
    const inputToken = useSwapStore((s) => s.inputToken);
    const inputAmount = useSwapStore((s) => s.inputAmount);
    const quote = useSwapStore((s) => s.quote);
    const history = useSwapStore((s) => s.history);
    const isSwapping = useSwapStore((s) => s.isSwapping);
    const setInputToken = useSwapStore((s) => s.setInputToken);
    const setInputAmount = useSwapStore((s) => s.setInputAmount);
    const addTransaction = useSwapStore((s) => s.addTransaction);
    const loadHistory = useSwapStore((s) => s.loadHistory);
    const setSwapping = useSwapStore((s) => s.setSwapping);
    const reset = useSwapStore((s) => s.reset);

    const balance = useWalletStore((s) => s.balance);
    const walletAddress = useWalletStore((s) => s.address);
    const isConnected = useWalletStore((s) => s.isConnected);
    const tokenBalances = useWalletStore((s) => s.tokenBalances);
    const addBalance = useWalletStore((s) => s.addBalance);
    const setTokenBalance = useWalletStore((s) => s.setTokenBalance);

    const [success, setSuccess] = useState<{ amount: number } | null>(null);

    useEffect(() => {
        if (walletAddress) loadHistory(walletAddress);
    }, [walletAddress, loadHistory]);

    const currentBalance = tokenBalances[inputToken];
    const amountNum = parseFloat(inputAmount) || 0;
    const insufficient = amountNum > currentBalance;
    const canSwap = amountNum > 0 && !insufficient && quote !== null;

    const handleSwap = useCallback(async () => {
        if (!canSwap || !quote || !walletAddress) return;

        setSwapping(true);

        const result = await executeSwap(inputToken, amountNum, walletAddress);

        addBalance(result.outputAmount);
        setTokenBalance(inputToken, currentBalance - amountNum);

        // Refresh real balances from backend
        getOrCreateUser(walletAddress).then((user) => {
            setTokenBalance('USDT', user.usdt);
            setTokenBalance('USDS', user.usds);
        }).catch(() => { });

        const tx: SwapTransaction = {
            id: `sw-${Date.now()}`,
            inputToken,
            inputAmount: amountNum,
            outputAmount: result.outputAmount,
            rate: result.quote.rate,
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
        };
        addTransaction(tx);

        setSuccess({ amount: result.outputAmount });
        setSwapping(false);
        reset();
    }, [canSwap, quote, walletAddress, inputToken, amountNum, currentBalance, setSwapping, addBalance, setTokenBalance, addTransaction, reset]);

    const clearSuccess = useCallback(() => setSuccess(null), []);

    return {
        inputToken,
        inputAmount,
        quote,
        history,
        isSwapping,
        balance,
        walletAddress,
        isConnected,
        tokenBalances,
        currentBalance,
        amountNum,
        insufficient,
        canSwap,
        success,
        setInputToken,
        setInputAmount,
        handleSwap,
        clearSuccess,
    };
}
