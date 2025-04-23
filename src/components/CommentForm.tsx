
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommentFormProps {
  threadId: string;
  onCommentSubmit?: () => void;
}

export function CommentForm({ threadId, onCommentSubmit }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !media) return;

    setLoading(true);
    try {
      // Mock API call - replace with your actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Your comment has been posted",
      });
      
      setContent("");
      setMedia(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onCommentSubmit?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-background rounded-lg border">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="resize-none"
        disabled={loading}
        rows={3}
      />
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => setMedia(e.target.files?.[0] || null)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          <Image className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={(!content && !media) || loading}
          className="ml-auto flex gap-1"
        >
          <Send className="h-4 w-4" />
          Post
        </Button>
      </div>
    </form>
  );
}
