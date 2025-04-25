
interface PostTagsProps {
  tags: string[] | string | null | undefined;
}

export function PostTags({ tags }: PostTagsProps) {
  // Convert string tags to array or default to empty array
  const tagsArray: string[] = Array.isArray(tags) 
    ? tags 
    : typeof tags === 'string' 
      ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

  return (
    <div className="flex gap-2">
      {tagsArray.length > 0 ? (
        tagsArray.map((tag: string, index: number) => (
          <span
            key={`${tag}-${index}`}
            className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
          >
            #{tag}
          </span>
        ))
      ) : (
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
          #general
        </span>
      )}
    </div>
  );
}
