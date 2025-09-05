import { Navigation } from "@/components/Navigation";
import { BrowseContent } from "@/components/BrowseContent";
import { Footer } from "@/components/Footer";

interface BrowsePageProps {
  searchParams: Promise<{
    type?: string;
    genre?: string;
    year?: string;
    rating?: string;
    sort?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-20">
        <BrowseContent initialFilters={params} />
      </main>
      <Footer />
    </div>
  );
}

export async function generateMetadata({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const { type, genre } = params;
  
  let title = "Browse";
  if (type === "show") title = "Browse Shows";
  else if (type === "podcast") title = "Browse Podcasts";
  else if (type === "highlight") title = "Browse Highlights";
  else if (type === "clip") title = "Browse Clips";
  if (genre) title += ` - ${genre}`;
  title += " - CSN";
  
  return {
    title,
    description: "Browse and filter movies and TV shows on CSN streaming platform. Find content by genre, year, rating, and more.",
  };
}