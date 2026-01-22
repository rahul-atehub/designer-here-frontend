"use client";

import LayoutWrapper from "@/Components/LayoutWrapper";
import Hero from "./HomeComponents/hero";
import FeaturedGallery from "./HomeComponents/featuredGallery";
import ContactCTA from "./HomeComponents/ContactCTA";
import Footer from "@/Components/Footer";

export default function Home() {
  return (
    <LayoutWrapper>
      <Hero />
      <FeaturedGallery />
      <ContactCTA />
      <Footer />
    </LayoutWrapper>
  );
}
