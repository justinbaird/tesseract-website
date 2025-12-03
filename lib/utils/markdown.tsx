export function parseMarkdown(text: string): string {
  if (!text || !text.trim()) {
    return ''
  }

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

  // Process Vimeo embeds
  // Format: [vimeo](VIMEO_URL)
  result = result.replace(/\[vimeo\]\((https:\/\/vimeo\.com\/(\d+)[^)]*)\)/g, (match, fullUrl, videoId) => {
    console.log('[v0] Converting Vimeo embed:', videoId)
    return `<div class="aspect-video rounded-lg overflow-hidden shadow-lg my-6">
      <iframe src="https://player.vimeo.com/video/${videoId}" class="w-full h-full" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Vimeo video"></iframe>
    </div>`
  })

  // Process direct video file embeds (MP4, WebM, etc.)
  // Format: [video](VIDEO_URL)
  result = result.replace(/\[video\]\((https?:\/\/[^)]+\.(?:mp4|webm|ogg|mov)[^)]*)\)/g, (match, url) => {
    console.log('[v0] Converting video embed:', url)
    return `<div class="aspect-video rounded-lg overflow-hidden shadow-lg my-6">
      <video class="w-full h-full" controls>
        <source src="${url}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>`
  })

  // Process Google Drive embeds
  // Format 1: [googledrive](GOOGLE_DRIVE_URL)
  result = result.replace(/\[googledrive\]\((https:\/\/drive\.google\.com\/[^)]+)\)/g, (match, url) => {
    console.log('[v0] Converting Google Drive embed:', url)
    // Extract file ID
    let fileId: string | null = null
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (fileIdMatch) {
      fileId = fileIdMatch[1]
    }
    
    if (fileId) {
      let embedUrl = `https://drive.google.com/file/d/${fileId}/preview`
      // For Docs, Sheets, Slides use preview format
      if (url.includes('/document/') || url.includes('/spreadsheets/') || url.includes('/presentation/')) {
        embedUrl = url.replace(/\/edit.*$/, '/preview').replace(/\/view.*$/, '/preview')
      }
      return `<div class="w-full rounded-lg overflow-hidden shadow-lg my-6" style="height: 600px;">
        <iframe src="${embedUrl}" class="w-full h-full" frameborder="0" allow="autoplay" allowfullscreen title="Google Drive document"></iframe>
      </div>`
    }
    return match // Return original if we can't parse
  })

  // Format 2: ![googledrive](GOOGLE_DRIVE_URL) - image-like syntax
  result = result.replace(/!\[googledrive\]\((https:\/\/drive\.google\.com\/[^)]+)\)/g, (match, url) => {
    console.log('[v0] Converting Google Drive embed (format 2):', url)
    let fileId: string | null = null
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (fileIdMatch) {
      fileId = fileIdMatch[1]
    }
    
    if (fileId) {
      let embedUrl = `https://drive.google.com/file/d/${fileId}/preview`
      if (url.includes('/document/') || url.includes('/spreadsheets/') || url.includes('/presentation/')) {
        embedUrl = url.replace(/\/edit.*$/, '/preview').replace(/\/view.*$/, '/preview')
      }
      return `<div class="w-full rounded-lg overflow-hidden shadow-lg my-6" style="height: 600px;">
        <iframe src="${embedUrl}" class="w-full h-full" frameborder="0" allow="autoplay" allowfullscreen title="Google Drive document"></iframe>
      </div>`
    }
    return match
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
      // Skip if this is a Google Drive embed that was already processed
      if (text.toLowerCase() === 'googledrive') {
        return
      }
      console.log("[v0] Converting markdown link:", { text, url })
      result = result.replace(
        fullMatch,
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${text}</a>`,
      )
    }
  })

  // Process headings FIRST (before other block-level elements)
  // Headings must be on their own line
  result = result.replace(/^### (.*)$/gim, '<h3 class="text-xl font-bold text-white mb-3 mt-6">$1</h3>')
  result = result.replace(/^## (.*)$/gim, '<h2 class="text-2xl font-bold text-white mb-3 mt-6">$1</h2>')
  result = result.replace(/^# (.*)$/gim, '<h1 class="text-3xl font-bold text-white mb-4 mt-6">$1</h1>')

  // Process lists - handle multiple lines and proper nesting
  const lines = result.split('\n')
  const processedLines: string[] = []
  let inList = false
  let listItems: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()
    
    // Check if this is a list item (must start with * or - followed by space)
    if (trimmedLine.match(/^[\*\-]\s+/)) {
      const listContent = trimmedLine.replace(/^[\*\-]\s+/, '')
      // Parse inline formatting in list items
      let formattedContent = listContent
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-white">$1</em>')
      listItems.push(`<li class="text-white mb-1 ml-4">${formattedContent}</li>`)
      inList = true
    } else {
      // If we were in a list and now we're not, close the list
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul class="list-disc list-outside mb-4 pl-5 space-y-1">${listItems.join('')}</ul>`)
        listItems = []
        inList = false
      }
      
      // Add the line as-is (headings and other elements already processed)
      processedLines.push(line)
    }
  }

  // Close any remaining list
  if (inList && listItems.length > 0) {
    processedLines.push(`<ul class="list-disc list-outside mb-4 pl-5 space-y-1">${listItems.join('')}</ul>`)
  }

  // Rejoin the lines
  result = processedLines.join('\n')

  // Process bold text first (must come before italic to avoid conflicts)
  result = result.replace(/\*\*([^*]+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
  
  // Process italic text (single asterisk, but not **)
  // Only process on lines that don't already contain HTML tags (to avoid processing inside tags)
  const linesForItalic = result.split('\n')
  result = linesForItalic.map(line => {
    // If line already contains HTML tags, skip italic processing
    if (line.includes('<') && line.includes('>')) {
      return line
    }
    // Process italic on plain text lines
    return line.replace(/\*([^*]+?)\*/g, '<em class="italic text-white">$1</em>')
  }).join('\n')

  // Now split by double newlines to identify paragraphs
  // But preserve structured elements (headings, lists, etc.)
  const paragraphs = result.split(/\n\n+/)
  result = paragraphs.map(paragraph => {
    const trimmedParagraph = paragraph.trim()
    if (!trimmedParagraph) return ''
    
    // If it's already a structured element (heading, list, image, video embed), return as-is
    if (trimmedParagraph.includes('<h') || 
        trimmedParagraph.includes('<ul') || 
        trimmedParagraph.includes('</ul>') ||
        trimmedParagraph.includes('<img') ||
        trimmedParagraph.includes('<div class="aspect-video') ||
        trimmedParagraph.includes('<div class="w-full rounded-lg')) {
      return trimmedParagraph
    }
    
    // Otherwise, wrap in paragraph div
    return `<div class="mb-4 text-gray-300">${trimmedParagraph}</div>`
  }).filter(p => p).join('\n')

  console.log("[v0] Final markdown result:", result.substring(0, 200) + "...")
  return result
}
