'use client';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FeaturedProperties } from '@/components/landing/FeaturedProperties';
import { StatsSection } from '@/components/landing/StatsSection';
import { CTASection } from '@/components/landing/CTASection';

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <HowItWorks />
            <FeaturedProperties />
            <StatsSection />
            <CTASection />
        </>
    );
}
