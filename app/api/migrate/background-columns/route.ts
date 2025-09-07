import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { action } = await request.json().catch(() => ({ action: 'check' }))
    const supabase = createClient()
    
    // Check current table structure first
    const { data: posts, error: fetchError } = await supabase
      .from("posts")
      .select("*")
      .limit(1)

    if (fetchError) {
      return NextResponse.json({ 
        error: "Failed to fetch posts", 
        details: fetchError.message 
      }, { status: 500 })
    }

    // Check if background columns exist
    const hasBackgroundColumns = posts && posts.length > 0 && 
      ('background_color' in posts[0] && 'opacity' in posts[0])

    if (action === 'migrate' && !hasBackgroundColumns) {
      // Try to add the columns by attempting an update with these fields
      // This will fail, giving us the error we need to add the columns
      
      try {
        // Use raw SQL via the service role
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        
        if (!serviceRoleKey || !supabaseUrl) {
          throw new Error('Missing Supabase credentials')
        }

        // Execute the ALTER TABLE command via HTTP
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey
          },
          body: JSON.stringify({
            sql: `ALTER TABLE posts ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#000000', ADD COLUMN IF NOT EXISTS opacity INTEGER DEFAULT 100;`
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to execute migration: ${response.status} ${errorText}`)
        }

        return NextResponse.json({ 
          message: "Successfully added background_color and opacity columns",
          status: "migrated"
        })
      } catch (migrationError) {
        console.error('Migration failed:', migrationError)
        return NextResponse.json({ 
          error: "Migration failed", 
          details: migrationError instanceof Error ? migrationError.message : "Unknown error"
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      message: hasBackgroundColumns ? "Columns already exist" : "Columns need to be added",
      hasBackgroundColumns,
      samplePost: posts?.[0] || null,
      status: hasBackgroundColumns ? "exists" : "missing"
    })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json({ 
      error: "Migration failed", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
