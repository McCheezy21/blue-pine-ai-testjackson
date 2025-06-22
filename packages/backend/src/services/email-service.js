const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const nodemailer = require('nodemailer');
require('dotenv').config();

// AWS SES configuration
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// ENHANCED: Gmail SMTP configuration
const createGmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // your-email@gmail.com
      pass: process.env.GMAIL_APP_PASSWORD // app-specific password
    }
  });
};

// ENHANCED: SendGrid SMTP configuration
const createSendGridTransporter = () => {
  return nodemailer.createTransporter({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });
};

// Email templates
const getInvitationEmailHtml = (companyName, inviteUrl, senderName = 'Blue Pine AI Team') => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're Invited to ${companyName}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { color: #2563eb; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .content { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 40px; }
        .invite-button { display: inline-block; background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .invite-button:hover { background: #1d4ed8; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0; color: #92400e; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🌲 Blue Pine AI</div>
          <p>Healthcare Revenue Cycle Automation</p>
        </div>
        
        <div class="content">
          <h1>You're Invited to Join ${companyName}!</h1>
          
          <p>Hello,</p>
          
          <p>You've been invited to join <strong>${companyName}</strong>'s workspace on Blue Pine AI's SNF Revenue Cycle automation platform.</p>
          
          <p>Our platform helps healthcare organizations automate and optimize their revenue cycle processes, reducing manual work and improving cash flow.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" class="invite-button">Accept Invitation & Get Started</a>
          </div>
          
          <div class="warning">
            <strong>⏰ Important:</strong> This invitation will expire in 7 days. Please accept it soon to ensure access to your organization's workspace.
          </div>
          
          <p><strong>What's next?</strong></p>
          <ol>
            <li>Click the invitation button above</li>
            <li>Sign in with your work email address</li>
            <li>Start exploring your organization's automation workspace</li>
          </ol>
          
          <p>If you have any questions or need assistance, please don't hesitate to reach out to your organization's administrator or our support team.</p>
          
          <p>Welcome to the future of healthcare revenue cycle management!</p>
          
          <p>Best regards,<br>
          ${senderName}<br>
          Blue Pine AI</p>
        </div>
        
        <div class="footer">
          <p>This invitation was sent to you because an administrator at ${companyName} added your email to their Blue Pine AI workspace.</p>
          <p>If you believe this was sent in error, you can safely ignore this email.</p>
          <p>&copy; 2024 Blue Pine AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getInvitationEmailText = (companyName, inviteUrl) => {
  return `
You're Invited to Join ${companyName}!

You've been invited to join ${companyName}'s workspace on Blue Pine AI's SNF Revenue Cycle automation platform.

Accept your invitation: ${inviteUrl}

This invitation will expire in 7 days.

What's next?
1. Click the invitation link above
2. Sign in with your work email address  
3. Start exploring your organization's automation workspace

If you have any questions, please contact your organization's administrator.

Best regards,
Blue Pine AI Team

---
This invitation was sent because an administrator at ${companyName} added your email to their Blue Pine AI workspace.
  `;
};

// ENHANCED: Smart email sending with multiple providers
const sendInvitationEmail = async (toEmail, companyName, inviteUrl, senderName) => {
  try {
    // Try Gmail SMTP first (if configured)
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      console.log('📧 Attempting to send via Gmail SMTP...');
      return await sendViaGmail(toEmail, companyName, inviteUrl, senderName);
    }
    
    // Try SendGrid next (if configured)
    if (process.env.SENDGRID_API_KEY) {
      console.log('📧 Attempting to send via SendGrid...');
      return await sendViaSendGrid(toEmail, companyName, inviteUrl, senderName);
    }
    
    // Try AWS SES (if configured)
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('📧 Attempting to send via AWS SES...');
      return await sendViaSES(toEmail, companyName, inviteUrl, senderName);
    }
    
    // No email service configured - log for manual sending
    console.log('📧 No email service configured - logging invitation details...');
    return logInvitationForManualSend(toEmail, companyName, inviteUrl);
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Gmail SMTP sending
const sendViaGmail = async (toEmail, companyName, inviteUrl, senderName) => {
  const transporter = createGmailTransporter();
  
  const mailOptions = {
    from: `"${senderName}" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `You're invited to join ${companyName} on Blue Pine AI`,
    html: getInvitationEmailHtml(companyName, inviteUrl, senderName),
    text: getInvitationEmailText(companyName, inviteUrl)
  };

  const result = await transporter.sendMail(mailOptions);
  console.log(`✅ Gmail invitation sent successfully to ${toEmail}. MessageId: ${result.messageId}`);
  
  return { 
    success: true, 
    messageId: result.messageId,
    provider: 'Gmail'
  };
};

// SendGrid SMTP sending
const sendViaSendGrid = async (toEmail, companyName, inviteUrl, senderName) => {
  const transporter = createSendGridTransporter();
  
  const mailOptions = {
    from: `"${senderName}" <${process.env.SENDGRID_FROM_EMAIL || 'noreply@bluepineai.com'}>`,
    to: toEmail,
    subject: `You're invited to join ${companyName} on Blue Pine AI`,
    html: getInvitationEmailHtml(companyName, inviteUrl, senderName),
    text: getInvitationEmailText(companyName, inviteUrl)
  };

  const result = await transporter.sendMail(mailOptions);
  console.log(`✅ SendGrid invitation sent successfully to ${toEmail}. MessageId: ${result.messageId}`);
  
  return { 
    success: true, 
    messageId: result.messageId,
    provider: 'SendGrid'
  };
};

// AWS SES sending (original implementation)
const sendViaSES = async (toEmail, companyName, inviteUrl, senderName) => {
  const fromEmail = process.env.SES_FROM_EMAIL || 'noreply@bluepineai.com';
  const subject = `You're invited to join ${companyName} on Blue Pine AI`;
  
  const emailParams = {
    Source: fromEmail,
    Destination: {
      ToAddresses: [toEmail]
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: getInvitationEmailHtml(companyName, inviteUrl, senderName),
          Charset: 'UTF-8'
        },
        Text: {
          Data: getInvitationEmailText(companyName, inviteUrl),
          Charset: 'UTF-8'
        }
      }
    }
  };

  const command = new SendEmailCommand(emailParams);
  const result = await sesClient.send(command);
  
  console.log(`✅ AWS SES invitation sent successfully to ${toEmail}. MessageId: ${result.MessageId}`);
  return { 
    success: true, 
    messageId: result.MessageId,
    provider: 'AWS SES'
  };
};

// Fallback: Log invitation for manual sending
const logInvitationForManualSend = (toEmail, companyName, inviteUrl) => {
  console.log('\n🎯 ===== MANUAL INVITATION REQUIRED =====');
  console.log(`📧 To: ${toEmail}`);
  console.log(`🏢 Company: ${companyName}`);
  console.log(`🔗 Invitation URL: ${inviteUrl}`);
  console.log(`📝 Subject: You're invited to join ${companyName} on Blue Pine AI`);
  console.log('\n💡 EMAIL SERVICES TO SET UP:');
  console.log('  1. Gmail: Set GMAIL_USER and GMAIL_APP_PASSWORD');
  console.log('  2. SendGrid: Set SENDGRID_API_KEY');
  console.log('  3. AWS SES: Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
  console.log('==========================================\n');
  
  return { 
    success: false, 
    error: 'No email service configured - invitation logged for manual sending',
    manualSend: true,
    details: { toEmail, companyName, inviteUrl }
  };
};

// Alternative: Send via SMTP (legacy function)
const sendViaSMTP = async (toEmail, companyName, inviteUrl) => {
  return logInvitationForManualSend(toEmail, companyName, inviteUrl);
};

// ENHANCED: Test email configuration with multiple providers
const testEmailConfiguration = async () => {
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  const testSubject = 'Blue Pine AI - Email Configuration Test';
  const testMessage = 'This is a test email to verify your email configuration is working. If you received this, your email service is properly configured! 🎉';
  
  try {
    // Test Gmail SMTP
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      console.log('🧪 Testing Gmail SMTP configuration...');
      const transporter = createGmailTransporter();
      
      await transporter.sendMail({
        from: `"Blue Pine AI" <${process.env.GMAIL_USER}>`,
        to: testEmail,
        subject: testSubject,
        text: testMessage
      });
      
      console.log('✅ Gmail SMTP test successful!');
      return { success: true, provider: 'Gmail SMTP' };
    }
    
    // Test SendGrid
    if (process.env.SENDGRID_API_KEY) {
      console.log('🧪 Testing SendGrid configuration...');
      const transporter = createSendGridTransporter();
      
      await transporter.sendMail({
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@bluepineai.com',
        to: testEmail,
        subject: testSubject,
        text: testMessage
      });
      
      console.log('✅ SendGrid test successful!');
      return { success: true, provider: 'SendGrid' };
    }
    
    // Test AWS SES
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('🧪 Testing AWS SES configuration...');
      const testParams = {
        Source: process.env.SES_FROM_EMAIL || 'noreply@bluepineai.com',
        Destination: {
          ToAddresses: [testEmail]
        },
        Message: {
          Subject: {
            Data: testSubject,
            Charset: 'UTF-8'
          },
          Body: {
            Text: {
              Data: testMessage,
              Charset: 'UTF-8'
            }
          }
        }
      };

      const command = new SendEmailCommand(testParams);
      await sesClient.send(command);
      
      console.log('✅ AWS SES test successful!');
      return { success: true, provider: 'AWS SES' };
    }
    
    // No email service configured
    console.log('❌ No email service configured');
    return { 
      success: false, 
      error: 'No email service configured. Please set up Gmail, SendGrid, or AWS SES credentials in your .env file.' 
    };
    
  } catch (error) {
    console.log('❌ Email configuration test failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendInvitationEmail,
  sendViaSMTP,
  sendViaGmail,
  sendViaSendGrid, 
  sendViaSES,
  testEmailConfiguration
}; 