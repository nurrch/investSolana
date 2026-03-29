'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowDownUp, Info, Check, ChevronDown, Wallet } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useSwapStore } from '@/store/useSwapStore';
import { useWalletStore } from '@/store/useWalletStore';
import { executeSwap } from '@/actions/swap';
import { formatSOL, formatNumber } from '@/lib/utils';
import type { SwapTransaction } from '@/lib/types';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export default function SwapPage() {
    const t = useTranslations('swap');
    const {
        inputToken,
        inputAmount,
        quote,
        history,
        isSwapping,
        setInputToken,
        setInputAmount,
        addTransaction,
        loadHistory,
        setSwapping,
        reset,
    } = useSwapStore();

    const balance = useWalletStore((s) => s.balance);
    const walletAddress = useWalletStore((s) => s.address);
    const isConnected = useWalletStore((s) => s.isConnected);
    const tokenBalances = useWalletStore((s) => s.tokenBalances);
    const addBalance = useWalletStore((s) => s.addBalance);
    const setTokenBalance = useWalletStore((s) => s.setTokenBalance);
    const { setVisible } = useWalletModal();

    const [success, setSuccess] = useState<{ amount: number } | null>(null);

    useEffect(() => {
        if (walletAddress) loadHistory(walletAddress);
    }, [walletAddress, loadHistory]);

    const currentBalance = tokenBalances[inputToken];
    const amountNum = parseFloat(inputAmount) || 0;
    const insufficient = amountNum > currentBalance;
    const canSwap = amountNum > 0 && !insufficient && quote !== null;

    const handleSwap = async () => {
        if (!canSwap || !quote || !walletAddress) return;

        setSwapping(true);

        const result = await executeSwap(inputToken, amountNum, walletAddress);

        addBalance(result.outputAmount);
        setTokenBalance(inputToken, currentBalance - amountNum);

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
    };

    if (!isConnected) {
        return (
            <section className="py-20">
                <Container className="max-w-xl text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10 mb-6 mx-auto">
                        <Wallet className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3">Подключите кошелёк</h1>
                    <p className="text-muted mb-8">Для обмена токенов необходимо подключить Solana-кошелёк</p>
                    <Button size="lg" onClick={() => setVisible(true)}>
                        Connect Wallet
                    </Button>
                </Container>
            </section>
        );
    }

    return (
        <section className="py-12">
            <Container className="max-w-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('title')}</h1>
                    <p className="text-muted text-lg">{t('subtitle')}</p>
                </div>

                {/* Swap Card */}
                <Card variant="glass" className="p-6 sm:p-8 mb-8">
                    {success ? (
                        <div className="text-center py-8 space-y-4">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mx-auto">
                                <Check className="h-8 w-8 text-accent" />
                            </div>
                            <p className="text-xl font-semibold text-accent">{t('success')}</p>
                            <p className="text-muted">
                                {t('received')}: <span className="text-foreground font-bold">{formatSOL(success.amount)} SOL</span>
                            </p>
                            <Button variant="outline" onClick={() => setSuccess(null)}>
                                Ещё раз
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* From */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted">{t('from')}</span>
                                    <span className="text-muted">
                                        {t('balance')}: <span className="text-foreground">{formatNumber(currentBalance)}</span>
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <select
                                            value={inputToken}
                                            onChange={(e) => setInputToken(e.target.value as 'USDT' | 'USDS')}
                                            className="h-12 pl-3 pr-8 bg-surface-2 border border-border rounded-xl text-sm font-medium text-foreground appearance-none focus:outline-none focus:border-primary cursor-pointer"
                                        >
                                            <option value="USDT">USDT</option>
                                            <option value="USDS">USDS</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                                    </div>
                                    <div className="relative flex-1">
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={inputAmount}
                                            onChange={(e) => setInputAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full h-12 px-4 bg-surface-2 border border-border rounded-xl text-lg font-medium text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setInputAmount(String(currentBalance))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary-hover font-medium cursor-pointer"
                                        >
                                            MAX
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-surface-2 border border-border">
                                    <ArrowDownUp className="h-4 w-4 text-muted" />
                                </div>
                            </div>

                            {/* To */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted">{t('to')}</span>
                                    <span className="text-muted">
                                        {t('balance')}: <span className="text-foreground">{formatSOL(balance)} SOL</span>
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-12 px-4 flex items-center bg-surface-3 rounded-xl text-sm font-medium text-foreground">
                                        SOL
                                    </div>
                                    <div className="flex-1 h-12 px-4 flex items-center bg-surface-3 rounded-xl text-lg font-medium text-foreground">
                                        {quote ? formatSOL(quote.outputAmount) : '0.00'}
                                    </div>
                                </div>
                            </div>

                            {/* Rate & Fee */}
                            {quote && (
                                <div className="space-y-2 px-4 py-3 rounded-xl bg-surface-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted">{t('rate')}</span>
                                        <span className="text-foreground">1 SOL ≈ {formatNumber(quote.rate)} {inputToken}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted">{t('fee')}</span>
                                        <span className="text-foreground">{quote.fee} {inputToken} ({quote.feePercent}%)</span>
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {insufficient && (
                                <p className="text-sm text-danger text-center">{t('insufficientBalance')}</p>
                            )}

                            {/* Button */}
                            <Button
                                className="w-full"
                                size="lg"
                                disabled={!canSwap}
                                isLoading={isSwapping}
                                onClick={handleSwap}
                            >
                                {isSwapping ? t('swapping') : amountNum > 0 ? `${t('swapButton')} ${formatNumber(amountNum)} ${inputToken}` : t('enterAmount')}
                            </Button>
                        </div>
                    )}
                </Card>

                {/* How it works */}
                <Card className="p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Info className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">{t('howItWorks.title')}</h3>
                    </div>
                    <ol className="space-y-2 text-sm text-muted">
                        <li className="flex gap-3">
                            <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                            {t('howItWorks.step1')}
                        </li>
                        <li className="flex gap-3">
                            <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                            {t('howItWorks.step2')}
                        </li>
                        <li className="flex gap-3">
                            <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                            {t('howItWorks.step3')}
                        </li>
                        <li className="flex gap-3">
                            <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                            {t('howItWorks.step4')}
                        </li>
                    </ol>
                </Card>

                {/* History */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{t('history.title')}</h3>
                    {history.length === 0 ? (
                        <p className="text-sm text-muted text-center py-4">{t('history.empty')}</p>
                    ) : (
                        <div className="space-y-3">
                            {history.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                                            <ArrowDownUp className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">
                                                {formatNumber(tx.inputAmount)} {tx.inputToken} → {formatSOL(tx.outputAmount)} SOL
                                            </div>
                                            <div className="text-xs text-muted">{tx.date}</div>
                                        </div>
                                    </div>
                                    <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}>
                                        {tx.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </Container>
        </section>
    );
}
