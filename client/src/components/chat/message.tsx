import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import MediaPreview from "./media-preview";

interface MessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

function detectMediaLinks(content: string) {
  const mediaLinks: { url: string; type: "image" | "video" }[] = [];

  // Détecter les liens d'images
  const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/gi;
  const imageMatches = content.match(imageRegex);
  if (imageMatches) {
    imageMatches.forEach(url => {
      mediaLinks.push({ url, type: "image" });
    });
  }

  // Détecter les liens YouTube
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/g;
  const youtubeMatches = content.matchAll(youtubeRegex);
  for (const match of youtubeMatches) {
    mediaLinks.push({ 
      url: `https://www.youtube.com/watch?v=${match[1]}`,
      type: "video"
    });
  }

  return mediaLinks;
}

export default function Message({ content, isUser, timestamp }: MessageProps) {
  const mediaLinks = detectMediaLinks(content);

  return (
    <div
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar>
        <AvatarFallback>{isUser ? "U" : "A"}</AvatarFallback>
        <AvatarImage src={isUser ? "/user-avatar.svg" : "/assistant-avatar.svg"} />
      </Avatar>
      <div
        className={cn(
          "flex flex-col max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-lg p-3",
            isUser
              ? "bg-primary text-primary-foreground prose-invert" 
              : "bg-muted"
          )}
        >
          <ReactMarkdown className={cn(
            "prose dark:prose-invert",
            isUser && "text-white" 
          )}>
            {content}
          </ReactMarkdown>
          {mediaLinks.map((link, index) => (
            <MediaPreview key={index} {...link} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}