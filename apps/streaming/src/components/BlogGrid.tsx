"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BlogCard } from "./BlogCard";
import { BlogGridSkeleton } from "./BlogGridSkeleton";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface BlogGridProps {
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export function BlogGrid({ category, tag, page = 1, limit = 12 }: BlogGridProps) {
  const blogPosts = useQuery(api.blog.getBlogPosts, {
    limit: limit,
    category,
  });

  const featuredPosts = useQuery(api.blog.getBlogPosts, {
    limit: 3,
    featured: true,
  });

  if (blogPosts === undefined || featuredPosts === undefined) {
    return <BlogGridSkeleton />;
  }

  // Show featured posts on first page if no specific category/tag
  const showFeatured = page === 1 && !category && !tag && featuredPosts.length > 0;

  return (
    <div className="space-y-12">
      {/* Featured Posts Section */}
      {showFeatured && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredPosts.map((post) => (
              <BlogCard key={post._id} post={post} featured />
            ))}
          </div>
        </div>
      )}

      {/* Filter Info */}
      {(category || tag) && (
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/blog"
              className="text-gray-400 hover:text-white transition-colors"
            >
              All Posts
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white capitalize">
              {category || tag}
            </span>
          </div>
        </div>
      )}

      {/* Main Posts Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Articles` :
             tag ? `Articles tagged "${tag}"` :
             showFeatured ? 'Latest Articles' : 'All Articles'}
          </h2>
          <div className="text-sm text-gray-400">
            {blogPosts.length} {blogPosts.length === 1 ? 'article' : 'articles'}
          </div>
        </div>

        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-6">
              {category || tag ? 
                `No articles found for "${category || tag}". Try browsing other categories.` :
                "No articles have been published yet. Check back soon for new content!"
              }
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Browse All Articles
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {blogPosts.length >= limit && (
        <div className="flex items-center justify-center space-x-4 pt-8">
          <Link
            href={`/blog?${new URLSearchParams({ 
              ...(category && { category }), 
              ...(tag && { tag }), 
              page: Math.max(1, page - 1).toString() 
            })}`}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              page <= 1 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <ChevronLeftIcon className="h-5 w-5 mr-2" />
            Previous
          </Link>
          
          <span className="text-gray-400">
            Page {page}
          </span>
          
          <Link
            href={`/blog?${new URLSearchParams({ 
              ...(category && { category }), 
              ...(tag && { tag }), 
              page: (page + 1).toString() 
            })}`}
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Next
            <ChevronRightIcon className="h-5 w-5 ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
}