'use client';

import { useCallback, useMemo } from 'react';
import { Buffer } from 'buffer';
import { type WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

import '@solana/wallet-adapter-react-ui/styles.css';

// Polyfill Buffer for @solana/web3.js in browser
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || Buffer;
}

const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
    // Empty array — Wallet Standard auto-detects Phantom, Solflare, etc.
    const wallets = useMemo(() => [], []);

    const onError = useCallback((error: WalletError) => {
        console.error('[Wallet]', error);
    }, []);

    return (
        <ConnectionProvider endpoint={RPC_ENDPOINT}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
