'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fullServicesList } from '../constants';

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/ppf.jpg"
            alt="Car detailing"
            fill
            priority
            className="object-cover brightness-[0.6] scale-110 transition-transform duration-10000 animate-subtle-zoom"
          />
        </div>
        {/* Animated Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-black/30 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="container-custom relative z-10 text-white">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="heading-xl mb-4">Our Services</h1>
            <p className="text-xl">
              We offer a wide range of professional car washing and detailing services 
              to keep your vehicle looking its best.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Services List */}
      <section className="py-24">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Premium Car Care Services</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              From a basic wash to our premium detailing packages, we have services 
              for every need and budget. All services are performed by our 
              experienced professionals using high-quality products.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fullServicesList.map((service, index) => (
              <motion.div 
                key={service.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={service.imageSrc}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Includes:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <motion.li 
                          key={index} 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          viewport={{ once: true }}
                        >
                          <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-blue-600 font-bold text-lg">{service.price}</span>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href={service.link} className="btn-primary">
                        Book Now
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Experience the Diamond Difference?</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto font-light">
              Book an appointment today and give your car the premium care it deserves. 
              Our team of professionals is ready to serve you.
            </p>
            <Link href="/book" className="bg-white text-blue-600 hover:bg-gray-100 text-lg font-medium px-10 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 inline-flex items-center">
              Book an Appointment
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </>
  );
} 