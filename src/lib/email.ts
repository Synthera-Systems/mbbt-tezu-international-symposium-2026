// src/lib/email.ts
import nodemailer from 'nodemailer';

// Initialize the Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends the initial "Registration Received" email to the delegate.
 */
export const sendRegistrationReceivedEmail = async (toEmail: string, fullName: string, referenceId: string) => {
  const mailOptions = {
    from: `"MCDHD/MCDTU 2026" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Application Received - MCDHD/MCDTU 2026",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; border: 1px solid #eaeaec; border-radius: 8px;">
        <h2 style="color: #002147; border-bottom: 2px solid #eaeaec; padding-bottom: 10px;">Application Received</h2>
        <p style="font-size: 16px;">Dear ${fullName},</p>
        <p style="font-size: 16px; line-height: 1.5;">Thank you for submitting your registration for the <strong>International Symposium on Mitochondria, Cell Death, and Human Disease</strong>.</p>
        <p style="font-size: 16px; line-height: 1.5;">Your application and payment details are currently under review by our organizing committee.</p>
        
        <div style="background-color: #f4f7f6; border-left: 4px solid #002147; padding: 15px; margin: 25px 0;">
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666;">Your Tracking Reference ID</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-family: monospace; font-weight: bold; color: #002147;">${referenceId}</p>
        </div>

        <p style="font-size: 16px; line-height: 1.5;">You can use this Reference ID to track your application status on our portal at any time.</p>
        <br/>
        <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The Organizing Committee</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Success: Email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    // We log the error but don't throw it, so the registration still succeeds even if the email fails.
  }
};

// Add this below your existing code in src/lib/email.ts

export const sendRegistrationVerifiedEmail = async (toEmail: string, fullName: string, referenceId: string) => {
    const mailOptions = {
      from: `"MCDHD/MCDTU 2026" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Payment Verified - Awaiting Final Approval",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; border: 1px solid #eaeaec; border-radius: 8px;">
          <h2 style="color: #002147; border-bottom: 2px solid #eaeaec; padding-bottom: 10px;">Payment Verified</h2>
          <p style="font-size: 16px;">Dear ${fullName},</p>
          <p style="font-size: 16px; line-height: 1.5;">Great news! Our automated system has successfully verified your payment receipt for the MCDHD/MCDTU 2026 symposium.</p>
          <p style="font-size: 16px; line-height: 1.5;">Your application is now marked as <strong>Pending Final Approval</strong>. The organizing committee will do a final review and issue your official delegate pass shortly.</p>
          
          <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #166534;"><strong>Tracking ID:</strong> ${referenceId}</p>
          </div>
  
          <p style="font-size: 16px; line-height: 1.5;">You will receive one final email once your delegate pass is generated.</p>
          <br/>
          <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The Organizing Committee</strong></p>
        </div>
      `,
    };
  
    try { await transporter.sendMail(mailOptions); } 
    catch (error) { console.error("Error sending verification email:", error); }
  };
  
  export const sendActionRequiredEmail = async (toEmail: string, fullName: string, actionToken: string, reason: string) => {
    // Ensure you set NEXT_PUBLIC_BASE_URL in your .env (e.g., http://localhost:3000)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const actionLink = `${baseUrl}/action/${actionToken}`;
  
    const mailOptions = {
      from: `"MCDHD/MCDTU 2026" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Action Required: Payment Verification Failed",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; border: 1px solid #eaeaec; border-radius: 8px;">
          <h2 style="color: #93000a; border-bottom: 2px solid #eaeaec; padding-bottom: 10px;">Action Required</h2>
          <p style="font-size: 16px;">Dear ${fullName},</p>
          <p style="font-size: 16px; line-height: 1.5;">We encountered an issue while verifying your payment receipt for the MCDHD/MCDTU 2026 symposium.</p>
          
          <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #9f1239;"><strong>Reason for failure:</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: bold; color: #9f1239;">${reason}</p>
          </div>
  
          <p style="font-size: 16px; line-height: 1.5;">Don't worry! Your registration details are saved. You just need to upload a clearer image of your bank transfer/UPI receipt.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionLink}" style="background-color: #002147; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Upload New Receipt</a>
          </div>
  
          <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">If the button doesn't work, copy and paste this secure link into your browser: <br/><br/><span style="word-break: break-all; color: #0056b3;">${actionLink}</span></p>
        </div>
      `,
    };
  
    try { await transporter.sendMail(mailOptions); } 
    catch (error) { console.error("Error sending action required email:", error); }
  };