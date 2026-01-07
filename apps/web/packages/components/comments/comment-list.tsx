"use client";

import type { Comment } from "@interfaces/comment.interface";
import { CommentService } from "@services/comment.service";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

interface CommentListProps {
  lessonId: string;
}

export function CommentList({ lessonId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [lessonId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CommentService.getByLessonId(lessonId);
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (content: string) => {
    try {
      setIsSubmitting(true);
      const newComment = await CommentService.create({ lessonId, content });
      setComments((prev) => [newComment, ...prev]);
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      setDeletingId(commentId);
      await CommentService.delete(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Discussion ({comments.length})
        </h2>
      </div>

      <CommentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border border-border bg-card p-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-destructive">
          {error}
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDelete}
              isDeleting={deletingId === comment._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
