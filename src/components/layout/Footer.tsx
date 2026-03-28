'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Building2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export function Footer({ className }: { className?: string }) {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <footer className={cn('border-t border-border bg-surface/50 mt-auto', className)}>
            <Container className="py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <Building2 className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-foreground">{t('common.logo')}</span>
                        </div>
                        <p className="text-sm text-muted leading-relaxed">
                            {t('footer.description')}
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">{t('footer.links.about')}</h4>
                        <div className="flex flex-col gap-2">
                            <Link href={`/${locale}/properties`} className="text-sm text-muted hover:text-foreground">
                                {t('footer.links.properties')}
                            </Link>
                            <Link href={`/${locale}#how-it-works`} className="text-sm text-muted hover:text-foreground">
                                {t('footer.links.howItWorks')}
                            </Link>
                            <span className="text-sm text-muted/50 cursor-not-allowed">
                                {t('footer.links.faq')}
                            </span>
                        </div>
                    </div>

                    {/* Legal */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">{t('footer.links.terms')}</h4>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-muted/50 cursor-not-allowed">
                                {t('footer.links.terms')}
                            </span>
                            <span className="text-sm text-muted/50 cursor-not-allowed">
                                {t('footer.links.privacy')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted">
                        &copy; {new Date().getFullYear()} InvestInvincible. {t('footer.rights')}.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted">
                        <div className="h-4 w-4 rounded-full bg-primary" />
                        {t('common.poweredBy')}
                    </div>
                </div>
            </Container>
        </footer>
    );
}
