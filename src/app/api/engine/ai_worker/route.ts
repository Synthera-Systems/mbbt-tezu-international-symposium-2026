// src/app/api/engine/ai_worker/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendRegistrationVerifiedEmail, sendActionRequiredEmail } from "@/lib/email";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { delegateId, utrNumber, screenshotUrl, email, fullName, referenceId, actionToken } = body;

    console.log(`[AI Worker] Starting verification for ${referenceId}...`);

    // 1. Fetch the image directly from Supabase Storage
    const imageResponse = await fetch(screenshotUrl);
    if (!imageResponse.ok) throw new Error("Failed to download image from storage");
    
    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // 2. Run the Gemini Vision Analysis
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `
      You are a strict, highly accurate financial auditing AI for an academic symposium. 
      Analyze the provided bank transfer/UPI payment screenshot.
      
      The user claims their 12-digit UTR/Transaction ID is: ${utrNumber}
      
      Perform these exact checks:
      1. Is this a legitimate banking/UPI payment receipt?
      2. Does the UTR/Transaction ID in the image EXACTLY match the claimed UTR?
      
      Respond ONLY with a valid, raw JSON object using this schema:
      {
        "isValidReceipt": boolean,
        "reason": "string explaining why it passed or exactly why it failed"
      }
    `;

    const imagePart = { inlineData: { data: base64Image, mimeType } };
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
    const aiData = JSON.parse(responseText);

    // 3. Update the Database based on Gemini's decision
    const newStatus = aiData.isValidReceipt ? "PENDING_APPROVAL" : "ACTION_REQUIRED";
    
    await prisma.payment.update({
      where: { delegateId },
      data: {
        status: newStatus,
        aiValidationLog: JSON.stringify(aiData)
      }
    });

    // 4. Log the outcome and trigger the correct Nodemailer email!
    if (aiData.isValidReceipt) {
      console.log(`[AI Worker] SUCCESS: ${referenceId} verified.`);
      // Run email in background (no await)
      sendRegistrationVerifiedEmail(email, fullName, referenceId); 
    } else {
      console.log(`[AI Worker] FAILED: ${referenceId} rejected. Reason: ${aiData.reason}`);
      // Run email in background (no await)
      sendActionRequiredEmail(email, fullName, actionToken, aiData.reason);
    }

    return NextResponse.json({ success: true, status: newStatus });

  } catch (error) {
    console.error("[AI Worker Fatal Error]:", error);
    return NextResponse.json({ error: "Background processing failed" }, { status: 500 });
  }
}