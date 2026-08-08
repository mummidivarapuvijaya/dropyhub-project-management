const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const user = process.env.SMTP_USER || process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP email credentials not configured in server/.env. Please set SMTP_USER and SMTP_PASSWORD.');
  }

  // Create transporter using environment variable SMTP settings
  const transporterConfig = {
    host,
    port,
    secure: port === 465, // true for port 465, false for 587/2525
    auth: {
      user,
      pass
    }
  };

  // If host is smtp.gmail.com, add explicit TLS configuration for Gmail App Passwords
  if (host.includes('gmail.com')) {
    transporterConfig.service = 'gmail';
  }

  const transporter = nodemailer.createTransport(transporterConfig);

  const message = {
    from: `${process.env.FROM_NAME || 'DropyHub PM'} <${process.env.FROM_EMAIL || user}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`
  };

  const info = await transporter.sendMail(message);
  console.log('Email successfully dispatched: %s', info.messageId);
  return info;
};

module.exports = sendEmail;
