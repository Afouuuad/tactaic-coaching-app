import React from 'react';
import Navbar from '../shared/Navbar';
import HeroSection from './HeroSection';
import Footer from '../shared/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px]">
      <HeroSection />
      <Footer />
    </div>
  );
};

export default Home;
