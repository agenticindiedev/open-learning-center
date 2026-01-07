"use client";

import type { IMarkdownRendererProps } from "@interfaces/markdown-renderer.interface";
import { ChevronDown, Copy, Check, ExternalLink } from "lucide-react";
import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// ============================================================================
// EMBED COMPONENTS
// ============================================================================

function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
      <iframe
        title="YouTube video"
        src={`https://www.youtube.com/embed/${videoId}`}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function TwitterEmbed({ tweetUrl }: { tweetUrl: string }) {
  return (
    <div className="my-6 flex justify-center">
      <blockquote className="twitter-tweet" data-theme="dark">
        <a href={tweetUrl}>Loading tweet...</a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js" />
    </div>
  );
}

// ============================================================================
// CODE BLOCK WITH COPY BUTTON
// ============================================================================

function CodeBlock({
  language,
  children,
  isPrompt,
}: {
  language: string;
  children: string;
  isPrompt?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Special styling for prompts
  if (isPrompt || language === "prompt") {
    return (
      <div className="group relative my-4 rounded-lg border border-primary/20 bg-primary/5">
        <div className="flex items-center justify-between border-b border-primary/20 px-4 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Prompt Template
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {children}
        </pre>
      </div>
    );
  }

  return (
    <div className="group relative my-4">
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-muted/50 px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">{language || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
          fontSize: "0.875rem",
        }}
        wrapLongLines
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

// ============================================================================
// COLLAPSIBLE SECTION
// ============================================================================

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-4 rounded-lg border border-border bg-card/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-foreground hover:bg-muted/50 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="border-t border-border px-4 py-4">{children}</div>}
    </div>
  );
}

// ============================================================================
// URL DETECTION HELPERS
// ============================================================================

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function isTwitterUrl(url: string): boolean {
  return /^https?:\/\/(twitter\.com|x\.com)\/\w+\/status\/\d+/.test(url);
}

// ============================================================================
// CUSTOM MARKDOWN COMPONENTS
// ============================================================================

const components: Components = {
  // Headings with visual separation
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-foreground mt-8 mb-6 pb-3 border-b border-border">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-foreground mt-10 mb-4 flex items-center gap-2">
      <span className="h-6 w-1 rounded-full bg-primary" />
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">{children}</h4>
  ),

  // Paragraphs - check for standalone URLs to embed
  p: ({ children, node }) => {
    // Check if this paragraph contains only a link (for embedding)
    if (
      node?.children?.length === 1 &&
      node.children[0].type === "element" &&
      node.children[0].tagName === "a"
    ) {
      const href = node.children[0].properties?.href as string;

      // YouTube embed
      const youtubeId = extractYouTubeId(href);
      if (youtubeId) {
        return <YouTubeEmbed videoId={youtubeId} />;
      }

      // Twitter embed
      if (isTwitterUrl(href)) {
        return <TwitterEmbed tweetUrl={href} />;
      }
    }

    return <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>;
  },

  // Links with external indicator
  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http");

    // Don't render as link if it's a YouTube/Twitter URL (will be embedded)
    if (href && (extractYouTubeId(href) || isTwitterUrl(href))) {
      return <>{children}</>;
    }

    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-primary underline underline-offset-2 hover:text-primary/80 inline-flex items-center gap-1"
      >
        {children}
        {isExternal && <ExternalLink className="h-3 w-3" />}
      </a>
    );
  },

  // Code blocks with syntax highlighting
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const isInline = !match && !className;

    if (isInline) {
      return (
        <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    }

    const language = match ? match[1] : "";
    const codeString = String(children).replace(/\n$/, "");

    return <CodeBlock language={language} isPrompt={language === "prompt"}>{codeString}</CodeBlock>;
  },

  // Pre tag - just pass through, code handles it
  pre: ({ children }) => <>{children}</>,

  // Lists
  ul: ({ children }) => (
    <ul className="my-4 ml-6 list-disc space-y-2 text-muted-foreground">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2 text-muted-foreground">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,

  // Blockquotes styled as callouts
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-primary bg-primary/5 pl-4 py-3 pr-4 rounded-r-lg italic text-muted-foreground">
      {children}
    </blockquote>
  ),

  // Tables
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-t border-border px-4 py-3 text-muted-foreground">{children}</td>
  ),

  // Horizontal rule
  hr: () => <hr className="my-8 border-border" />,

  // Strong/Bold
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,

  // Emphasis/Italic
  em: ({ children }) => <em className="italic">{children}</em>,

  // Details/Summary for native collapsible
  details: ({ children }) => (
    <details className="my-4 rounded-lg border border-border bg-card/50 overflow-hidden group">
      {children}
    </details>
  ),
  summary: ({ children }) => (
    <summary className="cursor-pointer px-4 py-3 font-semibold text-foreground hover:bg-muted/50 transition-colors list-none flex items-center justify-between">
      {children}
      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
    </summary>
  ),
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MarkdownRenderer({ content }: IMarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Export utilities for use elsewhere
export { CollapsibleSection, CodeBlock, YouTubeEmbed, TwitterEmbed };
