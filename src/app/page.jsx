import LayoutWrapper from "@/Components/LayoutWrapper";
import Hero from "./HomeComponents/hero";
import FeaturedArtworksSection from "./HomeComponents/FeaturedArtworksSection";
import ContactCTA from "./HomeComponents/ContactCTA";
import Footer from "@/Components/Footer";

export default function Home() {
  return (
    <LayoutWrapper>
      <Hero />
      <FeaturedArtworksSection />
      <ContactCTA />
      <Footer />
    </LayoutWrapper>
  );
}
