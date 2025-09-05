"use client";

interface ComingSoonBadgeProps {
  size?: "small" | "medium" | "large" | "xlarge";
  className?: string;
}

export function ComingSoonBadge({ size = "small", className = "" }: ComingSoonBadgeProps) {
  const sizeClasses = {
    small: "text-[11px] px-2 py-1 min-w-[60px] h-5",
    medium: "text-xs px-3 py-1 min-w-[80px] h-6", 
    large: "text-sm px-4 py-1.5 min-w-[100px] h-7",
    xlarge: "text-lg px-5 py-2 min-w-[120px] h-8 font-bold"
  };

  return (
    <div
      className={`
        bg-blue-600 text-white font-semibold rounded-md
        flex items-center justify-center
        shadow-lg border border-blue-500
        transition-all duration-200 ease-out
        ${sizeClasses[size]}
        ${className}
      `}
      role="img"
      aria-label="New content"
    >
      COMING SOON
    </div>
  );
}