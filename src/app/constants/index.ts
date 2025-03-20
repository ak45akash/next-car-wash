// Site metadata
export const siteMetadata = {
  title: 'Diamond Steam Car Wash | Mohali',
  description: 'Premium car washing and detailing services in Mohali. Experience professional steam washing, interior detailing, ceramic coating and PPF installation.',
  keywords: 'car wash, mohali, steam wash, detailing, ceramic coating, ppf, car cleaning',
  author: 'Diamond Steam Car Wash',
  siteUrl: 'https://diamondsteamcarwash.com',
  companyName: 'Diamond Steam Car Wash',
  location: {
    city: 'Mohali',
    address: '123 Sector 70, Mohali, Punjab 160071',
    phone: '+91 98765 43210',
    email: 'info@diamondsteamcarwash.com'
  }
};

// Services data
export const homePageServices = [
  {
    id: 1,
    title: 'Basic Wash',
    description: 'Complete exterior wash with high-quality cleaning agents and hand-dry finish.',
    imageSrc: '/images/car-wash.jpg',
    price: '₹499',
    link: '/book?service=basic-wash'
  },
  {
    id: 2,
    title: 'Steam Wash',
    description: 'Deep-clean your car with our eco-friendly steam technology that uses less water.',
    imageSrc: '/images/steam-wash.jpg',
    price: '₹999',
    link: '/book?service=steam-wash'
  },
  {
    id: 3,
    title: 'Interior Detailing',
    description: 'Complete interior cleaning with vacuum, upholstery cleaning, and dashboard polish.',
    imageSrc: '/images/interior-detailing.jpg',
    price: '₹1,499',
    link: '/book?service=interior-detailing'
  },
  {
    id: 4,
    title: 'Premium PPF',
    description: 'Paint Protection Film (PPF) that protects your car from scratches and UV damage.',
    imageSrc: '/images/ppf.jpg',
    price: '₹15,999',
    link: '/book?service=ppf'
  },
  {
    id: 5,
    title: 'Ceramic Coating',
    description: 'Long-lasting premium ceramic coating that provides superior gloss and protection.',
    imageSrc: '/images/ceramic-coating.jpg',
    price: '₹24,999',
    link: '/book?service=ceramic-coating'
  }
];

// Full services page data with more details
export const fullServicesList = [
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

// Team members data
export const teamMembers = [
  {
    id: 1,
    name: 'Raj Patel',
    role: 'Founder & CEO',
    bio: '15+ years of experience in automotive care',
    imageSrc: '/images/hero.jpg'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Operations Manager',
    bio: 'Expert in service optimization and customer satisfaction',
    imageSrc: '/images/detailing.jpg'
  },
  {
    id: 3,
    name: 'Arjun Singh',
    role: 'Head Detailer',
    bio: 'Certified detailing specialist with international training',
    imageSrc: '/images/dry-clean.jpg'
  },
  {
    id: 4,
    name: 'Neha Gupta',
    role: 'Customer Relations',
    bio: 'Passionate about creating exceptional customer experiences',
    imageSrc: '/images/hero.jpg'
  }
];

// Company values
export const companyValues = [
  {
    id: 1,
    title: 'Quality First',
    description: 'We never compromise on quality. From the products we use to the service we provide, excellence is our standard in every detail.',
    icon: 'shield-check'
  },
  {
    id: 2,
    title: 'Integrity',
    description: 'We believe in honesty and transparency in all our dealings with customers. What we promise is exactly what we deliver.',
    icon: 'scale'
  },
  {
    id: 3,
    title: 'Eco-Friendly',
    description: 'We\'re committed to protecting the environment by using biodegradable cleaning products and water-saving techniques in all our services.',
    icon: 'leaf'
  }
]; 