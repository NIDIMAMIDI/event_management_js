import { User } from '../../models/user/user.model.js';

export const checkAttendeesAndCapacity = async (attendees, capacity, res) => {
  let validAttendees = [];
  let adjustedCapacity = capacity;

  if (attendees && attendees.length > 0) {
    // Find valid attendees from the User model
    const validAttendeesList = await User.find({ _id: { $in: attendees } });
    validAttendees = validAttendeesList.map((user) => user._id);

    // Check if the number of valid attendees exceeds the event capacity
    if (validAttendees.length > capacity) {
      return res.status(400).json({
        status: 'failure',
        // eslint-disable-next-line max-len
        message: `Number of valid attendees (${validAttendees.length}) exceeds the event capacity (${capacity})`
      });
    }

    // Adjust the capacity by subtracting the number of valid attendees
    adjustedCapacity = capacity - validAttendees.length;
  }

  return { validAttendees, adjustedCapacity };
};
