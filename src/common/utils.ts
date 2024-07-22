import { JOURNEY_TYPE, USER_TYPE } from "./types";

export const passengerTypePrice: Record<string, number> = {
  kid: 30,
  adult: 100,
  old: 20,
};

export const formatDateTime = (date: string) => {
  const modDate = new Date(date);
  const day = modDate.getDate();
  const month = modDate.toLocaleString("en-US", { month: "long" });
  const year = modDate.getFullYear();

  return `${day}, ${month} ${year}`;
};

export const isSameDay = (d1: string, d2: string) => {
  const modDate1 = new Date(d1);
  const modDate2 = new Date(d2);
  return (
    (modDate1.getDate() === modDate2.getDate() &&
      modDate1.getMonth() === modDate2.getMonth() &&
      modDate1.getFullYear() === modDate2.getFullYear()) ||
    null
  );
};

export const calcDiscount = (
  user: USER_TYPE<JOURNEY_TYPE>,
  inputFrom: string,
  inputTo: string,
  inputDate: string
) => {
  const lastJourney = user.journeys[user.journeys.length - 1];
  const secondLastJourney = user.journeys[user.journeys.length - 2];

  let discount = 0;
  let totalAmount = passengerTypePrice[user.passengerType];
  let returnJourney: boolean | null = false;

  const secondLastCondition =
    secondLastJourney?.from === inputFrom &&
    secondLastJourney?.to === inputTo &&
    isSameDay(secondLastJourney?.travelDate, inputDate);

  returnJourney =
    lastJourney?.from === inputTo &&
    lastJourney?.to === inputFrom &&
    isSameDay(lastJourney?.travelDate, inputDate);

  if (user.journeys.length % 2 === 0 && secondLastCondition) {
    returnJourney = false;
  } else if (user.journeys.length % 2 !== 0 && secondLastCondition) {
    returnJourney = true;
  }

  if (returnJourney) {
    discount = totalAmount * 0.5;
  }

  totalAmount -= discount;
  return totalAmount;
};
