
import { useCallback, useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface MediaPreviewProps {
  files: FileList | null;
}

export function MediaPreview({ files }: MediaPreviewProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const generatePreviews = useCallback((files: FileList) => {
    const urls: string[] = [];
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      urls.push(url);
    });
    setPreviewUrls(urls);
    return () => {
      urls.forEach(URL.revokeObjectURL);
    };
  }, []);

  useEffect(() => {
    if (files) {
      const cleanup = generatePreviews(files);
      return cleanup;
    }
  }, [files, generatePreviews]);

  if (!files || files.length === 0) return null;

  return (
    <div className="mt-4">
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {Array.from(files).map((file, index) => (
            <CarouselItem key={index}>
              {file.type.startsWith('image/') ? (
                <img
                  src={previewUrls[index]}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-40 object-cover rounded-md"
                />
              ) : file.type.startsWith('video/') ? (
                <video
                  src={previewUrls[index]}
                  className="w-full h-40 object-cover rounded-md"
                  controls
                />
              ) : null}
            </CarouselItem>
          ))}
        </CarouselContent>
        {files.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  );
}
