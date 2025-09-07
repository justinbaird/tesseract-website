import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // For now, we'll use a webhook approach or you can integrate with services like Resend, SendGrid, etc.

    // Simple email sending using a service like Formspree, Netlify Forms, or similar
    // This is a placeholder - you'll need to configure your preferred email service

    const emailData = {
      to: "justin@justinbaird.com",
      from: email,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    }

    console.log("[v0] Contact form submission:", emailData)

    // For now, we'll log the email data and return success
    // In production, you would integrate with your email service here

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    })
  } catch (error) {
    console.error("[v0] Contact form error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
