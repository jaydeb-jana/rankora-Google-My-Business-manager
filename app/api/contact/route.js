import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { sendMail } from '@/lib/mail';
import { settingsRepo } from '@/lib/repositories';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const sessionUser = await getSessionUser();
    const inquiry = {
      id: 'INQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      subject: subject || 'Google Business Profile Review Automation',
      message: message.trim(),
      userBusinessName: sessionUser?.businessName || 'Guest User',
      userEmail: sessionUser?.email || null,
      userId: sessionUser?._id ? String(sessionUser._id) : null,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to local persistent inquiries file in .data for audit and admin history
    try {
      const dataDir = path.join(process.cwd(), '.data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const inquiriesFile = path.join(dataDir, 'inquiries.json');
      let inquiries = [];
      if (fs.existsSync(inquiriesFile)) {
        try {
          inquiries = JSON.parse(fs.readFileSync(inquiriesFile, 'utf8'));
        } catch (e) {
          inquiries = [];
        }
      }
      inquiries.unshift(inquiry);
      fs.writeFileSync(inquiriesFile, JSON.stringify(inquiries, null, 2), 'utf8');
    } catch (saveErr) {
      console.error('[Contact API] Error saving inquiry to file:', saveErr);
    }

    // 2. Resolve admin SMTP sender and recipient info
    const TARGET_EMAIL = 'info@arventaventures.online';
    let adminSupportEmail = null;
    let senderFromName = 'RANKORA Official Desk';

    try {
      const config = await settingsRepo.getSettings();
      if (config?.smtp?.fromName) {
        senderFromName = config.smtp.fromName;
      }
      if (config?.general?.supportEmail && config.general.supportEmail.includes('@')) {
        adminSupportEmail = config.general.supportEmail.trim();
      }
    } catch (cfgErr) {
      // fallback
    }

    // 3. Dispatch email via the exact Admin SMTP email used to send OTPs
    const mailResult = await sendMail({
      to: TARGET_EMAIL,
      replyTo: inquiry.email,
      fromName: senderFromName,
      subject: `[New Inquiry #${inquiry.id}] ${inquiry.subject} — ${inquiry.name}`,
      text: `New Official Inquiry from RANKORA\n\nTicket: #${inquiry.id}\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone || 'N/A'}\nBusiness: ${inquiry.userBusinessName}\nSubject: ${inquiry.subject}\n\nMessage:\n${inquiry.message}\n\nOperated by Arventa Ventures (arventaventures.online)`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Inquiry #${inquiry.id}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #202124;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 32px 12px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #dadce0; overflow: hidden; box-shadow: 0 2px 6px rgba(60,64,67,0.08);">
                  
                  <!-- Top Brand Header -->
                  <tr>
                    <td style="padding: 24px 32px; background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%); color: #ffffff;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <div style="font-size: 20px; font-weight: bold; letter-spacing: -0.5px;">RANKORA</div>
                            <div style="font-size: 11px; opacity: 0.9; margin-top: 2px;">Google Business Profile Manager • Operated by Arventa Ventures</div>
                          </td>
                          <td align="right">
                            <span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: bold; background-color: rgba(255,255,255,0.2); border-radius: 20px; border: 1px solid rgba(255,255,255,0.3);">
                              #${inquiry.id}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Main Content Area -->
                  <tr>
                    <td style="padding: 32px;">
                      <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #202124;">
                        New Official Inquiry Received
                      </h2>
                      <p style="margin: 0 0 24px 0; font-size: 13px; color: #5f6368; line-height: 1.5;">
                        A customer or business owner submitted the inquiry form on your RANKORA platform.
                      </p>

                      <!-- Sender Detail Table -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; border: 1px solid #e8eaed; border-radius: 12px; margin-bottom: 24px; font-size: 13px;">
                        <tr>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #e8eaed; font-weight: bold; color: #5f6368; width: 35%;">Client Full Name:</td>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #e8eaed; color: #202124; font-weight: 600;">${inquiry.name}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #e8eaed; font-weight: bold; color: #5f6368;">Email Address:</td>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #e8eaed; color: #1a73e8; font-weight: 600;">
                            <a href="mailto:${inquiry.email}" style="color: #1a73e8; text-decoration: none;">${inquiry.email}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #e8eaed; font-weight: bold; color: #5f6368;">Mobile / WhatsApp:</td>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #e8eaed; color: #202124; font-weight: 600;">
                            ${inquiry.phone ? `<a href="https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}" style="color: #25d366; text-decoration: none; font-weight: bold;">${inquiry.phone} (Open WhatsApp)</a>` : '<span style="color:#9aa0a6;">Not provided</span>'}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #e8eaed; font-weight: bold; color: #5f6368;">Associated Business:</td>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #e8eaed; color: #202124; font-weight: 600;">${inquiry.userBusinessName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; font-weight: bold; color: #5f6368;">Subject / Topic:</td>
                          <td style="padding: 12px 16px; color: #1a73e8; font-weight: bold;">${inquiry.subject}</td>
                        </tr>
                      </table>

                      <!-- Inquiry Message Box -->
                      <div style="margin-bottom: 24px;">
                        <div style="font-size: 12px; font-weight: bold; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                          Inquiry / Requirements Message:
                        </div>
                        <div style="padding: 18px; background-color: #ffffff; border: 1px solid #dadce0; border-left: 4px solid #1a73e8; border-radius: 8px; font-size: 14px; color: #202124; line-height: 1.6; white-space: pre-wrap;">${inquiry.message}</div>
                      </div>

                      <!-- Reply Action Button -->
                      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 8px;">
                        <tr>
                          <td style="border-radius: 8px; background-color: #1a73e8;">
                            <a href="mailto:${inquiry.email}?subject=Re: [RANKORA #${inquiry.id}] ${encodeURIComponent(inquiry.subject)}" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: bold;">
                              Reply to ${inquiry.name} (${inquiry.email})
                            </a>
                          </td>
                          ${inquiry.phone ? `
                            <td style="padding-left: 12px;">
                              <a href="https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inquiry.name}, thank you for contacting Arventa Ventures regarding RANKORA.`)}" style="display: inline-block; padding: 12px 20px; background-color: #25d366; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: bold; border-radius: 8px;">
                                WhatsApp Chat
                              </a>
                            </td>
                          ` : ''}
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 32px; background-color: #f8f9fa; border-top: 1px solid #e8eaed; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #70757a;">
                        Sent securely from your configured Admin SMTP engine to <strong style="color: #202124;">${TARGET_EMAIL}</strong>
                      </p>
                      <p style="margin: 4px 0 0 0; font-size: 11px; color: #9aa0a6;">
                        Arventa Ventures • <a href="https://arventaventures.online" style="color: #1a73e8; text-decoration: none;">arventaventures.online</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log('[Contact API] Email dispatch status:', mailResult);

    return NextResponse.json({
      success: true,
      delivered: mailResult.delivered,
      senderEmail: mailResult.senderEmail,
      recipient: TARGET_EMAIL,
      inquiryId: inquiry.id,
      message: mailResult.delivered
        ? `Your inquiry has been sent to info@arventaventures.online from our verified mail desk (${mailResult.senderEmail}).`
        : `Your inquiry has been recorded (#${inquiry.id}) and forwarded to info@arventaventures.online.`,
    });
  } catch (error) {
    console.error('[Contact API] Unhandled error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
