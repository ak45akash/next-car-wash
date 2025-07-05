import Image from 'next/image';
import Link from 'next/link';
import type { Service, DisplaySettings } from '@/types';

interface ServiceCardProps {
  service: Service;
  index?: number;
  displaySettings?: DisplaySettings;
}

const formatDuration = (totalMinutes: number): string => {
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);

  return parts.join(', ') || '0 minutes';
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, displaySettings }) => {
  // Use default settings if not provided
  const settings = displaySettings || {
    showDuration: true,
    showCategory: true
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift transition-all duration-300 h-full flex flex-col group border border-gray-100 hover:border-blue-200">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={service.image_url || '/images/car-wash.jpg'}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {settings.showCategory && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium animate-shimmer group-hover:bg-blue-700 transition-colors duration-300">
            {service.category}
          </div>
        )}
        
        {/* Price badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          ₹{service.price.toLocaleString()}
        </div>
      </div>
      
      <div className="p-4 sm:p-6 flex-grow flex flex-col relative">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{service.name}</h3>
        </div>
        
        {settings.showDuration && (
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Duration: {formatDuration(service.duration)}
          </div>
        )}
        
        <div className="text-gray-600 mb-6 flex-grow">
          <div 
            className="service-description text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: service.description.replace(/✓([A-Za-z])/g, '✓ $1') 
            }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            ₹{service.price.toLocaleString()}
          </div>
          <Link
            href={`/book?service=${service.id}`}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center group-hover:animate-pulse"
          >
            Book Now
            <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </Link>
        </div>
        
        {/* Animated bottom border */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 w-0 group-hover:w-full transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default ServiceCard; 