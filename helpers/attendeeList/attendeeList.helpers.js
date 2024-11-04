import { Attendee } from '../../models/attendees/attendees.model.js';

export const insertAttendees = async (validAttendees, id) => {
  if (validAttendees.length > 0) {
    await Attendee.insertMany(
      validAttendees.map((attendeeId) => ({
        event_id: id,
        user_id: attendeeId
      }))
    );
  }
};

export const attendeeList = async (id) => {
  const attendeesList = await Attendee.find({ event_id: id }).populate(
    'user_id',
    'username'
  );
  return attendeesList;
};
