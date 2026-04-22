const nodemailer = require("nodemailer");
module.exports.sendMail = async (email, otp) => {
  const otpStr = otp.toString();
  const digits = otpStr.split('');
  const secure = process.env.SMTP_SECURE == "true"
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: secure, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: `<${process.env.SMTP_USER}>`, // sender address
      to: email, // list of recipients
      subject: "MANHQUYNH DECOR!!!", // subject line
      text: "OTP", // plain text body
      html: `<div style="padding: 2.5rem; background: #0d0d0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 480px; margin: auto;">

    <div style="text-align:center; margin-bottom:32px;">
  <table align="center" cellspacing="0" cellpadding="0">
    <tr>
      <td style="vertical-align:middle;">
        <img 
          src="https://avatars.githubusercontent.com/u/167176471?v=4&size=64" 
          alt="MANHQUYNH DECOR" 
          width="48" 
          height="48" 
          style="border-radius:50%; display:block;"
        />
      </td>
      <td width="8"></td>
      <td style="vertical-align:middle;">
        <span style="color:#e5e7eb; font-size:15px; font-weight:600; letter-spacing:0.5px;">
          MANHQUYNH DECOR
        </span>
      </td>
    </tr>
  </table>
</div>

    <!-- Card -->
    <div style="background: #18181b; border: 1px solid #27272a; border-radius: 20px; overflow: hidden;">

      <!-- Accent line -->
      <div style="height: 3px; background: linear-gradient(90deg, #7c3aed, #a78bfa, #c084fc);"></div>

      <div style="padding: 40px 40px 36px;">

        <!-- Title -->
        <div style="margin-bottom: 28px;">
          <p style="margin: 0 0 6px; color: #a78bfa; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 500;">Xác thực bảo mật</p>
          <h2 style="margin: 0 0 10px; color: #f4f4f5; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Mã OTP của bạn</h2>
          <p style="margin: 0; color: #71717a; font-size: 13px; line-height: 1.7;">Nhập mã này để hoàn tất xác thực tài khoản. Mã chỉ có hiệu lực một lần.</p>
        </div>

       <table align="center" cellspacing="0" cellpadding="0">
  <tr>
    <td align="center" style="width:48px;height:60px;border:1px solid #52525b;border-radius:10px;font-size:28px;font-weight:700;color:#a78bfa;font-family:monospace;background:#18181b;">
      ${digits[0]}
    </td>
    <td width="8"></td>
    <td align="center" style="width:48px;height:60px;border:1px solid #52525b;border-radius:10px;font-size:28px;font-weight:700;color:#a78bfa;font-family:monospace;background:#18181b;">
      ${digits[1]}
    </td>
    <td width="8"></td>
    <td align="center" style="width:48px;height:60px;border:1px solid #52525b;border-radius:10px;font-size:28px;font-weight:700;color:#a78bfa;font-family:monospace;background:#18181b;">
      ${digits[2]}
    </td>

    <td width="10" style="color:#3f3f46;font-size:20px;">—</td>

    <td align="center" style="width:48px;height:60px;border:1px solid #52525b;border-radius:10px;font-size:28px;font-weight:700;color:#a78bfa;font-family:monospace;background:#18181b;">
      ${digits[3]}
    </td>
    <td width="8"></td>
    <td align="center" style="width:48px;height:60px;border:1px solid #52525b;border-radius:10px;font-size:28px;font-weight:700;color:#a78bfa;font-family:monospace;background:#18181b;">
      ${digits[4]}
    </td>
    <td width="8"></td>
    <td align="center" style="width:48px;height:60px;border:1px solid #52525b;border-radius:10px;font-size:28px;font-weight:700;color:#a78bfa;font-family:monospace;background:#18181b;">
      ${digits[5]}
    </td>
  </tr>
</table>

        <!-- Warning -->
        <div style="display: flex; gap: 12px; background: #1c1410; border: 1px solid #44301a; border-radius: 10px; padding: 14px 16px; margin-bottom: 32px;margin-top: 32px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:1px;">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p style="margin: 0; color: #a3632a; font-size: 12px; line-height: 1.6;">Không chia sẻ mã này với bất kỳ ai. MANHQUYNHDZ sẽ không bao giờ yêu cầu mã OTP của bạn.</p>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #27272a; padding-top: 24px; display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #3f3f46; font-size: 11px;">© 2026 MANHQUYNH DECOR !!!</span>
          <span style="color: #3f3f46; font-size: 11px;">Không trả lời email này</span>
        </div>

      </div>
    </div>

    <p style="text-align: center; color: #3f3f46; font-size: 11px; margin-top: 20px;">Email này được gửi tự động · Vui lòng không reply</p>
  </div>
</div>
 
` // HTML body
    });
    console.log("OTP:", otp);
    console.log("Message sent:", info.messageId);
    return otp;
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}