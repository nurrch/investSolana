'use client';

import { useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Wallet, LogOut } from 'lucide-react';
import { useWalletStore } from '@/store/useWalletStore';
import { getOrCreateUser } from '@/actions/wallet';
import { formatSOL } from '@/lib/utils';

export function WalletButton() {
    const { publicKey, connected, connecting, disconnect: adapterDisconnect } = useWallet();
    const { connection } = useConnection();
    const { setVisible } = useWalletModal();

    const storeConnect = useWalletStore((s) => s.connect);
    const storeDisconnect = useWalletStore((s) => s.disconnect);
    const setBalance = useWalletStore((s) => s.setBalance);
    const setTokenBalance = useWalletStore((s) => s.setTokenBalance);
    const balance = useWalletStore((s) => s.balance);
    const isConnected = useWalletStore((s) => s.isConnected);

    // Sync wallet adapter → store
    useEffect(() => {
        if (connected && publicKey) {
            const addr = publicKey.toBase58();
            storeConnect(addr);
            // Fetch SOL balance from chain
            connection.getBalance(publicKey).then((lamports) => {
                setBalance(lamports / LAMPORTS_PER_SOL);
            }).catch(() => { });
            // Fetch USDT/USDS balances from backend
            getOrCreateUser(addr).then((user) => {
                setTokenBalance('USDT', user.usdt);
                setTokenBalance('USDS', user.usds);
            }).catch(() => { });
        } else if (!connected) {
            storeDisconnect();
        }
    }, [connected, publicKey, connection, storeConnect, storeDisconnect, setBalance, setTokenBalance]);

    const handleClick = () => {
        if (connected) {
            adapterDisconnect();
        } else {
            setVisible(true);
        }
    };

    if (isConnected && publicKey) {
        const addr = publicKey.toBase58();
        const short = `${addr.slice(0, 4)}...${addr.slice(-4)}`;

        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20">
                    <span className="text-sm font-semibold text-accent tabular-nums">
                        {formatSOL(balance)} SOL
                    </span>
                </div>
                <button
                    onClick={handleClick}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-2 border border-border hover:border-primary/40 transition-colors cursor-pointer"
                >
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{short}</span>
                    <LogOut className="h-3 w-3 text-muted" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={connecting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50"
        >
            <Wallet className="h-4 w-4" />
            {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
    );
}
