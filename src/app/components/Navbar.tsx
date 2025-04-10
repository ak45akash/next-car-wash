'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container-custom flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="relative h-12 w-12 mr-3">
            <Image
              src="/logo.png"
              alt="Diamond Steam Car Wash Logo"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="text-xl font-bold text-blue-600 block leading-tight">Diamond</span>
            <span className="text-gray-600 text-sm block leading-tight">Steam Car Wash</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link 
            href="/" 
            className={isActiveLink('/') 
              ? "text-blue-600 font-bold transition-colors duration-300" 
              : "text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300"}
          >
            Home
          </Link>
          <Link 
            href="/services" 
            className={isActiveLink('/services') 
              ? "text-blue-600 font-bold transition-colors duration-300" 
              : "text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300"}
          >
            Services
          </Link>
          <Link 
            href="/about" 
            className={isActiveLink('/about') 
              ? "text-blue-600 font-bold transition-colors duration-300" 
              : "text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300"}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={isActiveLink('/contact') 
              ? "text-blue-600 font-bold transition-colors duration-300" 
              : "text-gray-600 font-medium hover:text-blue-600 transition-colors duration-300"}
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden rounded p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg 
            className="w-6 h-6 text-gray-800" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 right-0 left-0 bg-white z-50 shadow-lg">
            <div className="flex flex-col p-4">
              <Link 
                href="/" 
                className={isActiveLink('/') 
                  ? "py-2 text-blue-600 font-semibold" 
                  : "py-2 text-gray-600 hover:text-blue-600"}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/services" 
                className={isActiveLink('/services') 
                  ? "py-2 text-blue-600 font-semibold" 
                  : "py-2 text-gray-600 hover:text-blue-600"}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/about" 
                className={isActiveLink('/about') 
                  ? "py-2 text-blue-600 font-semibold" 
                  : "py-2 text-gray-600 hover:text-blue-600"}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={isActiveLink('/contact') 
                  ? "py-2 text-blue-600 font-semibold" 
                  : "py-2 text-gray-600 hover:text-blue-600"}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}

        {/* CTA Button - Desktop */}
        <div className="hidden md:block">
          <Link 
            href="/book" 
            className={isActiveLink('/book')
              ? "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ring-2 ring-blue-300"
              : "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"}
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
} 