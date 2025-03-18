'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const services = [
  {
    id: 1,
    title: 'Basic Wash',
    description: 'Complete exterior wash with high-quality cleaning agents and hand-dry finish.',
    imageSrc: '/images/dry-clean.jpg',
    price: '₹499',
    link: '/book?service=basic-wash',
    features: [
      'Exterior Hand Wash',
      'Wheel Cleaning',
      'Tire Dressing',
      'Windows Cleaning',
      'Hand Drying'
    ]
  },
  {
    id: 2,
    title: 'Premium Wash',
    description: 'Comprehensive wash package with interior vacuuming and dashboard polish.',
    imageSrc: '/images/premium-wash.jpg',
    price: '₹799',
    link: '/book?service=premium-wash',
    features: [
      'All Basic Wash Features',
      'Interior Vacuuming',
      'Dashboard & Console Cleaning',
      'Door Jambs Cleaning',
      'Air Freshener'
    ]
  },
  {
    id: 3,
    title: 'Steam Wash',
    description: 'Deep-clean your car with our eco-friendly steam technology that uses less water.',
    imageSrc: '/images/steam-wash.jpg',
    price: '₹999',
    link: '/book?service=steam-wash',
    features: [
      'High-Pressure Steam Cleaning',
      'Stain Removal',
      'Sanitization & Disinfection',
      'Eco-Friendly Process',
      'Interior & Exterior Treatment'
    ]
  },
  {
    id: 4,
    title: 'Interior Detailing',
    description: 'Complete interior cleaning with vacuum, upholstery cleaning, and dashboard polish.',
    imageSrc: '/images/interior-detailing.jpg',
    price: '₹1,499',
    link: '/book?service=interior-detailing',
    features: [
      'Deep Vacuuming',
      'Upholstery Shampooing',
      'Leather Treatment',
      'Dashboard & Console Detailing',
      'Interior Glass Cleaning'
    ]
  },
  {
    id: 5,
    title: 'Exterior Detailing',
    description: 'Restore your car\'s exterior shine with clay bar treatment, polishing, and waxing.',
    imageSrc: '/images/exterior-detailing.jpg',
    price: '₹1,999',
    link: '/book?service=exterior-detailing',
    features: [
      'Clay Bar Treatment',
      'Machine Polishing',
      'Scratch Removal',
      'Paint Correction',
      'Wax Application'
    ]
  },
  {
    id: 6,
    title: 'Full Detailing',
    description: 'Comprehensive interior and exterior detailing for a complete car refresh.',
    imageSrc: '/images/full-detailing.jpg',
    price: '₹2,999',
    link: '/book?service=full-detailing',
    features: [
      'All Interior Detailing Features',
      'All Exterior Detailing Features',
      'Engine Bay Cleaning',
      'Headlight Restoration',
      'Undercarriage Wash'
    ]
  },
  {
    id: 7,
    title: 'Paint Protection Film (PPF)',
    description: 'Protect your car\'s paint from scratches, chips, and UV damage with premium PPF.',
    imageSrc: '/images/ppf.jpg',
    price: '₹15,999',
    link: '/book?service=ppf',
    features: [
      'Premium Quality Film',
      'UV Protection',
      'Scratch & Chip Resistance',
      'Self-Healing Technology',
      '5-Year Warranty'
    ]
  },
  {
    id: 8,
    title: 'Ceramic Coating',
    description: 'Long-lasting protection with a high-gloss finish that repels water and contaminants.',
    imageSrc: '/images/ceramic-coating.jpg',
    price: '₹8,999',
    link: '/book?service=ceramic-coating',
    features: [
      'Hydrophobic Protection',
      'UV & Oxidation Resistance',
      'Enhanced Gloss Finish',
      'Chemical Stain Protection',
      '2-Year Durability'
    ]
  }
];

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
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Premium Car Care Services</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Diamond Steam Car Wash offers a comprehensive range of services to keep your vehicle in pristine condition. 
              From basic washes to premium detailing, we have everything your car needs.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
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
      <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
        {/* Background Decoration */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-20"
          initial={{ x: 100, y: -100 }}
          whileInView={{ x: 50, y: -50 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700 rounded-full opacity-20"
          initial={{ x: -100, y: 100 }}
          whileInView={{ x: -50, y: 50 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
        />
        
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-lg mb-6">Ready to give your car the care it deserves?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Book your appointment today and experience the Diamond Steam Car Wash difference.
              Our professional team in Mohali is ready to make your car shine!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/book" className="bg-white text-blue-600 hover:bg-gray-100 text-lg font-medium px-8 py-3 rounded-md transition duration-300 shadow-lg inline-flex items-center">
                Book an Appointment
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </>
  );
} 