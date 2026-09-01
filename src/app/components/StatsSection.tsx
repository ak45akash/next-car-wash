'use client';

import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';
import { useEffect, useState } from 'react';

const StatsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  const stats = [
    {
      id: 1,
      number: 5000,
      suffix: '+',
      label: 'Happy Customers',
      icon: '😊',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      number: 15000,
      suffix: '+',
      label: 'Cars Washed',
      icon: '🚗',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      number: 98,
      suffix: '%',
      label: 'Satisfaction Rate',
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 4,
      number: 3,
      suffix: '',
      label: 'Years Experience',
      icon: '🏆',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-yellow-300">Achievements</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Numbers that speak for our commitment to excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={stat.id} 
              stat={stat} 
              isVisible={isVisible}
              delay={index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface StatCardProps {
  stat: {
    id: number;
    number: number;
    suffix: string;
    label: string;
    icon: string;
    color: string;
  };
  isVisible: boolean;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, isVisible, delay }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = stat.number / steps;
        let current = 0;

        const counter = setInterval(() => {
          current += increment;
          if (current >= stat.number) {
            setCount(stat.number);
            clearInterval(counter);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);

        return () => clearInterval(counter);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, stat.number, delay]);

  return (
    <div
      className={`text-center transition-all duration-700 ${
        isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-10'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group hover-lift">
        {/* Icon */}
        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 animate-wave">
          {stat.icon}
        </div>

        {/* Number */}
        <div className="mb-4">
          <span className="text-5xl md:text-6xl font-bold text-white">
            {count.toLocaleString()}
          </span>
          <span className="text-3xl md:text-4xl font-bold text-yellow-300">
            {stat.suffix}
          </span>
        </div>

        {/* Label */}
        <p className="text-xl text-blue-100 font-semibold">
          {stat.label}
        </p>

        {/* Decorative line */}
        <div className={`mx-auto mt-4 h-1 w-16 bg-gradient-to-r ${stat.color} rounded-full group-hover:w-24 transition-all duration-300`}></div>
      </div>
    </div>
  );
};

export default StatsSection; 