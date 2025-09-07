import { NextResponse } from "next/server"
import { getHierarchicalPages } from "@/lib/pages"

export async function GET() {
  try {
    const pages = await getHierarchicalPages()
    return NextResponse.json(pages)
  } catch (error) {
    console.error("Failed to fetch navigation pages:", error)
    return NextResponse.json({ error: "Failed to fetch navigation pages" }, { status: 500 })
  }
}
