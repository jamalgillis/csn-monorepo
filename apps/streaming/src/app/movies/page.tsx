import { Navigation } from "@/components/Navigation";
import { BrowseContent } from "@/components/BrowseContent";
import { Footer } from "@/components/Footer";

export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-20">
        <BrowseContent 
          initialFilters={{ type: "show" }}
          pageTitle="Movies"
          pageDescription="Discover amazing movies from every genre"
        />
      </main>
      <Footer />
    </div>
  );
}

export const metadata = {
  title: "Movies - CSN",
  description: "Browse and watch the latest movies on CSN streaming platform. Find blockbusters, indie films, and classics.",
};