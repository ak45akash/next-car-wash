import ServiceCard from './ServiceCard';
import Link from 'next/link';
import { getServices as getServicesFromDB, getSettings } from '@/lib/supabase';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  status: string;
  image_url?: string;
}

interface DisplaySettings {
  showDuration: boolean;
  showCategory: boolean;
}

async function getServices(): Promise<Service[]> {
  try {
    console.log('ServicesSection: Fetching services for homepage');
    // Use direct database connection to avoid infinite loop
    const data = await getServicesFromDB();
    return data.filter((service: Service) => service.status === 'Active')
              .sort((a: Service, b: Service) => a.price - b.price)
              .slice(0, 6); // Show only first 6 services on homepage
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

async function getDisplaySettings(): Promise<DisplaySettings> {
  try {
    console.log('ServicesSection: Fetching display settings for homepage');
    // Use direct database connection to avoid infinite loop
    const data = await getSettings('display_options');
    if (data?.value) {
      const settings = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
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

const ServicesSection = async () => {
  const [services, displaySettings] = await Promise.all([
    getServices(),
    getDisplaySettings()
  ]);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Our Services</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Choose from our range of professional car washing and detailing services. We use eco-friendly products and the latest techniques to give your car the care it deserves.
          </p>
        </div>

        {services.length > 0 ? (
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
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600">No services available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            href="/services"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 inline-flex items-center shadow-md"
          >
            View All Services
            <svg 
              className="w-5 h-5 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 