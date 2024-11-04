import { User } from '../../models/user/user.model.js';
import { sendMail } from '../../utils/email/email.send.js';
import { eventCancelRegistrationTemplate } from '../../utils/templates/cancel.register.event.template.js';
import { eventRegistrationTemplate } from '../../utils/templates/register.event.template.js';

// Send an email with a generated password for forgot password functionality
export const eventRegistration = async (id, title) => {
  const user = await User.findById(id);
  // Email details
  const to = user.email;
  const subject = `${user.username}, you are successfully registered for the ${title} event!`;
  const text = `Dear ${user.username},\n\nYou have successfully registered for the ${title} event.`;
  const template = await eventRegistrationTemplate(user.username, title);

  // Send the email using sendMail function
  await sendMail(to, subject, text, template);
};

// Send an email with a generated password for forgot password functionality
export const eventCancelRegistrationMail = async (id, title) => {
  const user = await User.findById(id);
  // Email details
  const to = user.email;
  const subject = `${user.username}, you have successfully cancelled the registered  ${title} event!`;
  const text = `Dear ${user.username},\n\nYou have successfully cancelled the registered ${title} event.`;
  const template = await eventCancelRegistrationTemplate(user.username, title);

  // Send the email using sendMail function
  await sendMail(to, subject, text, template);
};
