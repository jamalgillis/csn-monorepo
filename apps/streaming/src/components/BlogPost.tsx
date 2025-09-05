"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  CalendarIcon, 
  ClockIcon, 
  EyeIcon, 
  UserIcon,
  ShareIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import { BlogPostSkeleton } from "./BlogPostSkeleton";

interface BlogPostProps {
  slug: string;
}

export function BlogPost({ slug }: BlogPostProps) {
  const post = useQuery(api.blog.getBlogPostBySlug, { slug });

  if (post === undefined) {
    return <BlogPostSkeleton />;
  }

  if (post === null) {
    notFound();
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  return (
    <article className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      {/* Back Link */}
      <div className="p-6 border-b border-gray-700">
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="relative h-64 md:h-96">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          
          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-6 left-6">
              <span 
                className="inline-block px-4 py-2 text-sm font-semibold text-white rounded-full"
                style={{ 
                  backgroundColor: post.category.color || '#dc2626' 
                }}
              >
                {post.category.name}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-6 md:p-8">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
            {post.author && (
              <div className="flex items-center">
                {post.author.avatar_url ? (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.name || 'Author'}
                    width={32}
                    height={32}
                    className="rounded-full mr-3"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 mr-3" />
                )}
                <span className="font-medium">{post.author.name || 'Anonymous'}</span>
              </div>
            )}
            
            {post.published_at && (
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span>{post.read_time} min read</span>
            </div>
            
            <div className="flex items-center">
              <EyeIcon className="h-5 w-5 mr-2" />
              <span>{post.view_count.toLocaleString()} views</span>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  className="inline-block px-3 py-1 text-sm text-gray-300 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Share Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-md transition-colors"
            >
              <ShareIcon className="h-5 w-5 mr-2" />
              Share Article
            </button>
          </div>
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-invert prose-red max-w-none prose-lg
                     prose-headings:text-white prose-headings:font-bold
                     prose-p:text-gray-300 prose-p:leading-relaxed
                     prose-a:text-red-400 prose-a:no-underline hover:prose-a:text-red-300
                     prose-strong:text-white prose-strong:font-semibold
                     prose-ul:text-gray-300 prose-ol:text-gray-300
                     prose-li:text-gray-300 prose-li:leading-relaxed
                     prose-blockquote:border-red-600 prose-blockquote:bg-gray-800/50 prose-blockquote:text-gray-300
                     prose-code:text-red-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                     prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-700">
          {/* Author Bio */}
          {post.author && (
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-4">
                {post.author.avatar_url ? (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.name || 'Author'}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {post.author.name || 'Anonymous'}
                  </h3>
                  <p className="text-gray-400">
                    Content creator and streaming enthusiast at CSN.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Related Articles */}
          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors"
            >
              Read More Articles
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
}