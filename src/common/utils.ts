export const convertDateFormat = (input: number): string => {
  const date = new Date(input);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

export const passengerTypePrice: Record<string, number> = {
  kid: 30,
  adult: 100,
  old: 20,
};
