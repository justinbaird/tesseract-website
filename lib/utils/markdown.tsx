export function parseMarkdown(text: string): string {
  console.log("[v0] Starting markdown parsing for text:", text.substring(0, 100) + "...")

  let result = text

  // First, process markdown images BEFORE processing links (to avoid conflicts)
  const markdownImages = result.match(/!\[([^\]]*?)\]\(([^)]+)\)/g) || []
  console.log("[v0] Found markdown images:", markdownImages.length)

  markdownImages.forEach((image) => {
    const match = image.match(/!\[([^\]]*?)\]\(([^)]+)\)/)
    if (match) {
      const [fullMatch, alt, url] = match
      console.log("[v0] Converting markdown image:", { alt, url })
      result = result.replace(
        fullMatch,
        `<img src="${url}" alt="${alt || ''}" class="w-full h-auto rounded-lg shadow-lg my-6" loading="lazy" />`,
      )
    }
  })

  // Process YouTube embeds BEFORE processing regular links
  // Format 1: [youtube:VIDEO_ID]
  result = result.replace(/\[youtube:([a-zA-Z0-9_-]{11})\]/g, (match, videoId) => {
    console.log('[v0] Converting YouTube embed (format 1):', videoId)
    return `<div class="aspect-video rounded-lg overflow-hidden shadow-lg my-6">
      <iframe src="https://www.youtube.com/embed/${videoId}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="YouTube video"></iframe>
    </div>`
  })

  // Format 2: [youtube](YOUTUBE_URL)
  result = result.replace(/\[youtube\]\((https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})[^)]*)\)/g, (match, fullUrl, videoId) => {
    console.log('[v0] Converting YouTube embed (format 2):', videoId)
    return `<div class="aspect-video rounded-lg overflow-hidden shadow-lg my-6">
      <iframe src="https://www.youtube.com/embed/${videoId}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="YouTube video"></iframe>
    </div>`
  })

  // Format 3: ![youtube](YOUTUBE_URL) - image-like syntax
  result = result.replace(/!\[youtube\]\((https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})[^)]*)\)/g, (match, fullUrl, videoId) => {
    console.log('[v0] Converting YouTube embed (format 3):', videoId)
    return `<div class="aspect-video rounded-lg overflow-hidden shadow-lg my-6">
      <iframe src="https://www.youtube.com/embed/${videoId}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="YouTube video"></iframe>
    </div>`
  })

  // Process existing HTML links (don't double-process them)
  const existingHtmlLinks = result.match(/<a\s+[^>]*href\s*=\s*["'][^"']*["'][^>]*>.*?<\/a>/gi) || []
  console.log("[v0] Found existing HTML links:", existingHtmlLinks.length)

  // Process HTML anchor tags - convert them to styled links
  result = result.replace(
    /<a\s+([^>]*href\s*=\s*["']([^"']*)["'][^>]*)>(.*?)<\/a>/gi,
    (match, attributes, url, text) => {
      console.log("[v0] Processing HTML link:", { url, text })
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${text}</a>`
    },
  )

  // Process markdown links (but not image links that were already processed)
  const markdownLinks = result.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []
  console.log("[v0] Found markdown links:", markdownLinks.length)

  markdownLinks.forEach((link) => {
    const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/)
    if (match) {
      const [fullMatch, text, url] = match
      // Skip if this looks like it's part of an image (has ! before it)
      if (result.indexOf('!' + fullMatch) !== -1) {
        return
      }
      // Skip if this is a YouTube embed that was already processed
      if (text.toLowerCase() === 'youtube') {
        return
      }
      console.log("[v0] Converting markdown link:", { text, url })
      result = result.replace(
        fullMatch,
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${text}</a>`,
      )
    }
  })


  // Process headings with better spacing
  result = result.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mb-3 mt-6">$1</h3>')
  result = result.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mb-3 mt-6">$1</h2>')
  result = result.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mb-4 mt-0">$1</h1>')

  // Process bold text
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')

  // Process italic text
  result = result.replace(/\*(.*?)\*/g, '<em class="italic text-white">$1</em>')

  // Better list processing - handle multiple lines and proper nesting
  const lines = result.split('\n')
  const processedLines: string[] = []
  let inList = false
  let listItems: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()
    
    // Check if this is a list item
    if (trimmedLine.match(/^[\*\-] /)) {
      const listContent = trimmedLine.replace(/^[\*\-] /, '')
      listItems.push(`<li class="text-white mb-1 ml-4">${listContent}</li>`)
      inList = true
    } else {
      // If we were in a list and now we're not, close the list
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul class="list-disc list-outside mb-4 pl-5 space-y-1">${listItems.join('')}</ul>`)
        listItems = []
        inList = false
      }
      
      // Add the line (preserve empty lines for paragraph breaks)
      processedLines.push(line)
    }
  }

  // Close any remaining list
  if (inList && listItems.length > 0) {
    processedLines.push(`<ul class="list-disc list-outside mb-4 pl-5 space-y-1">${listItems.join('')}</ul>`)
  }

  // Rejoin the lines
  result = processedLines.join('\n')

  // Now split by double newlines to identify paragraphs
  const paragraphs = result.split('\n\n')
  result = paragraphs.map(paragraph => {
    const trimmedParagraph = paragraph.trim()
    if (trimmedParagraph) {
      // If it's not already a structured element (heading, list, etc.)
      if (!trimmedParagraph.includes('<h') && !trimmedParagraph.includes('<ul') && !trimmedParagraph.includes('</ul>')) {
        return `<div class="mb-6">${trimmedParagraph}</div>`
      }
      return trimmedParagraph
    }
    return ''
  }).filter(p => p).join('\n\n')

  console.log("[v0] Final markdown result:", result.substring(0, 200) + "...")
  return result
}
