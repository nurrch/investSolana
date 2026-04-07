'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Home, Building2, ArrowLeftRight, Briefcase, HousePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { key: 'home', href: '', icon: Home },
    { key: 'properties', href: '/properties', icon: Building2 },
    { key: 'swap', href: '/swap', icon: ArrowLeftRight },
    { key: 'portfolio', href: '/portfolio', icon: Briefcase },
    { key: 'admin', href: '/admin', icon: HousePlus },
] as const;

export function SideNav() {
    const t = useTranslations('common.nav');
    const locale = useLocale();
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (!pathname) return false;
        const full = `/${locale}${href}`;
        if (href === '') return pathname === `/${locale}` || pathname === `/${locale}/`;
        return pathname.startsWith(full);
    };

    return (
        <nav className="fixed bottom-4 left-[5%] z-50">
            <div className="flex items-center gap-1 px-2 py-2 rounded-2xl bg-surface/90 backdrop-blur-sm border border-border shadow-lg">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.key}
                            href={`/${locale}${item.href}`}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm',
                                'transition-all duration-300 ease-out',
                                active
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted hover:text-foreground hover:bg-surface-2'
                            )}
                        >
                            <Icon className={cn(
                                'h-4 w-4 transition-transform duration-300',
                                active && 'scale-110'
                            )} />
                            <span className="hidden sm:inline text-xs font-medium">
                                {t(item.key)}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
