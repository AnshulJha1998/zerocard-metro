export const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};

export const generateRandomNumber = () => {
  return Math.floor(1000000 + Math.random() * 9000000);
};
