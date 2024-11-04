/* eslint-disable max-len */
export const eventRegistrationTemplate = (username, title) => {
  return `
      <div style="font-family: Arial, sans-serif; font-size: 16px;">
        <h2>Hello ${username},</h2>
        <p>We are excited to inform you that you have successfully registered for the <strong>${title}</strong> event!</p>
        <p>Here are the details:</p>
        <ul>
          <li><strong>Event Name:</strong> ${title}</li>
          <li><strong>Attendee:</strong> ${username}</li>
        </ul>
        <p>We look forward to seeing you there!</p>
        <p>Best regards,</p>
        <p><strong>Event Team</strong></p>
      </div>
    `;
};
