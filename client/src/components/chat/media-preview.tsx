import { Card } from "@/components/ui/card";
import Image from "@/components/ui/image";
import { useState } from "react";

interface MediaPreviewProps {
  url: string;
  type: "image" | "video";
}

export default function MediaPreview({ url, type }: MediaPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return null;
  }

  return (
    <Card className="overflow-hidden mt-2 max-w-[300px]">
      {type === "image" ? (
        <Image
          src={url}
          alt="Preview"
          className="w-full h-auto"
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
        />
      ) : (
        <div className="relative pt-[56.25%]">
          <iframe
            src={url.replace('watch?v=', 'embed/')}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => setError(true)}
          />
        </div>
      )}
    </Card>
  );
}
