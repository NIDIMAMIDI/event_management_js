// import "dotenv/config";
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (to, subject, text, html) => {
  // message for the mail with from and addresses, subject and body to the mail
  const msg = {
    to,
    from: process.env.FROM_ADRESS,
    subject,
    text,
    html
  };

  try {
    // sending mail to the user by the provided mail, subject and Body
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);

    if (error.response) {
      console.error('SendGrid response error:', error.response.body);
    }
  }
};
