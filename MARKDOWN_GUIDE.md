# Markdown Embedding Guide

This website supports markdown for embedding images, videos, and Google Drive files directly in Text Blocks.

## Images

Use standard markdown image syntax:

```markdown
![Alt text](https://example.com/image.jpg)
```

Images will be displayed with responsive styling and rounded corners.

## Videos

### YouTube Videos

Multiple formats are supported:

```markdown
[youtube:dQw4w9WgXcQ]

[youtube](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

![youtube](https://youtu.be/dQw4w9WgXcQ)
```

### Vimeo Videos

```markdown
[vimeo](https://vimeo.com/123456789)
```

### Direct Video Files

For MP4, WebM, OGG, or MOV files:

```markdown
[video](https://example.com/video.mp4)
```

## Google Drive Files

You can embed Google Drive files (PDFs, documents, spreadsheets, presentations, etc.):

```markdown
[googledrive](https://drive.google.com/file/d/FILE_ID/view?usp=sharing)

![googledrive](https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
```

**How to get the embed URL:**
1. Open your file in Google Drive
2. Click "Share" → Make it "Anyone with the link"
3. Copy the sharing URL
4. Use it in the markdown syntax above

The system will automatically convert it to an embeddable preview format.

## Other Markdown Features

### Headings
```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Bold and Italic
```markdown
**bold text**
*italic text*
```

### Links
```markdown
[Link text](https://example.com)
```

### Lists
```markdown
- Item 1
- Item 2
- Item 3
```

## Using in Admin Interface

1. Go to `/admin`
2. Edit or create a page
3. Add a **Text Block**
4. In the content field, use the markdown syntax above
5. Save the page

## Alternative: Using Block Types

Instead of markdown, you can also use dedicated block types:

- **Image Block** - For standalone images
- **Video Block** - For video content
- **Embed Block** - For generic embeds (supports YouTube, Vimeo, Twitter, Codepen, Google Drive, and any iframe)

The Embed Block automatically detects the embed type from the URL, or you can manually select it.

