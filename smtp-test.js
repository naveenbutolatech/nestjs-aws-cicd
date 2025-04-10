const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: '8a03e3002@smtp-brevo.com',
    pass: 'qtDpvNGYWzQgVX2E'
  },
  debug: true,
  logger: true
});

async function testEmail() {
  try {
    // Verify connection configuration
    await transporter.verify();
    console.log('Server is ready to take our messages');

    // Send test email
    const info = await transporter.sendMail({
      from: '"No Reply" <noreply@truehospitals.com>',
      to: 'nav.butola@gmail.com',
      subject: 'SMTP Test Email',
      text: 'This is a test email to verify SMTP configuration',
      html: '<b>This is a test email to verify SMTP configuration</b>'
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

testEmail();
