'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Rahul Sharma',
    location: 'Mumbai',
    rating: 5,
    comment: 'Excellent service! My car looks brand new after their premium wash service. The staff was professional and punctual. Highly recommended!',
    image: '/images/dry-clean.jpg'
  },
  {
    id: 2,
    name: 'Priya Patel',
    location: 'Delhi',
    rating: 5,
    comment: 'I tried their interior detailing service and was amazed by the results. Every corner of my car was thoroughly cleaned. Will definitely come back!',
    image: '/images/interior-detail.jpg'
  },
  {
    id: 3,
    name: 'Vikram Singh',
    location: 'Bangalore',
    rating: 4,
    comment: 'The PPF application was done perfectly. It\'s been six months and my car still looks shiny and protected. Good value for money!',
    image: '/images/ppf.jpg'
  },
  {
    id: 4,
    name: 'Anjali Desai',
    location: 'Pune',
    rating: 5,
    comment: 'ShineWash has the best steam wash in town! They removed stains that other car washes couldn\'t. The booking process was also very convenient.',
    image: '/images/steam-wash.jpg'
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      next();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, autoplay]);

  const prev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const next = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-800">What Our Customers Say</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We take pride in providing excellent service to our customers. 
            Here&apos;s what some of them have to say about their experience with ShineWash.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            className="relative bg-white rounded-xl shadow-xl p-6 md:p-10 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-600 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-10"></div>
            <div className="absolute top-10 right-10">
              <svg className="w-16 h-16 text-blue-100" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="w-full lg:w-1/3">
                <div className="relative w-full h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg mb-6 lg:mb-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={testimonials[currentIndex].id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image 
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="object-cover"
                        style={{ objectPosition: "center 25%" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="w-full lg:w-2/3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={testimonials[currentIndex].id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex mb-6">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-6 h-6 ${i < testimonials[currentIndex].rating ? "text-yellow-500" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    
                    <p className="text-gray-700 text-xl italic mb-8 leading-relaxed">
                    &quot;{testimonials[currentIndex].comment}&quot;
                    </p>
                    
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{testimonials[currentIndex].name}</h4>
                      <p className="text-blue-600">{testimonials[currentIndex].location}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className="flex gap-3 mt-8">
                  <button 
                    onClick={prev}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={next}
                    className="bg-blue-600 hover:bg-blue-700 rounded-full w-10 h-10 flex items-center justify-center text-white transition-colors"
                    aria-label="Next testimonial"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Testimonial Counter */}
            <div className="absolute bottom-10 right-10 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium">
              {currentIndex + 1} / {testimonials.length}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 