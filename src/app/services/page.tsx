import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import ServiceCard from '../components/ServiceCard';
import Image from 'next/image';
import { getServices as getServicesFromDB, getSettings } from '@/lib/supabase';

import { Service } from '@/types/index';

interface DisplaySettings {
  showDuration: boolean;
  showCategory: boolean;
}

async function getServices(): Promise<Service[]> {
  try {
    console.log('Services Page: Fetching services for services page');
    // Use direct database connection to avoid infinite loop
    const data = await getServicesFromDB();
    return data.filter((service: Service) => service.status === 'Active')
              .sort((a: Service, b: Service) => a.price - b.price);
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

async function getDisplaySettings(): Promise<DisplaySettings> {
  try {
    console.log('Services Page: Fetching display settings for services page');
    // Use direct database connection to avoid infinite loop
    const data = await getSettings('display_options');
    if (data?.value) {
      let settings;
      if (typeof data.value === 'string') {
        try {
          settings = JSON.parse(data.value);
        } catch (jsonError) {
          console.error('Invalid JSON in services page display settings:', data.value, jsonError);
          settings = { showDuration: true, showCategory: true };
        }
      } else {
        settings = data.value;
      }
      return {
        showDuration: settings.showDuration !== false,
        showCategory: settings.showCategory !== false
      };
    }
  } catch (error) {
    console.error('Error fetching display settings:', error);
  }
  
  return { showDuration: true, showCategory: true };
}

export default async function ServicesPage() {
  const [services, displaySettings] = await Promise.all([
    getServices(),
    getDisplaySettings()
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <div className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.jpg"
            alt="Premium Car Care Services"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.6]"
            style={{
              objectPosition: "center 30%"
            }}
          />
        </div>
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Premium <span className="text-blue-400">Car Care</span> Services</h1>
            <p className="text-2xl font-light leading-relaxed mb-8">
              Professional car washing and detailing services with premium quality products and expert care
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 inline-flex items-center justify-center">
                Book Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </Link>
              <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-8 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Service</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From basic washes to premium detailing packages, we have the perfect service for your car
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No services available at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {services.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={index} 
                displaySettings={displaySettings}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            href="/book"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Book Your Service Now
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
} 