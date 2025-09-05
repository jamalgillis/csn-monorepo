import { Navigation } from "@/components/Navigation";
import { ContentDetail } from "@/components/ContentDetail";
import { Footer } from "@/components/Footer";

interface ContentPageProps {
  params: Promise<{ id: string }>;
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main>
        <ContentDetail contentId={id} />
      </main>
      <Footer />
    </div>
  );
}