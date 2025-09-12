const nodemailer = require('nodemailer');

// Create transporter
let transporter;

if (process.env.USE_TEST_EMAIL === 'true') {
  // Use test email (logs to console instead of sending real emails)
  transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
} else {
  // Use Gmail
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Test transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Send booking notification to provider
exports.sendBookingNotificationToProvider = async (providerEmail, providerName, bookingDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@fixify.com',
    to: providerEmail,
    subject: '🔔 New Service Booking Request - FIXIFY',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #374151;">New Booking Request</h2>
        <p>Hello ${providerName},</p>
        <p>You have received a new booking request:</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #111827;">Booking Details:</h3>
          <p><strong>Service:</strong> ${bookingDetails.category}</p>
          <p><strong>Customer:</strong> ${bookingDetails.customerName}</p>
          <p><strong>Location:</strong> ${bookingDetails.location}</p>
          <p><strong>Date:</strong> ${bookingDetails.preferredDate || 'Not specified'}</p>
          <p><strong>Time:</strong> ${bookingDetails.preferredTime || 'Not specified'}</p>
          <p><strong>Details:</strong> ${bookingDetails.details || 'No additional details'}</p>
        </div>
        
        <p>Please log in to your provider dashboard to accept or reject this booking.</p>
        <p>Best regards,<br>FIXIFY Team</p>
      </div>
    `
  };

  try {
    console.log('📧 Attempting to send email to provider:', providerEmail);
    const result = await transporter.sendMail(mailOptions);
    
    if (process.env.USE_TEST_EMAIL === 'true') {
      console.log('✅ TEST EMAIL - Booking notification for provider:', providerEmail);
      console.log('📧 Email content:', result.message.toString());
    } else {
      console.log('✅ Booking notification sent to provider:', providerEmail);
      console.log('📧 Email result:', result.messageId);
    }
  } catch (error) {
    console.error('❌ Error sending email to provider:', error.message);
  }
};

// Send booking confirmation to user
exports.sendBookingConfirmationToUser = async (userEmail, userName, bookingDetails, providerDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@fixify.com',
    to: userEmail,
    subject: '✅ Booking Confirmed - FIXIFY',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #374151;">Booking Confirmed!</h2>
        <p>Hello ${userName},</p>
        <p>Great news! Your booking has been confirmed by the service provider.</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #111827;">Booking Details:</h3>
          <p><strong>Service:</strong> ${bookingDetails.category}</p>
          <p><strong>Location:</strong> ${bookingDetails.location}</p>
          <p><strong>Date:</strong> ${bookingDetails.preferredDate || 'Not specified'}</p>
          <p><strong>Time:</strong> ${bookingDetails.preferredTime || 'Not specified'}</p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #111827;">Provider Details:</h3>
          <p><strong>Name:</strong> ${providerDetails.name}</p>
          <p><strong>Email:</strong> ${providerDetails.email}</p>
          <p><strong>Contact:</strong> ${providerDetails.contact}</p>
        </div>
        
        <p>The provider will contact you soon to coordinate the service.</p>
        <p>Best regards,<br>FIXIFY Team</p>
      </div>
    `
  };

  try {
    console.log('📧 Attempting to send email to user:', userEmail);
    const result = await transporter.sendMail(mailOptions);
    
    if (process.env.USE_TEST_EMAIL === 'true') {
      console.log('✅ TEST EMAIL - Booking confirmation for user:', userEmail);
      console.log('📧 Email content:', result.message.toString());
    } else {
      console.log('✅ Booking confirmation sent to user:', userEmail);
      console.log('📧 Email result:', result.messageId);
    }
  } catch (error) {
    console.error('❌ Error sending email to user:', error.message);
  }
};