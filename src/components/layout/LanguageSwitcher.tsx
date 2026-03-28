'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const switchLocale = (newLocale: string) => {
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPath);
    };

    return (
        <div className="flex items-center rounded-lg border border-border overflow-hidden">
            <button
                type="button"
                onClick={() => switchLocale('ru')}
                className={cn(
                    'px-2 py-1 text-xs font-medium cursor-pointer',
                    locale === 'ru'
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted hover:text-foreground'
                )}
            >
                RU
            </button>
            <button
                type="button"
                onClick={() => switchLocale('en')}
                className={cn(
                    'px-2 py-1 text-xs font-medium cursor-pointer',
                    locale === 'en'
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted hover:text-foreground'
                )}
            >
                EN
            </button>
        </div>
    );
}
