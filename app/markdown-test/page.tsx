import { parseMarkdown } from "@/lib/utils/markdown"

export default function MarkdownTestPage() {
  const testContent = `# Test Markdown Links

This is a test page to verify markdown link parsing is working.

Here are some test links:
- [Grooveworks](https://grooveworks.sg)
- [Google](https://google.com)
- [GitHub](https://github.com)

**Bold text** and *italic* text should also work.

## HTML Links Test

Here are the same links using HTML syntax:
- <a href="https://grooveworks.sg">Grooveworks HTML</a>
- <a href="https://google.com">Google HTML</a>
- <a href="https://github.com">GitHub HTML</a>

## Subheading

More content with [another link](https://example.com) in the middle of text.

And an HTML link in the middle: <a href="https://vercel.com">Vercel</a> should work too.`

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(testContent) }}
        />

        <div className="mt-8 p-4 bg-blue-600 rounded-lg">
          <p className="text-sm">
            <strong>Instructions:</strong> Check the browser console for debug logs. If links are clickable and blue,
            the markdown parsing is working correctly. Both markdown [text](url) and HTML &lt;a
            href="url"&gt;text&lt;/a&gt; syntax should work.
          </p>
        </div>
      </div>
    </div>
  )
}
