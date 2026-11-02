import nodemailer from 'nodemailer';
import dns from 'dns';
import crypto from 'crypto';
import { settingsRepo } from './repositories.js';

export function generateOTP() {
  // Generate real cryptographically secure 4-digit numeric OTP (1000 - 9999)
  return crypto.randomInt(1000, 10000).toString();
}

/**
 * Resolves SMTP host using fast public DNS resolvers to prevent Windows DNS UDP stalls
 */
async function resolveSmtpHost(host = 'smtp.gmail.com') {
  if (host !== 'smtp.gmail.com') return host;

  // 1. Try fast public DNS (Google 8.8.8.8, Cloudflare 1.1.1.1)
  try {
    const resolver = new dns.promises.Resolver();
    resolver.setServers(['8.8.8.8', '1.1.1.1']);
    const ips = await resolver.resolve4('smtp.gmail.com');
    if (ips && ips.length > 0) {
      return ips[0];
    }
  } catch (err) {
    // continue to fallback
  }

  // 2. Fallback to system dns.lookup
  try {
    const res = await dns.promises.lookup('smtp.gmail.com', { family: 4 });
    if (res?.address) {
      return res.address;
    }
  } catch {
    // continue to fallback
  }

  // 3. Fallback known IPv4 address for smtp.gmail.com
  return '192.178.211.108';
}

/**
 * Creates Nodemailer transporter using saved DB settings or environment fallback
 */
async function getTransporter() {
  let user = '';
  let pass = '';
  let host = 'smtp.gmail.com';
  let port = 465;
  let secure = true;
  let fromName = 'Rankaro';

  try {
    const config = await settingsRepo.getSettings();
    if (config?.smtp?.user && config?.smtp?.pass) {
      user = config.smtp.user.trim();
      pass = config.smtp.pass.replace(/\s+/g, '').trim();
      host = config.smtp.host || 'smtp.gmail.com';
      port = Number(config.smtp.port) || 465;
      secure = config.smtp.secure !== false;
      fromName = config.smtp.fromName || 'Rankaro';
    }
  } catch (err) {
    console.warn('[Rankaro Mail] Failed to load settings from DB:', err.message);
  }

  // Fallback to environment variables if DB settings are empty
  if (!user && process.env.GMAIL_USER) {
    user = process.env.GMAIL_USER.trim();
  }
  if (!pass && process.env.GMAIL_APP_PASSWORD) {
    pass = process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '').trim();
  }

  if (!user || !pass) {
    return null;
  }

  const targetHost = await resolveSmtpHost(host);

  return {
    transporter: nodemailer.createTransport({
      host: targetHost,
      port,
      secure,
      tls: {
        servername: 'smtp.gmail.com',
        rejectUnauthorized: false,
      },
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    }),
    user,
    fromName,
  };
}

/**
 * Builds a world-class, responsive, modern SaaS email template for OTPs and verification
 */
function buildOtpEmailTemplate({ title, recipientName, otpCode, isReset, toEmail }) {
  const digits = String(otpCode || '').split('');
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text -->
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; mso-hide: all; font-size: 1px; line-height: 1px;">
    Your Rankaro ${isReset ? 'password reset' : 'verification'} code is ${otpCode}. Valid for 15 minutes.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);">
          <!-- Top Accent Gradient Line -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align: middle;">
                          <div style="width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); text-align: center; line-height: 38px; color: #ffffff; font-weight: 800; font-size: 21px; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25);">
                            R
                          </div>
                        </td>
                        <td style="vertical-align: middle; padding-left: 12px;">
                          <div style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; line-height: 1.1;">
                            Rankaro
                          </div>
                          <div style="font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.3px; text-transform: uppercase; margin-top: 2px;">
                            Official Google Partner
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <div style="display: inline-block; padding: 4px 12px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 20px; font-size: 11px; font-weight: 600; color: #065f46;">
                      <span style="color: #10b981; font-size: 10px; margin-right: 4px;">●</span> Secure Auth Desk
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 32px 28px 32px;">
              <h1 style="margin: 0 0 14px 0; font-size: 23px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; line-height: 1.3;">
                ${title}
              </h1>
              <p style="margin: 0 0 14px 0; font-size: 15px; color: #334155; line-height: 1.6;">
                Hello <strong>${recipientName || 'Valued Partner'}</strong>,
              </p>
              <p style="margin: 0 0 26px 0; font-size: 15px; color: #475569; line-height: 1.6;">
                ${
                  isReset
                    ? 'We received a request to reset the password for your Rankaro account. Please use the verification passcode below to authorize this request.'
                    : 'Welcome to Rankaro! Please enter the verification passcode below to verify your email address and activate your business profile.'
                }
              </p>

              <!-- OTP Code Display Card -->
              <div style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px 16px; text-align: center; margin: 0 0 24px 0;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 14px;">
                  🔒 YOUR ONE-TIME PASSCODE
                </div>

                <!-- Individual Digit Boxes -->
                <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 16px auto;">
                  <tr>
                    ${digits
                      .map(
                        (d) => `
                      <td style="padding: 0 5px;">
                        <div style="width: 52px; height: 62px; line-height: 62px; background-color: #ffffff; border: 2px solid #cbd5e1; border-radius: 12px; font-size: 32px; font-weight: 800; color: #1e293b; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; box-shadow: 0 3px 6px -1px rgba(0, 0, 0, 0.06);">
                          ${d}
                        </div>
                      </td>
                    `
                      )
                      .join('')}
                  </tr>
                </table>

                <!-- Expiry Indicator -->
                <div style="display: inline-block; padding: 4px 14px; background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 20px; font-size: 12px; font-weight: 600; color: #92400e;">
                  ⏱️ Valid for 15 minutes
                </div>
              </div>

              <!-- Security Notice Callout -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 22px 0; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 10px 10px 0;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <div style="font-size: 13px; font-weight: 700; color: #1e40af; margin-bottom: 3px;">
                      🛡️ Security Advisory
                    </div>
                    <div style="font-size: 13px; color: #1e3a8a; line-height: 1.5;">
                      Never share this code with anyone. Rankaro or Google staff will never contact you asking for your verification passcode.
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                If you did not request this email, no further action is required. Your account remains completely secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 22px 32px 28px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.5;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom: 8px; font-size: 12px; font-weight: 600; color: #334155;">
                    Rankaro &bull; Automated Google Review & Reputation Intelligence
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 8px; font-size: 11px; color: #64748b; line-height: 1.5;">
                    This is an automated security transmission delivered to <strong style="color: #475569;">${toEmail}</strong>.
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
                    &copy; ${year} Rankaro Technologies. All rights reserved. &bull; Official Google Partner Ecosystem.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Sends an OTP email for account activation or password reset with automatic multi-retry logic
 */
export async function sendOtpEmail({ toEmail, otpCode, purpose, recipientName = 'Business Owner' }) {
  const isReset = purpose === 'RESET_PASSWORD';
  const subject = isReset
    ? `[Rankaro] Your Password Reset Passcode: ${otpCode}`
    : `[Rankaro] Verify your email address: ${otpCode}`;

  const title = isReset ? 'Reset Your Rankaro Password' : 'Verify Your Rankaro Account';

  const htmlContent = buildOtpEmailTemplate({
    title,
    recipientName,
    otpCode,
    isReset,
    toEmail,
  });

  const MAX_RETRIES = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const mailClient = await getTransporter();

      if (!mailClient || !mailClient.transporter) {
        throw new Error('Email service configuration missing. Please check SMTP settings.');
      }

      const senderEmail = mailClient.user || process.env.GMAIL_USER;
      const senderName = mailClient.fromName || 'Rankaro';

      const info = await mailClient.transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: toEmail,
        subject,
        html: htmlContent,
        text: `${title}\n\nYour verification code is: ${otpCode}\nThis code will expire in 15 minutes.`,
      });

      console.log(`[Rankaro SMTP] Email successfully sent on attempt ${attempt} to ${toEmail}. Message ID: ${info.messageId}`);
      return {
        success: true,
        delivered: true,
        messageId: info.messageId,
      };
    } catch (error) {
      lastError = error;
      console.warn(`[Rankaro SMTP] Send attempt ${attempt} failed for ${toEmail}:`, error.message);
      if (attempt < MAX_RETRIES) {
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, attempt * 600));
      }
    }
  }

  // All attempts failed
  console.error(`[Rankaro SMTP Error] All ${MAX_RETRIES} attempts failed for ${toEmail}:`, lastError?.message);
  return {
    success: false,
    delivered: false,
    error: 'System issue occurred. Please try again later.',
  };
}

/**
 * Live test of SMTP connection and credentials
 */
export async function testSmtpConnection({ user, pass, host = 'smtp.gmail.com', port = 465, secure = true, testRecipient }) {
  if (!user || !pass) {
    return { success: false, message: 'Email address and Google App Password are required.' };
  }

  const cleanPass = pass.replace(/\s+/g, '').trim();
  const cleanUser = user.trim();
  const targetHost = await resolveSmtpHost(host);

  try {
    const transporter = nodemailer.createTransport({
      host: targetHost,
      port: Number(port) || 465,
      secure: secure !== false,
      tls: {
        servername: 'smtp.gmail.com',
        rejectUnauthorized: false,
      },
      auth: {
        user: cleanUser,
        pass: cleanPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    await transporter.verify();

    if (testRecipient && testRecipient.trim()) {
      const year = new Date().getFullYear();
      await transporter.sendMail({
        from: `"Rankaro Verification Desk" <${cleanUser}>`,
        to: testRecipient.trim(),
        subject: `[Rankaro] Gmail SMTP Verification Confirmed - ${new Date().toLocaleTimeString()}`,
        html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>SMTP Verification Confirmed</title></head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 36px 12px; background-color: #f1f5f9;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);">
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #10b981 0%, #059669 100%);"></td>
          </tr>
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <div style="font-size: 20px; font-weight: 800; color: #0f172a;">Rankaro</div>
                    <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Official Google Partner</div>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <div style="display: inline-block; padding: 4px 12px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 20px; font-size: 11px; font-weight: 600; color: #065f46;">
                      ● System Active
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; text-align: center; border-radius: 12px; background-color: #ecfdf5; color: #10b981; font-size: 22px; font-weight: bold; margin-bottom: 16px;">
                ✓
              </div>
              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #0f172a;">
                Gmail API & SMTP Connected!
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #475569; line-height: 1.6;">
                Your Gmail API and SMTP sender credentials have been successfully authenticated and stored securely in the system database. All user registration OTPs and password reset emails will be dispatched using this configuration.
              </p>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; line-height: 2;">
                  <tr>
                    <td style="color: #64748b; font-weight: 600;">Sender Address:</td>
                    <td align="right" style="color: #0f172a; font-weight: 700;">${cleanUser}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; font-weight: 600;">Server / Protocol:</td>
                    <td align="right" style="color: #0f172a; font-weight: 700;">smtp.gmail.com : ${port} (SSL)</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; font-weight: 600;">Database Storage:</td>
                    <td align="right" style="color: #059669; font-weight: 700;">MongoDB systemsettings</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
              &copy; ${year} Rankaro Technologies. All rights reserved. &bull; Official Google Partner Ecosystem.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        text: `Congratulations!\n\nYour Gmail API and SMTP credentials are verified and working perfectly on Rankaro.\n\nSender: ${cleanUser}\nHost: smtp.gmail.com : ${port}\nTime: ${new Date().toISOString()}`,
      });
    }

    return {
      success: true,
      message: `SMTP connection established successfully!${testRecipient ? ` A live test email has been delivered to ${testRecipient.trim()}.` : ''}`,
    };
  } catch (error) {
    let cleanMessage = error.message || 'Failed to authenticate with SMTP server.';
    if (cleanMessage.includes('535') || cleanMessage.includes('Username and Password not accepted') || cleanMessage.includes('BadCredentials')) {
      cleanMessage = 'Google Authentication Failed: The email address or 16-character App Password was rejected by Google (535 BadCredentials). Please check that 2-Step Verification is active on this Google Account and create a fresh 16-character App Password from Google Account Security.';
    } else if (cleanMessage.includes('ETIMEDOUT') || cleanMessage.includes('timed out')) {
      cleanMessage = 'Connection timed out while reaching smtp.gmail.com. Please check your internet connection and ensure port 465 is not blocked.';
    }

    return {
      success: false,
      message: cleanMessage,
    };
  }
}

/**
 * General purpose mail sender
 * Sends mail via admin-configured SMTP transporter (same sender used for OTPs)
 */
export async function sendMail({ to, cc, subject, html, text, replyTo, fromName }) {
  const mailClient = await getTransporter();
  if (!mailClient || !mailClient.transporter) {
    console.warn('[Rankaro Mail] SMTP not configured. Cannot send email to:', to);
    return { success: false, delivered: false, error: 'SMTP not configured in system settings or environment.' };
  }

  let resolvedFromName = fromName;
  if (!resolvedFromName) {
    try {
      const config = await settingsRepo.getSettings();
      resolvedFromName = config?.smtp?.fromName || 'RANKORA Support Desk';
    } catch {
      resolvedFromName = 'RANKORA Support Desk';
    }
  }

  const senderEmail = mailClient.user || process.env.GMAIL_USER;
  try {
    const mailOptions = {
      from: `"${resolvedFromName}" <${senderEmail}>`,
      to,
      subject,
      html,
      text: text || '',
    };

    if (replyTo) {
      mailOptions.replyTo = replyTo;
    }
    if (cc) {
      mailOptions.cc = cc;
    }

    const info = await mailClient.transporter.sendMail(mailOptions);
    console.log(`[Rankaro SMTP] Email successfully delivered to ${to} from ${senderEmail}. Message ID: ${info.messageId}`);
    return { success: true, delivered: true, messageId: info.messageId, senderEmail };
  } catch (err) {
    console.error(`[Rankaro SMTP Error] Failed to send email to ${to} from ${senderEmail}:`, err.message);
    return { success: false, delivered: false, error: err.message, senderEmail };
  }
}
