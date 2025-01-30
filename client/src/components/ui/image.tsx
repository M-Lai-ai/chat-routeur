import { cn } from "@/lib/utils";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

export default function Image({ className, fallback, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return fallback || null;
  }

  return (
    <div className="relative">
      {isLoading && (
        <Skeleton className={cn("absolute inset-0", className)} />
      )}
      <img
        className={cn(isLoading ? "opacity-0" : "opacity-100", className)}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}
