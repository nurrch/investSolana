'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWalletStore } from '@/store/useWalletStore';
import { usePropertiesStore } from '@/store/usePropertiesStore';
import { investInProperty } from '@/actions/properties';
import { formatSOL } from '@/lib/utils';
import type { Property, Investment } from '@/lib/types';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

interface InvestFormProps {
    property: Property;
}

export function InvestForm({ property }: InvestFormProps) {
    const t = useTranslations('property.investment');
    const balance = useWalletStore((s) => s.balance);
    const walletAddress = useWalletStore((s) => s.address);
    const isConnected = useWalletStore((s) => s.isConnected);
    const subtractBalance = useWalletStore((s) => s.subtractBalance);
    const addInvestment = usePropertiesStore((s) => s.addInvestment);
    const { setVisible } = useWalletModal();

    const [amount, setAmount] = useState('');
    const [isInvesting, setIsInvesting] = useState(false);
    const [success, setSuccess] = useState<{ tokens: number } | null>(null);

    const amountNum = parseFloat(amount) || 0;
    const tokensReceived = Math.floor(amountNum / property.price.pricePerToken);
    const insufficient = amountNum > balance;
    const canInvest = amountNum > 0 && !insufficient && tokensReceived > 0;

    const handleInvest = async () => {
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
    };

    if (!isConnected) {
        return (
            <div className="text-center py-6 space-y-3">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mx-auto">
                    <Wallet className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted">Подключите кошелёк для инвестирования</p>
                <Button onClick={() => setVisible(true)}>Connect Wallet</Button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center py-4 space-y-3">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 mx-auto">
                    <Check className="h-6 w-6 text-accent" />
                </div>
                <p className="text-sm font-semibold text-accent">{t('success')}</p>
                <p className="text-sm text-muted">
                    {t('tokensReceived')}: <span className="text-foreground font-medium">{success.tokens}</span>
                </p>
                <Button variant="outline" size="sm" onClick={() => setSuccess(null)}>
                    Ещё раз
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Amount input */}
            <div>
                <label className="block text-sm text-muted mb-1.5">{t('amount')}</label>
                <div className="relative">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-11 px-4 pr-14 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">
                        SOL
                    </span>
                </div>
                <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-muted">
                        Баланс: {formatSOL(balance)} SOL
                    </span>
                    <button
                        type="button"
                        onClick={() => setAmount(String(Math.min(balance, (property.tokensTotal - property.tokensSold) * property.price.pricePerToken)))}
                        className="text-xs text-primary hover:text-primary-hover cursor-pointer"
                    >
                        MAX
                    </button>
                </div>
            </div>

            {/* Tokens preview */}
            {amountNum > 0 && (
                <div className="flex justify-between text-sm py-2 px-3 rounded-lg bg-surface-2">
                    <span className="text-muted">{t('tokensReceive')}</span>
                    <span className="font-semibold text-accent">{tokensReceived}</span>
                </div>
            )}

            {/* Error */}
            {insufficient && (
                <p className="text-xs text-danger">{t('insufficientBalance')}</p>
            )}

            {/* Button */}
            <Button
                className="w-full"
                size="lg"
                disabled={!canInvest}
                isLoading={isInvesting}
                onClick={handleInvest}
            >
                {t('investButton')} {amountNum > 0 && `${formatSOL(amountNum)} SOL`}
            </Button>
        </div>
    );
}
