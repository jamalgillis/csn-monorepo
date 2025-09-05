import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { BlogPost } from '@/components/BlogPost'
import { BlogSidebar } from '@/components/BlogSidebar'
// import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Blog Post Content */}
            <div className="lg:col-span-3">
              <BlogPost slug={slug} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  // TODO: Fetch post data for metadata
  // For now, return default metadata
  return {
    title: `Article - CSN Blog`,
    description: "Read the latest insights and content from CSN's blog.",
    openGraph: {
      title: `Article - CSN Blog`,
      description: "Read the latest insights and content from CSN's blog.",
      type: 'article',
    },
    slug: slug,
  };
}