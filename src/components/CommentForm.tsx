import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface AuthUser {
  token: string;
}

interface CommentFormProps {
  threadId: number;
  onCommentSubmit?: () => void;
}

export function CommentForm({ threadId, onCommentSubmit }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth() as { user: AuthUser | null };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/') && file.size > 100 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Video file too large. Maximum size is 100MB.",
          variant: "destructive",
        });
        return;
      }
      setMedia(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !media) return;

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a comment",
        variant: "destructive",
      });
      return;
    }

    if (content.length > 500) {
      toast({
        title: "Error",
        description: "Comment cannot exceed 500 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("thread", String(threadId));
      formData.append("content", content);
      if (media) formData.append("media", media);

      const response = await fetch("http://127.0.0.1:8000/api/comments/create/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || "Failed to post comment");
      }

      toast({
        title: "Success",
        description: "Your comment has been posted",
      });

      setContent("");
      setMedia(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        fileInputRef.current.files = null;
      }
      onCommentSubmit?.();
    } catch (error) {
      console.error("Error posting comment:", error);
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
      {media && media.type.startsWith("image/") && (
        <img
          src={URL.createObjectURL(media)}
          alt="Preview"
          className="max-h-40 mt-2"
          onLoad={() => URL.revokeObjectURL(URL.createObjectURL(media))}
        />
      )}
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          className="hidden"
          onChange={handleMediaChange}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          aria-label="Upload media"
        >
          <Image className="h-5 w-5" />
        </Button>
        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={(!content && !media) || loading}
          className="ml-auto flex gap-1"
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Send className="h-4 w-4" />
          )}
          Post
        </Button>
      </div>
    </form>
  );
}