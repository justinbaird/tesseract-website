"use client"

import { parseMarkdown } from "@/lib/utils/markdown"

export default function TestMarkdownPage() {
  const testContent = `# Test Markdown Links

This is a test page to verify markdown link parsing is working.

Here are some test links:
- [Grooveworks](https://grooveworks.sg)
- [Google](https://google.com)
- [GitHub](https://github.com)

**Bold text** and *italic text* should also work.

## Subheading

More content with [another link](https://example.com) in the middle of text.`

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Markdown Test Page</h1>
          <p className="text-gray-400">This page tests if markdown link parsing is working correctly.</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Raw Markdown:</h2>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap">{testContent}</pre>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mt-6">
          <h2 className="text-2xl font-bold mb-4">Parsed Result:</h2>
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(testContent) }}
          />
        </div>

        <div className="mt-8 p-4 bg-blue-900 rounded-lg">
          <p className="text-blue-200">
            <strong>Instructions:</strong> Check the browser console for debug logs. If links are clickable and blue,
            the markdown parsing is working correctly.
          </p>
        </div>
      </div>
    </div>
  )
}
