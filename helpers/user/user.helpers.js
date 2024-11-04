// Helper function to create a new user
export const userCreate = async (Model, name, email, password) => {
  // Create a new user document in the database
  const user = await Model.create({ username: name, email, password });
  return user;
};
