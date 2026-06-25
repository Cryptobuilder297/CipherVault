import nodemailer from "nodemailer";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: { user, pass },
  });
}

const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@ciphervault.io";

async function send(to: string, subject: string, html: string) {
  const transport = createTransport();
  if (!transport) {
    // SMTP not configured — silently skip (dev mode)
    return;
  }
  try {
    await transport.sendMail({ from, to, subject, html });
  } catch (err) {
    // Log but never crash the request
    console.warn("[email] failed to send:", err);
  }
}

function baseTemplate(title: string, content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0b0c0e;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0c0e;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111315;border:1px solid #1f2127;border-radius:12px;overflow:hidden;max-width:560px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="padding:32px 40px 24px;border-bottom:1px solid #1f2127;">
            <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">CipherVault</span>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:36px 40px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #1f2127;text-align:center;">
            <p style="margin:0;font-size:12px;color:#6b7280;">© ${new Date().getFullYear()} CipherVault · This is an automated notification</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendDepositApprovedEmail({
  to,
  amount,
  method,
  newBalance,
}: {
  to: string;
  amount: number;
  method: string;
  newBalance: number;
}) {
  const subject = "Deposit Approved — CipherVault";
  const content = `
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Deposit Approved</h2>
    <p style="margin:0 0 28px;font-size:15px;color:#9ca3af;line-height:1.6;">Your deposit has been reviewed and credited to your vault.</p>

    <div style="background:#0b0c0e;border:1px solid #1f2127;border-radius:8px;padding:24px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1f2127;">
            <span style="font-size:13px;color:#6b7280;">Amount Credited</span>
          </td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #1f2127;">
            <span style="font-size:15px;font-weight:700;color:#22c55e;">+$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1f2127;">
            <span style="font-size:13px;color:#6b7280;">Method</span>
          </td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #1f2127;">
            <span style="font-size:14px;color:#e5e7eb;">${method}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0 0;">
            <span style="font-size:13px;color:#6b7280;">New Vault Balance</span>
          </td>
          <td align="right" style="padding:8px 0 0;">
            <span style="font-size:15px;font-weight:700;color:#ffffff;">$${newBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 24px;font-size:14px;color:#9ca3af;line-height:1.6;">Your funds are now available to invest. Log in to your dashboard to explore investment plans and start earning.</p>

    <a href="${process.env.APP_URL ?? "https://ciphervault.io"}/plans" style="display:inline-block;background:#ffffff;color:#0b0c0e;font-size:14px;font-weight:600;padding:12px 24px;border-radius:6px;text-decoration:none;letter-spacing:-0.01em;">View Investment Plans</a>
  `;
  await send(to, subject, baseTemplate(subject, content));
}

export async function sendInvestmentMaturedEmail({
  to,
  planName,
  amount,
  expectedReturn,
  profit,
  newBalance,
}: {
  to: string;
  planName: string;
  amount: number;
  expectedReturn: number;
  profit: number;
  newBalance: number;
}) {
  const subject = "Investment Matured — Returns Credited · CipherVault";
  const content = `
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Investment Matured</h2>
    <p style="margin:0 0 28px;font-size:15px;color:#9ca3af;line-height:1.6;">Your <strong style="color:#e5e7eb;">${planName}</strong> plan has reached maturity. Your returns have been credited automatically.</p>

    <div style="background:#0b0c0e;border:1px solid #1f2127;border-radius:8px;padding:24px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1f2127;">
            <span style="font-size:13px;color:#6b7280;">Plan</span>
          </td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #1f2127;">
            <span style="font-size:14px;color:#e5e7eb;">${planName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1f2127;">
            <span style="font-size:13px;color:#6b7280;">Principal Invested</span>
          </td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #1f2127;">
            <span style="font-size:14px;color:#e5e7eb;">$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1f2127;">
            <span style="font-size:13px;color:#6b7280;">Profit Earned</span>
          </td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #1f2127;">
            <span style="font-size:14px;font-weight:600;color:#22c55e;">+$${profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1f2127;">
            <span style="font-size:13px;color:#6b7280;">Total Return</span>
          </td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #1f2127;">
            <span style="font-size:15px;font-weight:700;color:#22c55e;">$${expectedReturn.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0 0;">
            <span style="font-size:13px;color:#6b7280;">New Vault Balance</span>
          </td>
          <td align="right" style="padding:8px 0 0;">
            <span style="font-size:15px;font-weight:700;color:#ffffff;">$${newBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 24px;font-size:14px;color:#9ca3af;line-height:1.6;">Reinvest your earnings to continue growing your portfolio, or withdraw to your preferred payment method.</p>

    <a href="${process.env.APP_URL ?? "https://ciphervault.io"}/dashboard" style="display:inline-block;background:#ffffff;color:#0b0c0e;font-size:14px;font-weight:600;padding:12px 24px;border-radius:6px;text-decoration:none;letter-spacing:-0.01em;">Go to Dashboard</a>
  `;
  await send(to, subject, baseTemplate(subject, content));
}
