import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import SocialProof from '@/components/landing/SocialProof';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSplit from '@/components/landing/HowItWorksSplit';
import StatsSection from '@/components/landing/StatsSection';
import TestimonialSection from '@/components/landing/TestimonialSection';
import CTASection from '@/components/landing/CTASection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#0f0f1a]">
      <Navbar />
      <main className="flex-1 pt-0">
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <HowItWorksSplit />
        <StatsSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
