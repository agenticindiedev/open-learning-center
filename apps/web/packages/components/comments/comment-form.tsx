"use client";

import { useAuth } from "@clerk/nextjs";
import { Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
}

export function CommentForm({ onSubmit, isSubmitting }: CommentFormProps) {
  const { isSignedIn } = useAuth();
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    await onSubmit(content.trim());
    setContent("");
  };

  if (!isSignedIn) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">
          <Link href="/sign-in" className="font-medium text-primary hover:underline">
            Sign in
          </Link>{" "}
          to join the discussion
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts or ask a question..."
        rows={3}
        maxLength={2000}
        className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{content.length}/2000</span>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
