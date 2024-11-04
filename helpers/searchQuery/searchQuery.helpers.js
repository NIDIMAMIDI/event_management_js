export const query = async (title, date, location, capacity) => {
  const searchQuery = {};

  if (title) {
    searchQuery.title = { $regex: title, $options: 'i' }; // Case-insensitive search
  }
  if (date) {
    searchQuery.date = new Date(date);
  }
  if (location) {
    searchQuery.location = { $regex: location, $options: 'i' }; // Case-insensitive search
  }
  if (capacity) {
    searchQuery.capacity = capacity;
  }

  return searchQuery;
};
