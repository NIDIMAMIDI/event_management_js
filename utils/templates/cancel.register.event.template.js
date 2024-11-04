/* eslint-disable max-len */
export const eventCancelRegistrationTemplate = (username, title) => {
  return `
      <div style="font-family: Arial, sans-serif; font-size: 16px;">
        <h2>Hello ${username},</h2>
        <p>We are sorry to inform you that you have successfully canceled your registration for the <strong>${title}</strong> event.</p>
        <p>If you change your mind, feel free to register again anytime before the event!</p>
        <p>Here are the details of the event you canceled:</p>
        <ul>
          <li><strong>Event Name:</strong> ${title}</li>
          <li><strong>Attendee:</strong> ${username}</li>
        </ul>
        <p>If you need further assistance, please don't hesitate to contact us.</p>
        <p>Best regards,</p>
        <p><strong>Event Team</strong></p>
      </div>
    `;
};
