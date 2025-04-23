
interface MediaItem {
  type: 'image' | 'video' | 'file';
  url: string;
  alt?: string;
}

interface PostMediaProps {
  media: MediaItem[];
}

export function PostMedia({ media }: PostMediaProps) {
  if (!media || media.length === 0) return null;

  return (
    <div className="mb-3">
      {media.map((mediaItem, index) => {
        if (mediaItem.type === 'image') {
          return (
            <img
              key={index}
              src={mediaItem.url}
              alt={mediaItem.alt || 'Media'}
              className="w-full h-auto rounded-md mb-2"
            />
          );
        }
        if (mediaItem.type === 'video') {
          return (
            <video
              key={index}
              controls
              className="w-full h-auto rounded-md mb-2"
            >
              <source src={mediaItem.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
        }
        if (mediaItem.type === 'file') {
          return (
            <a
              key={index}
              href={mediaItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block mb-2"
            >
              {mediaItem.alt || 'Download File'}
            </a>
          );
        }
        return null;
      })}
    </div>
  );
}
