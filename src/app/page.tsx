'use client';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import ProcessSection from './components/ProcessSection';
import StatsSection from './components/StatsSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ServicesSection />
      <ProcessSection />
      <StatsSection />
      <WhyChooseUsSection />
      <Benefits />
      <Testimonials />
      <Footer />
    </>
  );
}
