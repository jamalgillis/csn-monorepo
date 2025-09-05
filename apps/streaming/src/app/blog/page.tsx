import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { BlogGrid } from '@/components/BlogGrid'
import { BlogSidebar } from '@/components/BlogSidebar'

interface BlogPageProps {
  searchParams: Promise<{ 
    category?: string;
    tag?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, tag, page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                CSN Blog
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover the latest insights, reviews, and behind-the-scenes content 
                from the world of streaming entertainment.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-3">
              <BlogGrid category={category} tag={tag} page={currentPage} />
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

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const { category, tag } = await searchParams;
  
  let title = "Blog - CSN";
  let description = "Discover the latest insights, reviews, and behind-the-scenes content from the world of streaming entertainment.";
  
  if (category) {
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} - CSN Blog`;
    description = `Browse ${category} articles and insights on CSN's blog.`;
  }
  
  if (tag) {
    title = `${tag.charAt(0).toUpperCase() + tag.slice(1)} Articles - CSN Blog`;
    description = `Explore articles tagged with ${tag} on CSN's blog.`;
  }
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}