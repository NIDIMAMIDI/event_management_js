import Joi from 'joi';
import { validateSchema } from '../../helpers/validateSchema/validateSchema.helpers.js';

// Middleware function for validating event creation input
export const eventValidation = (req, res, next) => {
  try {
    // Define a Joi validation schema for event input
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().optional(),
      date: Joi.date().iso().min('now').required().messages({
        'date.base': 'Date must be a valid date.',
        'date.format': 'Date must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ).',
        'date.min': 'Date must be in the future.',
        'any.required': 'date is required field.'
      }),
      location: Joi.string().required(),
      capacity: Joi.number().min(1).required(),
      attendees: Joi.array().items(Joi.string().optional()) // Attendees as an array of user IDs
    });

    // Validate the request body against the defined schema
    const { error } = validateSchema(schema, req.body);

    // If there are validation errors, send a response with status 400 (Bad Request)
    if (error) {
      return res.status(400).json({
        status: 'failure',
        message: error.details[0].message
      });
    }

    // Proceed to the next middleware if validation is successful
    next();
  } catch (err) {
    // Handle unexpected errors
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred during validation',
      error: err.message // Include the actual error message for debugging
    });
  }
};
