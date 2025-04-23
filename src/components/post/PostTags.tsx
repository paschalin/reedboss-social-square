
interface PostTagsProps {
  tags: string[];
}

export function PostTags({ tags }: PostTagsProps) {
  return (
    <div className="flex gap-2">
      {tags.length > 0 ? (
        tags.map((tag: string) => (
          <span
            key={tag}
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
