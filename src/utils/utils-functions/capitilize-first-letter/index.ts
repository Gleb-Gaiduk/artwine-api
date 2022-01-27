const capitalizeFirstLetter = (string: string): string => {
  const trimmedLowerCased = string.toLowerCase().trim();
  return trimmedLowerCased.charAt(0).toUpperCase() + trimmedLowerCased.slice(1);
};

export default capitalizeFirstLetter;
