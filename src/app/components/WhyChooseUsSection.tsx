'use client';

import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';

const WhyChooseUsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  const features = [
    {
      id: 1,
      title: "Eco-Friendly Products",
      description: "We use only biodegradable, environmentally safe cleaning products that protect your car and the planet.",
      icon: "🌱",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50"
    },
    {
      id: 2,
      title: "Professional Team",
      description: "Our trained professionals have years of experience and treat every vehicle with meticulous care.",
      icon: "👨‍🔧",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 3,
      title: "Advanced Equipment",
      description: "State-of-the-art washing equipment and techniques ensure the best results for your vehicle.",
      icon: "⚡",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: 4,
      title: "Time Efficient",
      description: "Quick service without compromising quality. Most services completed within 30-60 minutes.",
      icon: "⏱️",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50"
    },
    {
      id: 5,
      title: "Satisfaction Guarantee",
      description: "100% satisfaction guaranteed or we'll redo the service at no extra cost. Your happiness is our priority.",
      icon: "✅",
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50"
    },
    {
      id: 6,
      title: "Affordable Pricing",
      description: "Premium quality services at competitive prices. Great value for money with transparent pricing.",
      icon: "💰",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 animate-float"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Why Choose <span className="gradient-text">Diamond Steam</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover what makes us the preferred choice for premium car care services
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`group transition-all duration-700 ${
                isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-10'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`${feature.bgColor} rounded-2xl p-8 h-full hover-lift transition-all duration-300 border-2 border-transparent hover:border-gray-200 relative overflow-hidden`}>
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon with animated background */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <span className="text-3xl animate-wave group-hover:animate-bounce">
                      {feature.icon}
                    </span>
                  </div>
                  {/* Ripple effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-20 scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500`}></div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300 pointer-events-none"></div>
                
                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div 
          className={`text-center mt-16 transition-all duration-1000 ${
            isVisible ? 'animate-slideInFromBottom opacity-100' : 'opacity-0 translate-y-10'
          }`}
          style={{ animationDelay: '900ms' }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-shimmer"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Experience the Diamond Steam Difference
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust us with their vehicles. 
                Book your premium car wash service today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Book Now
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
                  View Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection; 