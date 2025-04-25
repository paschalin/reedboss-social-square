import { useState } from 'react';
import { MediaLightbox } from './MediaLightbox';

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!media) return null;
  
  const mediaArray = Array.isArray(media) ? media : [media];
  
  return (
    <>
      <div className="my-3 space-y-2">
        {mediaArray.map((item, index) => {
          const url = item.url || item.file || '';
          const alt = item.alt || 'Media content';
          
          if (!url) return null;
          
          const type = item.type || (item.content_type && item.content_type.startsWith('video') 
            ? 'video' 
            : 'image');
          
          return (
            <div 
              key={`media-${index}`} 
              className="relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedIndex(index);
                setLightboxOpen(true);
              }}
            >
              {type === 'video' ? (
                <video 
                  src={url}
                  controls
                  className="w-full max-h-[400px] object-contain"
                />
              ) : (
                <img
                  src={url}
                  alt={alt}
                  className="w-full max-h-[400px] object-contain"
                />
              )}
            </div>
          );
        })}
      </div>
      
      <MediaLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        media={media}
        initialIndex={selectedIndex}
      />
    </>
  );
}
