import React from 'react';
import Hero from '../components/home/Hero';
import DestinationPreview from '../components/home/DestinationPreview';
import FleetPreview from '../components/home/FleetPreview';
import WhyChooseUs from '../components/home/WhyChooseUs';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import FinalCTA from '../components/home/FinalCTA';

export const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <DestinationPreview />
      <FleetPreview />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
    </div>
  );
};

export default Home;
