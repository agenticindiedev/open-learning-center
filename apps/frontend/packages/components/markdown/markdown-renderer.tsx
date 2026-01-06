import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { IMarkdownRendererProps } from "@interfaces/markdown-renderer.interface";

export function MarkdownRenderer({ content }: IMarkdownRendererProps): JSX.Element {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
