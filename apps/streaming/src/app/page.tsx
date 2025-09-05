import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ContentCarousels } from "@/components/ContentCarousels";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="my-6">
        <HeroSection />
        <ContentCarousels />
      </main>
      <Footer />
    </div>
  );
}
