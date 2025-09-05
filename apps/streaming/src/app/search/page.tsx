import { Navigation } from "@/components/Navigation";
import { SearchResults } from "@/components/SearchResults";
import { Footer } from "@/components/Footer";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "";

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-20">
        <SearchResults query={query} />
      </main>
      <Footer />
    </div>
  );
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "";
  
  return {
    title: query ? `Search results for "${query}" - CSN` : "Search - CSN",
    description: query 
      ? `Find movies and TV shows matching "${query}" on CSN streaming platform`
      : "Search for movies and TV shows on CSN streaming platform",
  };
}