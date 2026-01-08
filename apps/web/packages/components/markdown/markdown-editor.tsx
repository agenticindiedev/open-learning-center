"use client";

import { Button } from "@shipshitdev/ui";
import type { IMarkdownEditorProps, IToolbarAction } from "@interfaces/markdown-editor.interface";
import { useMemo, useRef } from "react";
import { MarkdownRenderer } from "./markdown-renderer";

const ACTIONS: IToolbarAction[] = [
  { label: "H2", prefix: "## ", suffix: "", placeholder: "Heading" },
  { label: "Bold", prefix: "**", suffix: "**", placeholder: "bold" },
  { label: "Italic", prefix: "*", suffix: "*", placeholder: "italic" },
  { label: "List", prefix: "- ", suffix: "", placeholder: "List item" },
  { label: "Link", prefix: "[", suffix: "](https://example.com)", placeholder: "link text" },
];

export function MarkdownEditor({ value, onChange }: IMarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const preview = useMemo(() => value || "", [value]);

  const applyAction = (action: IToolbarAction): void => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || action.placeholder;
    const nextValue =
      value.slice(0, start) + action.prefix + selected + action.suffix + value.slice(end);

    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + action.prefix.length + selected.length + action.suffix.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((action) => (
          <Button key={action.label} variant="ghost" onClick={() => applyAction(action)}>
            {action.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <textarea
          ref={textareaRef}
          className="min-h-[320px] w-full rounded-lg border border-gray-200 p-4 font-mono text-sm"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Write lesson content in Markdown"
        />
        <div className="min-h-[320px] rounded-lg border border-gray-200 bg-white p-4">
          {preview ? (
            <MarkdownRenderer content={preview} />
          ) : (
            <div className="text-sm text-gray-500">Live preview</div>
          )}
        </div>
      </div>
    </div>
  );
}
