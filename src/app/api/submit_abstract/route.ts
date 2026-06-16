// src/app/api/submit_abstract/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, authors, type, fileUrl } = body;

    if (!title || !authors || !type || !fileUrl) {
      return NextResponse.json({ error: "Missing required submission fields." }, { status: 400 });
    }

    // Generate a unique Reference ID for the abstract (e.g., ABS-A1B2C3-26)
    const referenceId = `ABS-${Math.random().toString(36).substring(2, 8).toUpperCase()}-26`;

    // Save to PostgreSQL
    const newSubmission = await prisma.submission.create({
      data: {
        title,
        authors,
        type,
        fileUrl,
        referenceId,
      },
    });

    // TODO: You can add Nodemailer here later to send a confirmation email!

    return NextResponse.json({ success: true, referenceId: newSubmission.referenceId }, { status: 201 });

  } catch (error: any) {
    console.error("Submission API Error:", error);
    return NextResponse.json(
      { error: `Database Error: ${error.message || "Unknown error"}` }, 
      { status: 500 }
    );
  }
}