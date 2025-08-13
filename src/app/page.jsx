import LayoutWrapper from "../Components/LayoutWrapper";
import Hero from "./HomeComponents/hero";
import FeaturedArtworksSection from "./HomeComponents/FeaturedArtworksSection";

export default function Home() {
  return (
    <LayoutWrapper>
      <Hero />
      <FeaturedArtworksSection />
    </LayoutWrapper>
  );
}
