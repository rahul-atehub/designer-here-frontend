"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 items-center gap-10">
        {/* Left Text Block */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-700">
            Start your journey <br /> with{" "}
            <span className="text-[#EF4444]">Designer Here</span>
          </h1>
          <p className="mt-5 text-gray-600 text-lg">
            Hand-picked professionals and expertly crafted components, designed
            for any kind of entrepreneur.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 text-white bg-[#EF4444] hover:bg-red-600 font-medium rounded-lg transition"
            >
              Get started
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-400 dark:text-white hover:text-white hover:bg-blue-800 font-medium rounded-lg transition"
            >
              Contact Us
            </a>
          </div>

          {/* Ratings */}
          <div className="mt-10 flex flex-wrap gap-10">
            <div>
              <div className="flex items-center space-x-1 text-sm text-yellow-400">
                <span>★★★★★</span>
              </div>
              <p className="dark:text-gray-400 font-semibold mt-1">
                4.6{" "}
                <span className="text-gray-500 font-normal">
                  /5 - from 12k reviews
                </span>
              </p>
              <p className="dark:text-gray-400 font-semibold">Google</p>
            </div>
            <div>
              <div className="flex items-center space-x-1 text-sm text-yellow-400">
                <span>★★★★☆</span>
              </div>
              <p className="dark:text-gray-400 font-semibold mt-1">
                4.8{" "}
                <span className="text-gray-500 font-normal">
                  /5 - from 5k reviews
                </span>
              </p>
              <p className="dark:text-gray-400 font-semibold">Forbes</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative">
          <Image
            src="https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg" // replace with actual image path in public/
            alt="Happy customers"
            width={600}
            height={600}
            className="rounded-lg object-cover"
          />

          {/* Pixelated border effect */}
          {/* <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white" />
            <div className="absolute bottom-0 right-12 w-6 h-6 bg-white" />
            <div className="absolute bottom-12 right-0 w-6 h-6 bg-white" />
          </div> */}
        </div>
      </div>
    </section>
  );
}
