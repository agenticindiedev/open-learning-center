# SOP: Content Authoring & Markdown Features

**Purpose:** Guide for writing lesson content with rich formatting, embeds, and interactive elements.
**Last Updated:** 2026-01-07

---

## Overview

The `MarkdownRenderer` component (`apps/web/packages/components/markdown/markdown-renderer.tsx`) provides rich rendering for lesson content including:

- Syntax-highlighted code blocks with copy button
- YouTube video embeds (auto-detected)
- Twitter/X embeds (auto-detected)
- Collapsible sections
- Styled prompts/templates
- External link indicators
- Tables with proper styling

---

## Quick Reference

### Code Blocks

Regular code with syntax highlighting:

````markdown
```javascript
const hello = "world";
console.log(hello);
```
````

Supported languages: `javascript`, `typescript`, `python`, `bash`, `json`, `html`, `css`, `sql`, and more.

### Prompt Templates

Use `prompt` as the language for special prompt styling:

````markdown
```prompt
You are my ad creation coach focused on conversion.
Philosophy: Conversion first, aesthetics second.
Voice: Direct, harsh, no fluff.
```
````

This renders with a "Prompt Template" header and distinct primary-color styling.

### YouTube Embeds

Simply paste a YouTube URL on its own line:

```markdown
Check out this tutorial:

https://www.youtube.com/watch?v=dQw4w9WgXcQ

Continue reading below...
```

Supported URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`

### Twitter/X Embeds

Paste a tweet URL on its own line:

```markdown
See this announcement:

https://twitter.com/username/status/123456789

Or from X:

https://x.com/username/status/123456789
```

### Collapsible Sections

Use HTML `<details>` and `<summary>` tags:

```markdown
<details>
<summary>Click to expand advanced options</summary>

This content is hidden by default.

You can include:
- Lists
- Code blocks
- Any markdown

</details>
```

### Blockquotes as Callouts

Blockquotes are styled as highlighted callouts:

```markdown
> Important: This is a key concept that students should remember.
```

### External Links

External links (starting with `http`) automatically show an external link icon.

```markdown
Learn more at [OpenAI](https://openai.com)
```

### Tables

Standard markdown tables with proper styling:

```markdown
| Feature | Support |
|---------|---------|
| Code highlighting | Yes |
| Embeds | Yes |
| Tables | Yes |
```

---

## Heading Styles

| Heading | Style |
|---------|-------|
| `# H1` | Large with bottom border |
| `## H2` | With purple accent bar |
| `### H3` | Standard bold |
| `#### H4` | Smaller bold |

---

## Best Practices

### 1. Use Collapsible Sections for Long Content

Wrap lengthy reference material in `<details>` tags:

```markdown
## Prompt Library

<details>
<summary>Image Generation Prompts</summary>

### Product Showcase
```prompt
Professional product photography of [product] on white background...
```

### Lifestyle Integration
```prompt
Professional lifestyle photography of [target audience]...
```

</details>
```

### 2. Embed Videos at Natural Break Points

Place video embeds between sections, not in the middle of paragraphs.

### 3. Use Prompt Blocks for Copyable Templates

Any text the user should copy (prompts, commands, templates) should use code blocks.

### 4. Break Long Content into Sections

Use H2 headings (`##`) to create visual sections. Each H2 gets a purple accent bar for easy scanning.

---

## Component Exports

The MarkdownRenderer exports these components for use elsewhere:

```typescript
import {
  MarkdownRenderer,
  CollapsibleSection,
  CodeBlock,
  YouTubeEmbed,
  TwitterEmbed
} from "@components/markdown/markdown-renderer";
```

---

## Related

- `apps/web/packages/components/markdown/markdown-renderer.tsx` - Source code
- `apps/web/app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx` - Lesson page using renderer
