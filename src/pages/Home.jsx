import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Hero from '../components/sections/Hero';
import StorySection from '../components/sections/StorySection';
import ProductGrid from '../components/sections/ProductGrid';
import PackageSection from '../components/sections/PackageSection';
import TrustAndReviews from '../components/sections/TrustAndReviews';
import BlogPreview from '../components/sections/BlogPreview';
import ExitPopup from '../components/ui/ExitPopup';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for payment status in URL query parameters securely
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');

    if (paymentStatus === 'success') {
      toast.success('🎉 পেমেন্ট সফল হয়েছে!');
      navigate('/', { replace: true });
    } else if (paymentStatus === 'failed') {
      toast.error('❌ পেমেন্ট বাতিল বা ব্যর্থ হয়েছে!');
      navigate('/', { replace: true });
    } else if (paymentStatus === 'cancelled') {
      toast.error('⚠️ পেমেন্ট ক্যানসেল করা হয়েছে!');
      navigate('/', { replace: true });
    }
  }, [navigate]);

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
