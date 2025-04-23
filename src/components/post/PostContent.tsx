
import { useState } from 'react';

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  const [expanded, setExpanded] = useState(false);
  const READ_MORE_LIMIT = 160;

  if (content.length <= READ_MORE_LIMIT) {
    return <div className="text-gray-600 mb-3">{content}</div>;
  }

  return (
    <div className="text-gray-600 mb-3">
      {expanded ? content : content.slice(0, READ_MORE_LIMIT) + "... "}
      <button 
        className="text-blue-600 text-xs font-medium ml-2 hover:underline" 
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
