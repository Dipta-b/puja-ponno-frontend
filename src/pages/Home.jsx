import React from 'react';
import Hero from '../components/sections/Hero';
import StorySection from '../components/sections/StorySection';
import ProductGrid from '../components/sections/ProductGrid';
import PackageSection from '../components/sections/PackageSection';
import TrustAndReviews from '../components/sections/TrustAndReviews';
import BlogPreview from '../components/sections/BlogPreview';
import ExitPopup from '../components/ui/ExitPopup';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp';

export default function Home() {
  return (
    <>
      <Hero />
      <StorySection />
      <ProductGrid />
      <PackageSection />
      <TrustAndReviews />
      <BlogPreview />
      <ExitPopup />
      <FloatingWhatsApp />
    </>
  );
}
