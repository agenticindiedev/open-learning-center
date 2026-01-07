"use client";

import type { Comment } from "@interfaces/comment.interface";
import { useAuth } from "@clerk/nextjs";
import { Trash2, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  isDeleting: boolean;
}

export function CommentItem({ comment, onDelete, isDeleting }: CommentItemProps) {
  const { userId } = useAuth();
  const isOwner = userId === comment.userId;

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex-shrink-0">
        {comment.userAvatar ? (
          <img
            src={comment.userAvatar}
            alt={comment.userName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{comment.userName}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>

          {isOwner && (
            <button
              type="button"
              onClick={() => onDelete(comment._id)}
              disabled={isDeleting}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
              title="Delete comment"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{comment.content}</p>
      </div>
    </div>
  );
}
