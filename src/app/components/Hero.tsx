'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Animation */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/exterior-detailing.jpg"
          alt="Car washing"
          fill
          priority
          className="object-cover brightness-[0.6] scale-110 transition-transform duration-10000 animate-subtle-zoom"
          style={{
            objectPosition: "center 25%"
          }}
        />
      </div>

      {/* Animated Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-black/30 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Content */}
      <div className="container-custom relative z-10 text-white">
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            <span className="text-blue-400">Diamond</span> Steam Car Wash in Mohali
          </h1>
          <p className="text-xl mb-8 font-light leading-relaxed">
            Experience the ultimate car care with our professional washing and detailing services. 
            We bring back the shine to your vehicle with eco-friendly methods.
          </p>
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/book" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 inline-flex items-center shadow-lg">
              Book Now
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </Link>
            <Link href="/services" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 inline-flex items-center">
              Our Services
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Feature Badges */}
      <div className="absolute bottom-12 left-0 right-0 z-10">
        <div className="container-custom">
          <motion.div 
            className="flex flex-wrap justify-center gap-4 md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white border border-white/20 flex items-center shadow-lg">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span className="font-medium">Premium Quality</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white border border-white/20 flex items-center shadow-lg">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span className="font-medium">Fast Service</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white border border-white/20 flex items-center shadow-lg">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65"></path>
              </svg>
              <span className="font-medium">Eco-Friendly</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 