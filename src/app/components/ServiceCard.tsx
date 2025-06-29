import Image from 'next/image';
import Link from 'next/link';

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

interface ServiceCardProps {
  service: Service;
  index: number;
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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.image_url || '/images/car-wash.jpg'}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          ₹{service.price.toLocaleString()}
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
          {settings.showCategory && (
            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {service.category}
            </span>
          )}
        </div>
        
        {settings.showDuration && (
          <p className="text-gray-600 text-sm mb-4">
            Duration: {formatDuration(service.duration)}
          </p>
        )}
        
        <div className="text-gray-600 mb-6 flex-grow">
          <div 
            className="service-description text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
        </div>
        
        <div className="flex justify-end">
          <Link
            href="/book"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard; 