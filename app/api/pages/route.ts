import { type NextRequest, NextResponse } from "next/server"
import { createPage, getPages } from "@/lib/pages"

export async function GET() {
  try {
    const pages = await getPages()
    return NextResponse.json(pages)
  } catch (error) {
    console.error("Failed to fetch pages:", error)
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const page = await createPage(body)
    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error("Failed to create page:", error)
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 })
  }
}
