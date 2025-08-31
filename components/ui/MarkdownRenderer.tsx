import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  return (
    <div
      className={`prose prose-lg max-w-none ${className}`}
      style={{ whiteSpace: "pre-wrap" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // Ensure line breaks are properly rendered
          br: ({ ...props }) => <br {...props} />,
          // Ensure paragraphs have proper spacing
          p: ({ children, ...props }) => (
            <p className="mb-4 leading-relaxed whitespace-pre-wrap" {...props}>
              {children}
            </p>
          ),
          // Support for underline tags
          u: ({ children, ...props }) => (
            <u className="underline decoration-2 underline-offset-2" {...props}>
              {children}
            </u>
          ),
          // Support for other HTML formatting tags
          mark: ({ children, ...props }) => (
            <mark className="bg-yellow-200 px-1 rounded" {...props}>
              {children}
            </mark>
          ),
          sub: ({ children, ...props }) => (
            <sub className="text-xs" {...props}>
              {children}
            </sub>
          ),
          sup: ({ children, ...props }) => (
            <sup className="text-xs" {...props}>
              {children}
            </sup>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
