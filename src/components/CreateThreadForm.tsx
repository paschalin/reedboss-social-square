
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface CreateThreadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateThreadForm({ isOpen, onClose }: CreateThreadFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a thread",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const mediaIds: string[] = [];

    // Step 1: Upload media files
    if (files && files.length > 0) {
      try {
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append('file', file);

          const mediaRes = await fetch('http://127.0.0.1:8000/api/media/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
            body: formData,
          });

          const mediaData = await mediaRes.json();
          if (!mediaRes.ok) {
            throw new Error(mediaData.detail || 'Failed to upload media');
          }
          mediaIds.push(mediaData.media_id);
        }
      } catch (error) {
        console.error('Media upload error:', error);
        toast({
          title: "Error",
          description: "Failed to upload media. Please try again.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
    }

    // Step 2: Create thread with media_ids
    try {
      const payload = {
        title,
        content,
        hashtags,
        media_ids: mediaIds,
      };

      const response = await fetch('http://127.0.0.1:8000/api/threads/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create thread');
      }

      toast({
        title: "Success",
        description: "Your thread has been created",
      });

      onClose();
      setTitle('');
      setContent('');
      setHashtags('');
      setFiles(null); // Fixed: Now using null instead of an empty string
    } catch (error) {
      console.error('Error creating thread:', error);
      toast({
        title: "Error",
        description: "Failed to create thread. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Thread</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Thread title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          <div>
            <Input
              placeholder="Add hashtags (comma separated)"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="file"
              onChange={(e) => setFiles(e.target.files)}
              accept="image/*,video/*"
              multiple
              className="cursor-pointer"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Thread"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
