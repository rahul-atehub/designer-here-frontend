"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Animation trigger on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Rotating testimonials
  const testimonials = [
    {
      rating: "★★★★★",
      score: "4.6",
      reviews: "12k",
      source: "Google",
      color: "text-yellow-400",
    },
    {
      rating: "★★★★☆",
      score: "4.8",
      reviews: "5k",
      source: "Forbes",
      color: "text-yellow-400",
    },
    {
      rating: "★★★★★",
      score: "4.9",
      reviews: "8k",
      source: "Trustpilot",
      color: "text-green-400",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for subtle parallax effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  // Scroll to contact function
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="grid md:grid-cols-2 items-center gap-10 relative">
        {/* Left Text Block */}
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 mb-6 animate-bounce">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></span>
            New: AI-Powered Design Tools
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black dark:text-white leading-tight">
            Start your journey <br /> with{" "}
            <span className="text-[#EF4444] relative">
              Designer Here
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-red-300 dark:text-red-600"
                viewBox="0 0 200 12"
                fill="currentColor"
              >
                <path
                  d="M0,8 Q50,0 100,6 T200,4 L200,12 L0,12 Z"
                  opacity="0.3"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 text-gray-600 dark:text-neutral-300 text-lg lg:text-xl leading-relaxed">
            Hand-picked professionals and expertly crafted components, designed
            for any kind of entrepreneur. Transform your vision into reality
            with our
            <span className="font-semibold text-gray-800 dark:text-white">
              {" "}
              cutting-edge solutions
            </span>
            .
          </p>

          {/* Stats Counter Animation */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-400">
                500+ Projects Completed
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
              <span className="text-gray-600 dark:text-gray-400">
                24/7 Support Available
              </span>
            </div>
          </div>

          {/* Enhanced Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/portfolio">
              <button
                className="group inline-flex items-center justify-center px-8 py-4 text-white bg-[#EF4444] hover:bg-red-600 font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 active:scale-95"
                onClick={() => console.log("Get started clicked")}
              >
                <span>Get started</span>
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </Link>

            <Link href="/contact">
              <button
                onClick={scrollToContact}
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:border-transparent font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <svg
                  className="mr-2 w-4 h-4 group-hover:animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Us
              </button>
            </Link>
          </div>

          {/* Enhanced Ratings with Rotation */}
          <div className="mt-12 flex flex-wrap gap-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === currentTestimonial
                    ? "transform scale-110 opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <div
                  className={`flex items-center space-x-1 text-base ${testimonial.color}`}
                >
                  <span className="animate-pulse">{testimonial.rating}</span>
                </div>
                <p className="text-neutral-700 dark:text-gray-300 font-semibold mt-2">
                  {testimonial.score}{" "}
                  <span className="text-gray-500 font-normal">
                    /5 - from {testimonial.reviews} reviews
                  </span>
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-neutral-700 dark:text-gray-400 font-semibold">
                    {testimonial.source}
                  </p>
                  {index === currentTestimonial && (
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-ping delay-100"></div>
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-ping delay-200"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Right Image */}
        <div
          className={`relative transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
          }`}
        >
          {/* Floating Elements */}
          <div
            className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-2xl transform rotate-12 animate-float opacity-80"
            style={{
              transform: `rotate(12deg) translate(${mousePosition.x * 10}px, ${
                mousePosition.y * 10
              }px)`,
              transition: "transform 0.1s ease-out",
            }}
          ></div>

          <div
            className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-2xl animate-float delay-1000 opacity-70"
            style={{
              transform: `translate(${mousePosition.x * -15}px, ${
                mousePosition.y * -15
              }px)`,
              transition: "transform 0.1s ease-out",
            }}
          ></div>

          {/* Main Image Container */}
          <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

            <Image
              src="https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg"
              alt="Happy customers working with modern design tools"
              width={600}
              height={600}
              className="rounded-2xl object-cover transform group-hover:scale-110 transition-transform duration-700"
              priority
            />

            {/* Overlay Stats */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-red-500">98.5%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold text-blue-500">150+</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 -right-8 flex flex-col space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-red-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-20 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider font-medium mb-8">
          Trusted by industry leaders
        </p>
        <div className="flex justify-center items-center space-x-12 opacity-60 hover:opacity-100 transition-opacity duration-500">
          {["Microsoft", "Google", "Apple", "Amazon", "Meta"].map(
            (company, index) => (
              <div
                key={company}
                className="text-gray-400 dark:text-gray-500 font-bold text-lg hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {company}
              </div>
            )
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-10px) rotate(12deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
