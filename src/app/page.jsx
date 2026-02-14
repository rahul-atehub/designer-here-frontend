"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutWrapper from "@/Components/LayoutWrapper";
import Hero from "./HomeComponents/hero";
import FeaturedGallery from "./HomeComponents/featuredGallery";
import ContactCTA from "./HomeComponents/ContactCTA";
import Footer from "@/Components/Footer";

export default function Home() {
  const router = useRouter();

  // Auto-scroll to featured section if URL has #featured
  useEffect(() => {
    if (window.location.hash === "#featured") {
      setTimeout(() => {
        const element = document.getElementById("featured");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100); // Small delay to ensure DOM is ready
    }
  }, []);

  return (
    <LayoutWrapper>
      <Hero />
      <FeaturedGallery />
      <ContactCTA />
      <Footer />
    </LayoutWrapper>
  );
}
