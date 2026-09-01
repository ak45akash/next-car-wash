'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { companyValues, siteMetadata } from '../constants';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/steam-wash.jpg"
            alt="About Diamond Steam Car Wash"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.6] scale-110 transition-transform duration-10000 animate-subtle-zoom"
            style={{
              objectPosition: "center 30%"
            }}
          />
        </div>
        <div className="container-custom relative z-10 text-white">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="heading-xl mb-4 font-bold text-5xl">About <span className="text-blue-400">Diamond</span></h1>
            <p className="text-2xl font-light leading-relaxed">
              We are passionate car enthusiasts dedicated to providing 
              the finest car wash experience in {siteMetadata.location.city}.
            </p>
            <div className="mt-8">
              <Link href="/services" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 inline-flex items-center">
                Explore Our Services
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Our Story - Enhanced with motion animations */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-8 text-gray-800 relative">
                Our Story
                {/* <span className="absolute bottom-[-6px] left-0 w-20 h-1 bg-blue-600 mt-2"></span> */}
                <div className="w-24 h-1 bg-blue-600 mb-6"></div>
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Founded in 2015, {siteMetadata.companyName} started as a small car wash service in {siteMetadata.location.city} with 
                just two employees and a passion for cars. Our founder, Raj Patel, noticed 
                that many car wash services in the area weren&apos;t using the right techniques 
                and products, often leaving vehicles with swirl marks and water spots.
              </p>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Determined to provide a better service, Raj invested in professional equipment 
                and eco-friendly products. He also trained his staff in proper washing techniques 
                to ensure every vehicle received the care it deserved.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Today, {siteMetadata.companyName} has grown to multiple locations across Punjab, serving 
                thousands of satisfied customers. Despite our growth, we remain committed 
                to our original mission: providing exceptional car care with attention to 
                detail, using eco-friendly methods, and delivering outstanding customer service.
              </p>
              {/* <div className="mt-8">
                <Link href="/locations" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center group">
                  Find our locations
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
              </div> */}
            </motion.div>
            <motion.div 
              className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Image
                src="/images/dry-clean.jpg"
                alt="Professional car detailing"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <p className="text-sm uppercase tracking-wider">Since 2015</p>
                <h3 className="text-xl font-bold">Professional Car Care</h3>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Our Values - Improved with better visuals */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Our Core Values</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              At {siteMetadata.companyName}, our values guide everything we do. From how we treat our customers 
              to the products we use, these principles are at the heart of our business.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {companyValues.map((value, index) => (
              <motion.div 
                key={value.id}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                  {value.icon === 'shield-check' && (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  )}
                  {value.icon === 'scale' && (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                    </svg>
                  )}
                  {value.icon === 'leaf' && (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65"></path>
                    </svg>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">{value.title}</h3>
                <p className="text-gray-600 text-center text-lg">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team - Enhanced with better design */}
      <section className="py-24">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Our State-of-the-Art Facilities</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Experience the best car wash technology and premium amenities at {siteMetadata.companyName} in {siteMetadata.location.city}.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <div className="relative h-80">
                <Image
                  src="/images/facility-1.jpg"
                  alt="Advanced Washing Equipment"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 border-t border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800">Advanced Washing Equipment</h3>
                <p className="text-blue-600 mb-3 font-medium">Touchless Technology</p>
                <p className="text-gray-600">Our advanced touchless washing system uses high-pressure water jets and specialized cleaning solutions to remove dirt without scratching your vehicle&apos;s paint.</p>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="relative h-80">
                <Image
                  src="/images/detailing.jpg"
                  alt="Detailing Studio"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 border-t border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800">Detailing Studio</h3>
                <p className="text-blue-600 mb-3 font-medium">Professional Grade</p>
                <p className="text-gray-600">Our detailing studio is equipped with professional-grade tools and premium products to restore and protect your vehicle&apos;s appearance.</p>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              viewport={{ once: true }}
            >
              <div className="relative h-80">
                <Image
                  src="/images/facility-3.jpg"
                  alt="Customer Lounge"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 border-t border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800">Customer Lounge</h3>
                <p className="text-blue-600 mb-3 font-medium">Comfort & Convenience</p>
                <p className="text-gray-600">Relax in our comfortable waiting area with complimentary Wi-Fi, refreshments, and a clear view of our wash bay while we service your vehicle.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/detailing.jpg"
            alt="Background"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Experience Premium Car Care Today</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto font-light">
              Join thousands of satisfied customers who trust {siteMetadata.companyName} with their vehicles.
              Our professional team is ready to give your car the care it deserves!
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/book" className="bg-white text-blue-600 hover:bg-gray-100 text-lg font-medium px-10 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 inline-flex items-center">
                Book an Appointment
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </Link>
              <Link href="/contact" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg font-medium px-10 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 inline-flex items-center">
                Contact Us
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </>
  );
} 