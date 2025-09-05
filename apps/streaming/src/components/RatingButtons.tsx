"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { 
  HandThumbUpIcon as ThumbUpSolid,
  HandThumbDownIcon as ThumbDownSolid,
} from "@heroicons/react/24/solid";
import { 
  HandThumbUpIcon as ThumbUpOutline,
  HandThumbDownIcon as ThumbDownOutline,
} from "@heroicons/react/24/outline";

interface RatingButtonsProps {
  contentId: string;
}

export function RatingButtons({ contentId }: RatingButtonsProps) {
  const { user, isSignedIn } = useUser();
  const [userDbId, setUserDbId] = useState<Id<"users"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get or create user in Convex database
  const existingUser = useQuery(api.users.getUserByClerkId, 
    user?.id ? { clerkId: user.id } : "skip"
  );
  const createUser = useMutation(api.users.createUser);
  
  // Get content ratings
  const contentRatings = useQuery(api.content.getContentRatings, {
    contentId: contentId as Id<"content">
  });
  
  // Get user's current rating
  const userRating = useQuery(api.content.getUserRating,
    userDbId ? {
      contentId: contentId as Id<"content">,
      userId: userDbId
    } : "skip"
  );
  
  const rateContent = useMutation(api.content.rateContent);
  
  // Handle user creation/lookup
  useEffect(() => {
    if (isSignedIn && user && !userDbId) {
      if (existingUser) {
        setUserDbId(existingUser._id);
      } else if (user.id && user.emailAddresses?.[0]?.emailAddress) {
        // Create user in database if they don't exist
        createUser({
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: user.fullName || undefined,
          avatarUrl: user.imageUrl || undefined,
        }).then((userId) => {
          setUserDbId(userId);
        }).catch(console.error);
      }
    }
  }, [isSignedIn, user, existingUser, userDbId, createUser]);
  
  const handleRating = async (rating: "up" | "down") => {
    if (!isSignedIn || !userDbId) {
      // TODO: Show sign-in modal or redirect
      alert("Please sign in to rate content");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If user clicked the same rating they already have, remove it
      if (userRating?.rating === rating) {
        // Remove rating functionality can be added later
        console.log("User clicked same rating - could remove rating here");
      } else {
        await rateContent({
          contentId: contentId as Id<"content">,
          userId: userDbId,
          rating,
        });
      }
    } catch (error) {
      console.error("Error rating content:", error);
      alert("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!contentRatings) {
    return <div className="flex items-center space-x-4">Loading ratings...</div>;
  }
  
  const userThumbsUp = userRating?.rating === "up";
  const userThumbsDown = userRating?.rating === "down";
  
  return (
    <div className="flex items-center space-x-6">
      {/* Thumbs Up Button */}
      <button
        onClick={() => handleRating("up")}
        disabled={isSubmitting}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 touch-manipulation min-h-[44px] ${
          userThumbsUp
            ? "bg-green-600 border-green-500 text-white"
            : "border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400"
        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
        aria-label="Give thumbs up"
      >
        {userThumbsUp ? (
          <ThumbUpSolid className="h-5 w-5" />
        ) : (
          <ThumbUpOutline className="h-5 w-5" />
        )}
        <span className="text-sm font-medium">
          {contentRatings.upRatings}
        </span>
      </button>
      
      {/* Thumbs Down Button */}
      <button
        onClick={() => handleRating("down")}
        disabled={isSubmitting}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 touch-manipulation min-h-[44px] ${
          userThumbsDown
            ? "bg-red-600 border-red-500 text-white"
            : "border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400"
        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
        aria-label="Give thumbs down"
      >
        {userThumbsDown ? (
          <ThumbDownSolid className="h-5 w-5" />
        ) : (
          <ThumbDownOutline className="h-5 w-5" />
        )}
        <span className="text-sm font-medium">
          {contentRatings.downRatings}
        </span>
      </button>
      
      {/* Social Proof - Thumbs Up Percentage */}
      {contentRatings.totalRatings > 0 && (
        <div className="text-sm text-gray-400">
          <span className="font-medium text-green-400">
            {contentRatings.thumbsUpPercentage}%
          </span>
          {" "}of viewers liked this ({contentRatings.totalRatings} rating{contentRatings.totalRatings !== 1 ? 's' : ''})
        </div>
      )}
    </div>
  );
}