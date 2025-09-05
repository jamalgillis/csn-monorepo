import { Navigation } from "@/components/Navigation";
import { BrowseContent } from "@/components/BrowseContent";
import { Footer } from "@/components/Footer";

export default function TVShowsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-20">
        <BrowseContent 
          initialFilters={{ type: "show" }}
          pageTitle="TV Shows"
          pageDescription="Binge-watch your favorite TV shows and discover new series"
        />
      </main>
      <Footer />
    </div>
  );
}

export const metadata = {
  title: "TV Shows - CSN",
  description: "Watch the best TV shows and series on CSN streaming platform. From drama to comedy, find your next binge-watch.",
};