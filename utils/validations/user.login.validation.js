import Joi from 'joi';
import { validateSchema } from '../../helpers/validateSchema/validateSchema.helpers.js';

// Middleware function for validating user registration input
export const loginValidation = async (req, res, next) => {
  try {
    // Define a Joi validation schema for user input
    const schema = Joi.object({
      // Email field: must be a valid email address and is required
      email: Joi.string().email().required(),

      // Password field: must be a string that matches the specified regex pattern and is required
      password: Joi.string().required()
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
    // console.error('Validation error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred during validation'
    });
  }
};
