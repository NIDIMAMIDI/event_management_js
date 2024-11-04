import { User } from '../../models/user/user.model.js';
import { Event } from '../../models/event/event.model.js';
import { convertNames } from '../../helpers/convert/uniqueness.helpers.js';
import { query } from '../../helpers/searchQuery/searchQuery.helpers.js';
import { checkAttendeesAndCapacity } from '../../helpers/checkAttendees/checkAttendees.helpers.js';
import {
  attendeeList,
  insertAttendees
} from '../../helpers/attendeeList/attendeeList.helpers.js';
import { Attendee } from '../../models/attendees/attendees.model.js';
import {
  eventCancelRegistrationMail,
  eventRegistration
} from '../../helpers/email/email.helpers.js';

export const createEvent = async (req, res, next) => {
  try {
    // Destructure the validated values
    const { title, description, date, location, capacity, attendees } = req.body;
    const createdBy = req.user.id;

    // Find the user who is creating the event
    const user = await User.findById(createdBy);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User does not exist'
      });
    }

    // Convert the title to a unique format if needed
    const eventTitle = await convertNames(title);

    // Check if the user has already registered an event with the same title
    const existingEvent = await Event.findOne({ title: eventTitle, createdBy: user._id });
    if (existingEvent) {
      return res.status(400).json({
        status: 'failure',
        message: 'You have already registered an event with this title'
      });
    }

    // Convert the string date to a JavaScript Date object
    const eventDate = new Date(date);

    // Initialize variables for attendees validation
    const { validAttendees, adjustedCapacity } = await checkAttendeesAndCapacity(
      attendees,
      capacity,
      res
    );

    // Create and save the event
    const newEvent = await Event.create({
      title: eventTitle,
      description,
      date: eventDate, // Use the Date object in the event creation
      location,
      capacity: adjustedCapacity, // Use adjusted capacity if attendees are present
      createdBy: user._id
    });

    // Save valid attendees to the Attendee model
    await insertAttendees(validAttendees, newEvent._id);

    // Retrieve the attendees for the created event
    const attendeesList = await attendeeList(newEvent._id);

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      event: newEvent,
      attendees: attendeesList.map((att) => att.user_id) // Only include user details
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while creating the event',
      error: err.message
    });
  }
};

export const allEvents = async (req, res, next) => {
  try {
    // Get query parameters for pagination and search
    const { page = 1, limit = 2, title, date, location, capacity } = req.query;

    // Convert pagination parameters to numbers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // Build the query object for search
    const searchQuery = await query(title, date, location, capacity);

    // Find the events with pagination and search
    const events = await Event.find(searchQuery)
      .skip((pageNumber - 1) * pageSize) // Skip the number of documents based on the page
      .limit(pageSize); // Limit the number of documents per page

    // Return the response with pagination  and events
    res.status(200).json({
      status: 'success',
      page: pageNumber,
      events
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while fetching events',
      error: err.message
    });
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the event by ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        status: 'failure',
        message: 'Event not found with the provided ID.'
      });
    }

    // Retrieve the list of attendees for the event
    const attendeesList = await attendeeList(event._id);

    // If attendeesList is empty or not found
    if (!attendeesList) {
      return res.status(200).json({
        status: 'success',
        message: 'Event found but no attendees registered yet.',
        event,
        attendees: []
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Event details retrieved successfully.',
      event,
      attendees: attendeesList.map((att) => att.user_id) // Return the user IDs of the attendees
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while retrieving the event details.',
      error: err.message
    });
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    // Check if the event exists
    if (!event) {
      return res.status(404).json({
        status: 'failure',
        message: 'Event not found with the provided ID.'
      });
    }

    const userId = req.user.id;

    // Ensure the event creator is the one making the update
    if (event.createdBy.toString() !== userId) {
      return res.status(403).json({
        status: 'failure',
        message: 'You are not authorized to perform this action.'
      });
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated event
      runValidators: true // Ensure the data passes schema validation
    });

    return res.status(200).json({
      status: 'success',
      message: 'Event updated successfully.',
      event: updatedEvent
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while updating the event.',
      error: err.message
    });
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    // Check if the event exists
    if (!event) {
      return res.status(404).json({
        status: 'failure',
        message: 'Event not found with the provided ID.'
      });
    }

    const userId = req.user.id;

    // Ensure the event creator is the one making the update
    if (event.createdBy.toString() !== userId) {
      return res.status(403).json({
        status: 'failure',
        message: 'You are not authorized to perform this action.'
      });
    }
    await Event.findByIdAndDelete(event._id);
    await Attendee.deleteMany({ event_id: event._id });
    return res.status(200).json({
      status: 'success',
      message: 'Event and its attendees have been deleted successfully.'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while deleting the event.',
      error: err.message
    });
  }
};

export const eventRegister = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if the event exists
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        status: 'failure',
        message: 'Event not found with the provided ID.'
      });
    }

    // Check if the event is already full
    if (event.capacity <= 0) {
      return res.status(400).json({
        status: 'failure',
        message: 'The event has reached its maximum capacity.'
      });
    }

    // Check if the user is already registered for the event
    const existingAttendee = await Attendee.findOne({
      event_id: event._id,
      user_id: userId
    });
    if (existingAttendee) {
      return res.status(400).json({
        status: 'failure',
        message: 'You are already registered for this event.'
      });
    }

    // Register the user as an attendee
    const attendee = await Attendee.create({ event_id: event._id, user_id: userId });

    // Decrease the event capacity by 1 and save
    event.capacity -= 1;
    await event.save();

    // send the registered event mail to user
    eventRegistration(userId, event.title);

    return res.status(201).json({
      status: 'success',
      message: 'You have successfully registered for the event.',
      attendee
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred during registration.',
      error: err.message
    });
  }
};

export const cancelEventRegister = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if the event exists
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        status: 'failure',
        message: 'Event not found with the provided ID.'
      });
    }

    // Check if the user is registered for the event
    const attendee = await Attendee.findOne({ user_id: userId, event_id: event._id });
    if (!attendee) {
      return res.status(404).json({
        status: 'failure',
        message: 'You are not registered for this event.'
      });
    }

    // Delete the attendee entry to cancel registration
    await Attendee.findOneAndDelete({ user_id: userId, event_id: event._id });

    // Increment event capacity since the registration is canceled
    event.capacity += 1;
    await event.save();

    //  send the cancellation event mail to user
    eventCancelRegistrationMail(userId, event.title);

    return res.status(200).json({
      status: 'success',
      message: 'You have successfully canceled your registration for the event.'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while canceling the registration.',
      error: err.message
    });
  }
};
