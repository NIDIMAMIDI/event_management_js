export const convertNames = async (name) => {
  const loweredName = name.toLowerCase();
  const trimmedName = loweredName.trim();

  return trimmedName;
};
