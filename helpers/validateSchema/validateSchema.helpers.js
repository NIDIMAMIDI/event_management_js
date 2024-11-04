export const validateSchema = (schema, data) => {
  // Validate the data against the provided schema
  const { value, error } = schema.validate(data, {
    // Options to handle validation errors
    abortEarly: false, // Collect all errors rather than stopping at the first error
    allowUnknown: true // Allow properties not defined in the schema
  });

  // Return both the validated value and the error object
  return { value, error };
};
