export const getIdFromQuery = (requestQuery: string): number => {
  const regExp = /(?<=:\s+)[\w+ ]+/;
  return Number(regExp.exec(requestQuery));
};
