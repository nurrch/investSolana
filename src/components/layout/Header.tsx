'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Building2 } from 'lucide-react';
import { BalanceBadge } from './BalanceBadge';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
    const t = useTranslations('common');
    const locale = useLocale();

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-foreground hidden sm:block">
                        {t('logo')}
                    </span>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    <BalanceBadge />
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    );
}
