import nodemailer from 'nodemailer';
import dns from 'dns';

export function generateOTP() {
  // Default OTP as requested (1234)
  return '1234';
}

/**
 * Creates Nodemailer transporter using Gmail SMTP
 */
async function getTransporter() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '').trim();

  if (!user || !pass) {
    return null;
  }

  // Pre-resolve host to IPv4 to prevent Windows/UDP DNS timeout issues
  let host = 'smtp.gmail.com';
  try {
    const res = await dns.promises.lookup('smtp.gmail.com', { family: 4 });
    if (res?.address) {
      host = res.address;
    }
  } catch {
    // fallback to hostname
  }

  return nodemailer.createTransport({
    host,
    port: 465,
    secure: true,
    tls: {
      servername: 'smtp.gmail.com',
    },
    auth: {
      user,
      pass,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });
}

/**
 * Sends an OTP email for account activation or password reset
 */
export async function sendOtpEmail({ toEmail, otpCode, purpose, recipientName = 'Business Owner' }) {
  const isReset = purpose === 'RESET_PASSWORD';
  const subject = isReset
    ? `[Rankaro] Your Password Reset Code: ${otpCode}`
    : `[Rankaro] Verify your email: ${otpCode}`;

  const title = isReset ? 'Reset Your Rankaro Password' : 'Verify Your Rankaro Account';
  const actionText = isReset
    ? 'Use the 6-digit verification code below to reset your Rankaro password.'
    : 'Welcome to Rankaro! Please use the 6-digit code below to verify your email and activate your business profile.';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #202124;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="560px" cellpadding="0" cellspacing="0" border="0" style="max-width: 540px; background-color: #ffffff; border-radius: 12px; border: 1px solid #dadce0; overflow: hidden; box-shadow: 0 1px 3px rgba(60,64,67,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 16px 32px; border-bottom: 1px solid #f1f3f4;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <div style="display: inline-block; width: 34px; height: 34px; line-height: 34px; background: #1a73e8; border-radius: 8px; text-align: center; color: #ffffff; font-weight: bold; font-size: 20px;">R</div>
                  </td>
                  <td style="vertical-align: middle; padding-left: 12px;">
                    <span style="font-size: 20px; font-weight: 700; color: #202124; letter-spacing: -0.3px;">Rankaro</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #202124; line-height: 1.3;">
                ${title}
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #5f6368; line-height: 1.5;">
                Hello <strong>${recipientName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #3c4043; line-height: 1.5;">
                ${actionText}
              </p>

              <!-- OTP Code Display Card -->
              <div style="background-color: #f8f9fa; border: 1px solid #e8eaed; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <span style="display: block; font-size: 13px; color: #5f6368; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Your One-Time Passcode</span>
                <span style="display: inline-block; font-size: 36px; font-weight: 700; color: #1a73e8; letter-spacing: 8px; font-family: 'Roboto Mono', monospace, Consolas, Courier;">
                  ${otpCode}
                </span>
                <span style="display: block; font-size: 12px; color: #70757a; margin-top: 8px;">
                  This code expires in 15 minutes.
                </span>
              </div>

              <p style="margin: 0 0 12px 0; font-size: 13px; color: #70757a; line-height: 1.5;">
                If you did not request this email, please safely ignore it. Your account remains secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #f8f9fa; border-top: 1px solid #e8eaed; font-size: 12px; color: #70757a; line-height: 1.4;">
              <p style="margin: 0 0 6px 0;">
                Rankaro — Empowering businesses to collect authentic customer reviews on Google.
              </p>
              <p style="margin: 0; font-size: 11px; color: #9aa0a6;">
                Rankaro is an independent software tool and is not affiliated with Google LLC.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const transporter = await getTransporter();

  if (!transporter) {
    console.warn('[Rankaro SMTP Warning] GMAIL_USER / GMAIL_APP_PASSWORD not configured. Continuing with fallback OTP:', otpCode);
    return {
      success: true,
      delivered: false,
      devOtp: otpCode,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Rankaro" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject,
      html: htmlContent,
      text: `${title}\n\nYour verification code is: ${otpCode}\nThis code will expire in 15 minutes.`,
    });

    console.log(`[Rankaro SMTP] Email successfully sent to ${toEmail}. Message ID: ${info.messageId}`);
    return {
      success: true,
      delivered: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.warn('[Rankaro SMTP Warning] Failed to send email via Gmail:', error.message);
    return {
      success: true,
      delivered: false,
      devOtp: otpCode,
    };
  }
}
