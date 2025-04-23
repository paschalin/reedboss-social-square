
import { Copy, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PostShareMenuProps {
  threadSlug: string;
  title: string;
}

export function PostShareMenu({ threadSlug, title }: PostShareMenuProps) {
  const { toast } = useToast();
  const shareUrl = `${window.location.origin}/t/${threadSlug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "Thread link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      instagram: `https://www.instagram.com/`
    };

    window.open(links[platform as keyof typeof links], '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <Share className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
          <Facebook className="mr-2 h-4 w-4" />
          Share to Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('twitter')}>
          <Twitter className="mr-2 h-4 w-4" />
          Share to Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('linkedin')}>
          <Linkedin className="mr-2 h-4 w-4" />
          Share to LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('instagram')}>
          <Instagram className="mr-2 h-4 w-4" />
          Share to Instagram
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
