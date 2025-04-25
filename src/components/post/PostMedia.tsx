
interface Media {
  id?: number | string;
  type?: 'image' | 'video' | 'file';
  url?: string;
  alt?: string;
  file?: string;
  content_type?: string;
  media_id?: string;
  uploaded_at?: string;
}

interface PostMediaProps {
  media?: Media[] | Media | null;
}

export function PostMedia({ media }: PostMediaProps) {
  if (!media) return null;
  
  // Convert single media object to array for consistent processing
  const mediaArray = Array.isArray(media) ? media : [media];
  
  return (
    <div className="my-3 space-y-2">
      {mediaArray.map((item, index) => {
        // Extract URL from either media format
        const url = item.url || item.file || '';
        const alt = item.alt || 'Media content';
        
        if (!url) return null;
        
        // Determine content type (defaulting to image)
        const type = item.type || (item.content_type && item.content_type.startsWith('video') 
          ? 'video' 
          : 'image');
        
        if (type === 'video') {
          return (
            <div key={`media-${index}`} className="relative rounded-lg overflow-hidden">
              <video 
                src={url}
                controls
                className="w-full max-h-[400px] object-contain"
              />
            </div>
          );
        }
        
        return (
          <div key={`media-${index}`} className="relative rounded-lg overflow-hidden">
            <img
              src={url}
              alt={alt}
              className="w-full max-h-[400px] object-contain"
            />
          </div>
        );
      })}
    </div>
  );
}
