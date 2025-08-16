"use client";
import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import LayoutWrapper from "@/Components/LayoutWrapper";

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    console.log("Form data ready to send:", formData);
    setSuccess(true);
    setFormData({ firstName: "", lastName: "", email: "", message: "" });
    setTimeout(() => setSuccess(false), 3000); // hide success after 3s
  };

  return (
    <LayoutWrapper>
      <>
        <Head>
          <title>Publius - Let's work together</title>
          <meta
            name="description"
            content="Contact Publius - Let's work together"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-white via-white to-[#EF4444] dark:from-neutral-950 dark:via-neutral-950 dark:to-[#EF4444] relative overflow-hidden">
          {/* Background decorative lines */}
          <div className="absolute inset-0 overflow-hidden">
            <svg
              className="absolute top-0 right-0 w-full h-full"
              viewBox="0 0 1200 800"
              fill="none"
            >
              <path
                d="M1200 0L800 400"
                stroke="#EF4444"
                strokeWidth="2"
                opacity="0.3"
              />
              <path
                d="M1000 0L600 200"
                stroke="#EF4444"
                strokeWidth="1"
                opacity="0.2"
              />
              <path
                d="M1200 200L900 500"
                stroke="#EF4444"
                strokeWidth="1"
                opacity="0.2"
              />
            </svg>
          </div>

          <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-950 border rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Left side - Form */}
                <div className="lg:w-1/2 p-8 lg:p-12">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-8">
                      <Image
                        src="https://res.cloudinary.com/dhsv1d1vn/image/upload/v1754996669/logo_1_jo4krf.png"
                        alt="My Logo"
                        width={40}
                        height={40}
                      />
                      <span className="text-xl font-bold text-[#EF4444]">
                        Designer Here
                      </span>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-8 mb-12">
                      <a
                        href="/"
                        className="text-gray-400 dark:text-white hover:text-[#EF4444] dark:hover:text-[#EF4444] transition-colors"
                      >
                        Home
                      </a>

                      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-50 mb-4">
                      Let's work together.
                    </h1>
                    <p className="text-gray-500 dark:text-gray-100">
                      Or reach us via :{" "}
                      <a
                        href="mailto:Publius@mail.com"
                        className="text-blue-500 hover:underline"
                      >
                        Publius@mail.com
                      </a>
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="First name"
                          className="w-full px-4 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Last name"
                          className="w-full px-4 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    {/* Email field */}
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="w-full px-4 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Message field */}
                    <div className="relative">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Message"
                        rows="4"
                        className="w-full px-4 py-4 bg-gray-50 dark:bg-neutral-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 resize-none"
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Bottom section */}
                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        className="flex items-center gap-2 text-gray-900 hover:text-[#EF4444] dark:text-neutral-50 dark:hover:text-[#EF4444] transition-colors"
                      >
                        <span>Add attachment</span>
                      </button>

                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl transition-colors duration-200 font-medium"
                      >
                        Send message
                      </button>
                    </div>

                    {/* Success message */}
                    {success && (
                      <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-xl transition-all duration-500 animate-slide-fade">
                        Message sent successfully!
                      </div>
                    )}
                  </form>
                </div>

                {/* Right side - Image */}
                <div className="lg:w-1/2 relative">
                  <div className="h-64 lg:h-full relative overflow-hidden rounded-l-3xl">
                    <img
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                      alt="Mountain landscape with lake reflection"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .animate-slide-fade {
            transform: translateY(-10px);
            opacity: 0;
            animation: slideFadeIn 0.5s forwards;
          }
          @keyframes slideFadeIn {
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}</style>
      </>
    </LayoutWrapper>
  );
}
