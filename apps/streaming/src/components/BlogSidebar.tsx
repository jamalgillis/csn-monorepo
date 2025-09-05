"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { useState } from "react";
import { ChevronRightIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export function BlogSidebar() {
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const categories = useQuery(api.blog.getBlogCategories, {});
  const tags = useQuery(api.blog.getBlogTags, { limit: 10 });
  const recentPosts = useQuery(api.blog.getBlogPosts, { limit: 5 });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus("loading");
    
    // TODO: Implement newsletter subscription
    // For now, just simulate the process
    setTimeout(() => {
      setSubscribeStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-lg">
        <div className="text-center">
          <EnvelopeIcon className="h-12 w-12 text-white mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
          <p className="text-red-100 text-sm mb-4">
            Get the latest articles and insights delivered to your inbox.
          </p>
          
          {subscribeStatus === "success" ? (
            <div className="text-center">
              <div className="text-white font-semibold mb-2">✓ Successfully subscribed!</div>
              <p className="text-red-100 text-sm">Thank you for subscribing to our newsletter.</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                disabled={subscribeStatus === "loading"}
              />
              <button
                type="submit"
                disabled={subscribeStatus === "loading"}
                className="w-full bg-white text-red-600 font-semibold py-2 px-4 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {subscribeStatus === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/blog?category=${category.slug}`}
                className="flex items-center justify-between text-gray-300 hover:text-white transition-colors group"
              >
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: category.color || '#dc2626' }}
                  />
                  <span>{category.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">{category.post_count}</span>
                  <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular Tags */}
      {tags && tags.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag._id}
                href={`/blog?tag=${tag.slug}`}
                className="inline-block px-3 py-1 text-sm text-gray-300 bg-gray-800 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
              >
                #{tag.name}
                <span className="ml-1 text-xs text-gray-500">({tag.post_count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {recentPosts && recentPosts.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Articles</h3>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <h4 className="text-gray-300 group-hover:text-white transition-colors font-medium text-sm line-clamp-2 mb-1">
                  {post.title}
                </h4>
                <div className="flex items-center text-xs text-gray-500 space-x-2">
                  {post.published_at && (
                    <span>
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                  <span>•</span>
                  <span>{post.read_time}m read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Archive */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Explore</h3>
        <div className="space-y-2">
          <Link
            href="/blog"
            className="block text-gray-300 hover:text-white transition-colors"
          >
            All Articles
          </Link>
          <Link
            href="/blog?featured=true"
            className="block text-gray-300 hover:text-white transition-colors"
          >
            Featured Articles
          </Link>
          <Link
            href="/"
            className="block text-gray-300 hover:text-white transition-colors"
          >
            Back to Streaming
          </Link>
        </div>
      </div>
    </div>
  );
}