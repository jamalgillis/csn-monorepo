"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, ClockIcon, EyeIcon, UserIcon } from "@heroicons/react/24/outline";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  published_at?: string;
  read_time: number;
  view_count: number;
  author: {
    id: string;
    name?: string;
    avatar_url?: string;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
    color?: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cardSizeClass = featured 
    ? "md:h-80" 
    : "h-64";

  return (
    <article className={`group bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-all duration-300 ${cardSizeClass}`}>
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className="relative h-2/3 overflow-hidden">
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes={featured ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 25vw"}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <div className="text-6xl text-gray-500">
                📝
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-3 left-3">
              <span 
                className="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full"
                style={{ 
                  backgroundColor: post.category.color || '#dc2626' 
                }}
              >
                {post.category.name}
              </span>
            </div>
          )}

          {/* Read Time Badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-300 bg-black/60 rounded-full backdrop-blur-sm">
              <ClockIcon className="h-3 w-3 mr-1" />
              {post.read_time}m read
            </span>
          </div>
        </div>

        <div className="p-4 h-1/3 flex flex-col justify-between">
          <div className="flex-1">
            <h3 className={`font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 ${
              featured ? 'text-lg' : 'text-base'
            }`}>
              {post.title}
            </h3>
            
            {post.excerpt && (
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center space-x-4">
              {post.author && (
                <div className="flex items-center">
                  {post.author.avatar_url ? (
                    <Image
                      src={post.author.avatar_url}
                      alt={post.author.name || 'Author'}
                      width={16}
                      height={16}
                      className="rounded-full mr-1"
                    />
                  ) : (
                    <UserIcon className="h-4 w-4 mr-1" />
                  )}
                  <span>{post.author.name || 'Anonymous'}</span>
                </div>
              )}
              
              {post.published_at && (
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              <span>{post.view_count.toLocaleString()}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  className="inline-block px-2 py-1 text-xs text-gray-400 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  #{tag.name}
                </Link>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}