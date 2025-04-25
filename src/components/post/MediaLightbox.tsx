
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface Media {
  id?: number | string;
  type?: 'image' | 'video' | 'file';
  url?: string;
  alt?: string;
  file?: string;
  content_type?: string;
}

interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  media: Media[] | Media;
  initialIndex?: number;
}

export function MediaLightbox({ isOpen, onClose, media, initialIndex = 0 }: MediaLightboxProps) {
  const mediaArray = Array.isArray(media) ? media : [media];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur">
        <Carousel className="w-full" defaultIndex={initialIndex}>
          <CarouselContent>
            {mediaArray.map((item, index) => {
              const url = item.url || item.file || '';
              const type = item.type || (item.content_type?.startsWith('video') ? 'video' : 'image');

              return (
                <CarouselItem key={index}>
                  <div className="flex items-center justify-center p-2">
                    {type === 'video' ? (
                      <video
                        src={url}
                        controls
                        className="max-h-[80vh] w-auto"
                        autoPlay
                      />
                    ) : (
                      <img
                        src={url}
                        alt={item.alt || 'Media content'}
                        className="max-h-[80vh] w-auto object-contain"
                      />
                    )}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {mediaArray.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
