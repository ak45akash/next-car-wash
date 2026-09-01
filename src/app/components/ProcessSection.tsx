'use client';

import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';

const ProcessSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  const steps = [
    {
      id: 1,
      title: "Book Online",
      description: "Choose your service and book instantly through our easy-to-use platform",
      icon: "📱",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "Pre-Wash Inspection",
      description: "Our team inspects your vehicle and prepares the perfect treatment plan",
      icon: "🔍",
      color: "from-green-500 to-green-600"
    },
    {
      id: 3,
      title: "Premium Wash",
      description: "Professional cleaning using eco-friendly products and advanced techniques",
      icon: "🚿",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 4,
      title: "Quality Check",
      description: "Final inspection to ensure your vehicle meets our premium standards",
      icon: "✨",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-200/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="gradient-text">Premium Process</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the Diamond Steam difference with our meticulous 4-step process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative group transition-all duration-700 ${
                isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-10'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-transparent transform -translate-y-1/2 z-10">
                  <div className="absolute right-0 top-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-y-1/2 animate-pulse"></div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-8 shadow-lg hover-lift group-hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Step number */}
                <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {step.id}
                </div>

                {/* Icon */}
                <div className="text-6xl mb-6 animate-wave group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Hover effect ripple */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 rounded-2xl animate-pulse`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div 
          className={`text-center mt-16 transition-all duration-1000 ${
            isVisible ? 'animate-slideInFromBottom opacity-100' : 'opacity-0 translate-y-10'
          }`}
          style={{ animationDelay: '800ms' }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Experience Premium Care?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of satisfied customers who trust Diamond Steam with their vehicles
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Book Your Service Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection; 