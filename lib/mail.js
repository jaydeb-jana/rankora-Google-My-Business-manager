import nodemailer from 'nodemailer';
import dns from 'dns';
import { settingsRepo } from './repositories.js';

export function generateOTP() {
  // Default OTP as requested (1234)
  return '1234';
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

  return 'smtp.gmail.com';
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

  const mailClient = await getTransporter();

  if (!mailClient || !mailClient.transporter) {
    console.warn('[Rankaro SMTP Warning] GMAIL_USER / GMAIL_APP_PASSWORD not configured. Continuing with fallback OTP:', otpCode);
    return {
      success: true,
      delivered: false,
      devOtp: otpCode,
    };
  }

  try {
    const senderEmail = mailClient.user || process.env.GMAIL_USER;
    const senderName = mailClient.fromName || 'Rankaro';
    const info = await mailClient.transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
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
      error: error.message,
    };
  }
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
      await transporter.sendMail({
        from: `"Rankaro Verification Desk" <${cleanUser}>`,
        to: testRecipient.trim(),
        subject: `[Rankaro] Gmail SMTP Verification Successful - ${new Date().toLocaleTimeString()}`,
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
